import bridge from '@vkontakte/vk-bridge';
import {sendBridgeRequest} from '../services/bridge';

const STORAGE_KEY = 'skt_home_highlights_v1';
const UPDATE = 'homeHighlights/UPDATE';
const highlightIds = ['top_students', 'quality_content', 'services'];
const initialState = {seen: [], loaded: false};
let loadRequest = null;
let saveRequest = null;

export const homeHighlightsReducer = (state = initialState, action) =>
    action.type === UPDATE ? {...state, ...action.payload} : state;

const readSeen = async () => {
    if (!bridge.isEmbedded()) return window.localStorage.getItem(STORAGE_KEY) || '';
    const data = await sendBridgeRequest('VKWebAppStorageGet', {keys: [STORAGE_KEY]});
    const item = data?.keys?.find(item => item.key === STORAGE_KEY);
    if (typeof item?.value !== 'string') throw new Error('Некорректный ответ хранилища.');
    return item.value;
};

const writeSeen = async value => {
    if (!bridge.isEmbedded()) {
        if (value === '') window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, value);
        return;
    }
    const result = await sendBridgeRequest('VKWebAppStorageSet', {key: STORAGE_KEY, value});
    if (result?.result !== true) throw new Error('Сохранение не подтверждено.');
};

export const loadHomeHighlights = () => (dispatch, getState) => {
    if (getState().account.resetting) return Promise.reject(new Error('Выполняется сброс данных.'));
    if (getState().homeHighlights.loaded) return Promise.resolve();
    if (loadRequest) return loadRequest;
    loadRequest = readSeen().then(raw => {
        const parsed = raw === '' ? [] : JSON.parse(raw);
        if (!Array.isArray(parsed)) throw new Error('Некорректные отметки просмотра.');
        dispatch({type: UPDATE, payload: {seen: highlightIds.filter(id => parsed.includes(id)), loaded: true}});
    }).finally(() => { loadRequest = null; });
    return loadRequest;
};

export const markHomeHighlightSeen = id => (dispatch, getState) => {
    if (!highlightIds.includes(id)) return Promise.reject(new Error('Неизвестный раздел.'));
    if (getState().account.resetting) return Promise.reject(new Error('Выполняется сброс данных.'));
    // Serialize marks so opening two destinations cannot overwrite the first one.
    const request = (saveRequest || Promise.resolve()).catch(() => {}).then(async () => {
        if (getState().account.resetting) return;
        await dispatch(loadHomeHighlights());
        if (getState().account.resetting || getState().homeHighlights.seen.includes(id)) return;
        const seen = [...getState().homeHighlights.seen, id];
        await writeSeen(JSON.stringify(seen));
        dispatch({type: UPDATE, payload: {seen}});
    }).finally(() => {
        if (saveRequest === request) saveRequest = null;
    });
    saveRequest = request;
    return request;
};

export const resetHomeHighlights = () => async dispatch => {
    await Promise.allSettled([loadRequest, saveRequest].filter(Boolean));
    await writeSeen('');
    dispatch({type: UPDATE, payload: {seen: [], loaded: true}});
};
