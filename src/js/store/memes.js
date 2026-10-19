import localMemes from '../components/data/local-memes.data.json';
import {sendBridgeRequest} from '../services/bridge';

// File names are independent of the IDs already saved in VK Storage.
export const memeCatalog = localMemes.map(({id, file}) => ({
    id,
    src: `${process.env.PUBLIC_URL}/memes/${file}`,
}));

// Stable image IDs survive reordering and refreshed CDN query parameters.
// Separate keys prevent one device from overwriting another device's views.
const storageKey = id => `skt_meme_seen_v1_${id}`;
const RECEIVED = 'memes/RECEIVED';
const SAVING = 'memes/SAVING';
const SAVED = 'memes/SAVED';
const SAVE_FAILED = 'memes/SAVE_FAILED';
const initialState = {seen: [], loaded: false, saving: false, saveFailed: false};
let loadRequest = null;
let saveRequest = null;
const savedIds = new Set();

export const memesReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVED: return {...state, seen: [...new Set([...state.seen, ...action.seen])], loaded: state.loaded || !!action.loaded};
        case SAVING: return {...state, saving: true};
        case SAVED: return {...state, saving: false, saveFailed: false};
        case SAVE_FAILED: return {...state, saving: false, saveFailed: true};
        default: return state;
    }
};

export const loadMemeProgress = () => (dispatch) => {
    if (loadRequest) return loadRequest;
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
            seen.forEach(id => savedIds.add(id));
            dispatch({type: RECEIVED, seen, loaded: true});
            return seen;
        })
        .finally(() => { loadRequest = null; });
    return loadRequest;
};

export const saveMemeProgress = () => (dispatch, getState) => {
    if (saveRequest) return saveRequest;
    dispatch({type: SAVING});
    saveRequest = Promise.resolve().then(async () => {
        if (!getState().memes.loaded) await dispatch(loadMemeProgress());
        // Read the latest state after each acknowledgement: quick clicks cannot overwrite newer views.
        while (true) {
            const id = getState().memes.seen.find(id => !savedIds.has(id));
            if (!id) break;
            const result = await sendBridgeRequest('VKWebAppStorageSet', {key: storageKey(id), value: '1'});
            if (!result || result.result !== true) throw new Error('VK не подтвердил сохранение просмотров.');
            savedIds.add(id);
        }
        dispatch({type: SAVED});
    }).catch(error => {
        dispatch({type: SAVE_FAILED});
        throw error;
    }).finally(() => { saveRequest = null; });
    return saveRequest;
};

export const markMemeSeen = id => dispatch => {
    if (!memeCatalog.some(meme => meme.id === id)) return Promise.reject(new Error('Неизвестный мем.'));
    dispatch({type: RECEIVED, seen: [id]});
    return dispatch(saveMemeProgress());
};
