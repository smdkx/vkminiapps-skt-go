import localMemes from '../components/data/local-memes.data.json';
import {sendBridgeRequest} from '../services/bridge';

// File names are independent of the IDs already saved in VK Storage.
export const memeCatalog = localMemes.map(({id, file}) => ({
    id,
    src: `${import.meta.env.BASE_URL}memes/${file}`,
}));

// Stable image IDs survive reordering and refreshed CDN query parameters.
// Separate keys prevent one device from overwriting another device's views.
const storageKey = id => `skt_meme_seen_v1_${id}`;
const RECEIVED = 'memes/RECEIVED';
const SAVING = 'memes/SAVING';
const SAVED = 'memes/SAVED';
const SAVE_FAILED = 'memes/SAVE_FAILED';
const RESETTING = 'memes/RESETTING';
const CLEARED = 'memes/CLEARED';
const initialState = {seen: [], confirmedSeen: [], loaded: false, saving: false, saveFailed: false, resetting: false};
let loadRequest = null;
let loadWriteIds = null;
let saveRequest = null;
let resetRequest = null;
const savedIds = new Set();

export const memesReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVED: return action.loaded
            ? {...state, seen: [...new Set([...action.seen, ...(action.pendingSeen || [])])],
                confirmedSeen: action.seen, loaded: true}
            : {...state, seen: [...new Set([...state.seen, ...action.seen])]};
        case SAVING: return {...state, saving: true};
        case SAVED: return {...state, confirmedSeen: action.seen, saving: false, saveFailed: false};
        case SAVE_FAILED: return {...state, saving: false, saveFailed: true};
        case RESETTING: return {...state, resetting: action.value};
        case CLEARED: {
            const seen = state.seen.filter(id => !action.ids.includes(id));
            return {...state, seen, confirmedSeen: state.confirmedSeen.filter(id => !action.ids.includes(id)),
                saveFailed: state.saveFailed && seen.length > 0};
        }
        default: return state;
    }
};

const loadProgress = (dispatch, getState) => {
    if (loadRequest) return loadRequest;
    const writesDuringLoad = new Set();
    loadWriteIds = writesDuringLoad;
    loadRequest = sendBridgeRequest('VKWebAppStorageGet', {keys: memeCatalog.map(meme => storageKey(meme.id))})
        .then(data => {
            if (!data || !Array.isArray(data.keys)) throw new Error('Некорректная история просмотров.');
            const seen = [];
            memeCatalog.forEach(meme => {
                const item = data.keys.find(entry => entry && entry.key === storageKey(meme.id));
                if (!item || (item.value !== '' && item.value !== '1')) {
                    throw new Error('Некорректная история просмотров.');
                }
                if (item.value === '1') seen.push(meme.id);
            });
            // Replace the server snapshot, keeping only unsaved views and writes acknowledged during this read.
            const pendingSeen = getState().memes.seen.filter(id => !savedIds.has(id));
            const confirmedSeen = [...new Set([...seen, ...writesDuringLoad])];
            savedIds.clear();
            confirmedSeen.forEach(id => savedIds.add(id));
            dispatch({type: RECEIVED, seen: confirmedSeen, pendingSeen, loaded: true});
            return seen;
        })
        .finally(() => { loadRequest = null; loadWriteIds = null; });
    return loadRequest;
};

export const loadMemeProgress = () => (dispatch, getState) => {
    if (resetRequest) return resetRequest.then(() => dispatch(loadMemeProgress()));
    return loadProgress(dispatch, getState);
};

export const saveMemeProgress = () => (dispatch, getState) => {
    if (getState().account.resetting) return Promise.reject(new Error('Выполняется сброс данных.'));
    if (getState().memes.resetting) return Promise.reject(new Error('История просмотров сбрасывается.'));
    if (saveRequest) return saveRequest;
    dispatch({type: SAVING});
    saveRequest = Promise.resolve().then(async () => {
        if (!getState().memes.loaded) await loadProgress(dispatch, getState);
        // Read the latest state after each acknowledgement: quick clicks cannot overwrite newer views.
        while (true) {
            const id = getState().memes.seen.find(id => !savedIds.has(id));
            if (!id) break;
            const result = await sendBridgeRequest('VKWebAppStorageSet', {key: storageKey(id), value: '1'});
            if (!result || result.result !== true) throw new Error('VK не подтвердил сохранение просмотров.');
            savedIds.add(id);
            if (loadWriteIds) loadWriteIds.add(id);
        }
        dispatch({type: SAVED, seen: [...savedIds]});
    }).catch(error => {
        dispatch({type: SAVE_FAILED});
        throw error;
    }).finally(() => { saveRequest = null; });
    return saveRequest;
};

export const markMemeSeen = id => (dispatch, getState) => {
    if (getState().account.resetting) return Promise.reject(new Error('Выполняется сброс данных.'));
    if (getState().memes.resetting) return Promise.reject(new Error('История просмотров сбрасывается.'));
    if (!memeCatalog.some(meme => meme.id === id)) return Promise.reject(new Error('Неизвестный мем.'));
    dispatch({type: RECEIVED, seen: [id]});
    return dispatch(saveMemeProgress());
};

export const resetMemeProgress = ({all = false} = {}) => (dispatch, getState) => {
    if (resetRequest) return resetRequest;
    const pending = [loadRequest, saveRequest].filter(Boolean);
    dispatch({type: RESETTING, value: true});
    resetRequest = Promise.all(pending.map(request => request.catch(() => {})))
        .then(async () => {
            // Refresh VK Storage first: another device may have saved additional views.
            if (!all) await loadProgress(dispatch, getState);
            const ids = all ? memeCatalog.map(meme => meme.id)
                : [...new Set([...getState().memes.seen, ...savedIds])];
            const cleared = [];
            for (const id of ids) {
                try {
                    const result = await sendBridgeRequest('VKWebAppStorageSet', {key: storageKey(id), value: ''});
                    if (result && result.result === true) {
                        savedIds.delete(id);
                        cleared.push(id);
                    }
                } catch {
                    // Keep unconfirmed entries so a retry can clear the remaining history.
                }
            }
            dispatch({type: CLEARED, ids: cleared});
            if (cleared.length !== ids.length) throw new Error('Не удалось сбросить все просмотры.');
        })
        .finally(() => {
            resetRequest = null;
            dispatch({type: RESETTING, value: false});
        });
    return resetRequest;
};
