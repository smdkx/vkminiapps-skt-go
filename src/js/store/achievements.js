import {sendBridgeRequest} from '../services/bridge';

export const NEWBIE_TIME_REQUIRED = 5 * 60 * 1000;
const NEWBIE_TIME_KEY = 'skt_achievement_newbie_time_v1';
const STORAGE_KEYS = {
    newbie: 'skt_achievement_newbie_v1',
    steep: 'skt_achievement_steep_v1',
    donut: 'skt_achievement_donut_v1',
    subscriber: 'skt_achievement_subscriber_v1',
    star: 'skt_achievement_star_v1',
    static: 'skt_achievement_static_v1',
    easteregg: 'skt_achievement_easteregg_v1',
};
const RECEIVED = 'achievements/RECEIVED';
const CLEARED = 'achievements/CLEARED';
const RESETTING = 'achievements/RESETTING';
const USAGE_RECEIVED = 'achievements/USAGE_RECEIVED';
const initialState = {earned: {}, loaded: false, resetting: false, newbieTime: 0};
let loadRequest = null;
let resetRequest = null;
let usageRequest = null;
const saveRequests = new Map();

export const achievementsReducer = (state = initialState, action) => {
    if (action.type === RECEIVED) return {...state, earned: {...state.earned, ...action.payload}, loaded: true};
    if (action.type === USAGE_RECEIVED) return {...state, newbieTime: action.payload};
    if (action.type === RESETTING) return {...state, resetting: action.payload};
    if (action.type === CLEARED) {
        const earned = {...state.earned};
        action.payload.forEach(id => { delete earned[id]; });
        return {...state, earned,
            newbieTime: action.payload.includes('newbieTime') ? 0 : state.newbieTime,
            loaded: state.loaded || action.payload.length === Object.keys(STORAGE_KEYS).length + 1};
    }
    return state;
};

const readAchievements = () => (dispatch, getState) => {
    if (resetRequest) return resetRequest.then(() => dispatch(readAchievements()));
    if (getState().achievements.loaded) return Promise.resolve(getState().achievements.earned);
    if (loadRequest) return loadRequest;

    loadRequest = sendBridgeRequest('VKWebAppStorageGet', {keys: [...Object.values(STORAGE_KEYS), NEWBIE_TIME_KEY]})
        .then(data => {
            if (!data || !Array.isArray(data.keys)) throw new Error('Некорректный ответ хранилища VK.');
            const earned = {};
            Object.keys(STORAGE_KEYS).forEach(id => {
                const item = data.keys.find(entry => entry && entry.key === STORAGE_KEYS[id]);
                if (!item || typeof item.value !== 'string') throw new Error('Некорректный ответ хранилища VK.');
                if (item.value === '') return;
                const earnedAt = Number(item.value);
                if (!/^\d+$/.test(item.value) || !Number.isSafeInteger(earnedAt) || earnedAt <= 0) {
                    throw new Error('Некорректная дата достижения.');
                }
                earned[id] = earnedAt;
            });
            const progress = data.keys.find(entry => entry && entry.key === NEWBIE_TIME_KEY);
            if (!progress || typeof progress.value !== 'string' ||
                (progress.value !== '' && !/^\d+$/.test(progress.value)) ||
                !Number.isSafeInteger(Number(progress.value)) || Number(progress.value) > NEWBIE_TIME_REQUIRED) {
                throw new Error('Некорректный прогресс достижения.');
            }
            dispatch({type: USAGE_RECEIVED, payload: Number(progress.value)});
            dispatch({type: RECEIVED, payload: earned});
            return earned;
        })
        .finally(() => { loadRequest = null; });
    return loadRequest;
};

const hasAllOtherAchievements = earned => Object.keys(STORAGE_KEYS)
    .every(id => id === 'steep' || Boolean(earned[id]));

const awardSteep = (dispatch, getState) => {
    const {earned, resetting} = getState().achievements;
    if (resetting || earned.steep || !hasAllOtherAchievements(earned)) return Promise.resolve();
    return dispatch(earnAchievement('steep'));
};

export const loadAchievements = () => async (dispatch, getState) => {
    await dispatch(readAchievements());
    if (!getState().achievements.earned.newbie && getState().achievements.newbieTime >= NEWBIE_TIME_REQUIRED) {
        await dispatch(earnAchievement('newbie'));
    }
    await awardSteep(dispatch, getState);
    return getState().achievements.earned;
};

export const earnAchievement = (id) => (dispatch, getState) => {
    if (!Object.prototype.hasOwnProperty.call(STORAGE_KEYS, id)) return Promise.reject(new Error('Неизвестное достижение.'));
    if (resetRequest) return Promise.reject(new Error('Выполняется сброс достижений.'));
    if (saveRequests.has(id)) return saveRequests.get(id);

    const request = dispatch(readAchievements())
        .then(async () => {
            const existing = getState().achievements.earned[id];
            if (existing) return existing;
            if (id === 'steep' && !hasAllOtherAchievements(getState().achievements.earned)) {
                throw new Error('Получены не все достижения.');
            }
            if (id === 'newbie' && getState().achievements.newbieTime < NEWBIE_TIME_REQUIRED) {
                throw new Error('Недостаточно времени в приложении.');
            }

            const earnedAt = Date.now();
            const result = await sendBridgeRequest('VKWebAppStorageSet', {key: STORAGE_KEYS[id], value: String(earnedAt)});
            if (!result || result.result !== true) throw new Error('VK не подтвердил сохранение достижения.');
            dispatch({type: RECEIVED, payload: {[id]: earnedAt}});
            return earnedAt;
        })
        .then(async earnedAt => {
            // A bonus save failure must not turn a confirmed base award into an error.
            // Opening achievements retries the bonus and reports any storage error.
            if (id !== 'steep') await awardSteep(dispatch, getState).catch(() => {});
            return earnedAt;
        })
        .finally(() => { saveRequests.delete(id); });
    saveRequests.set(id, request);
    return request;
};

export const recordUsageTime = milliseconds => (dispatch, getState) => {
    if (!Number.isSafeInteger(milliseconds) || milliseconds < 0) return Promise.reject(new Error('Некорректное время.'));
    if (resetRequest || usageRequest) return Promise.reject(new Error('Сохранение прогресса недоступно.'));
    usageRequest = dispatch(readAchievements())
        .then(async () => {
            const {newbieTime, earned} = getState().achievements;
            if (earned.newbie) return;
            const total = Math.min(NEWBIE_TIME_REQUIRED, newbieTime + milliseconds);
            if (total !== newbieTime) {
                const result = await sendBridgeRequest('VKWebAppStorageSet', {key: NEWBIE_TIME_KEY, value: String(total)});
                if (!result || result.result !== true) throw new Error('Не удалось сохранить прогресс.');
                dispatch({type: USAGE_RECEIVED, payload: total});
            }
            if (!getState().achievements.resetting && total >= NEWBIE_TIME_REQUIRED) {
                await dispatch(earnAchievement('newbie'));
            }
        })
        .finally(() => { usageRequest = null; });
    return usageRequest;
};

export const resetAchievements = () => dispatch => {
    if (resetRequest) return resetRequest;
    const pending = [loadRequest, usageRequest, ...saveRequests.values()].filter(Boolean);
    dispatch({type: RESETTING, payload: true});
    resetRequest = Promise.all(pending.map(request => request.catch(() => {})))
        .then(async () => {
            const entries = [...Object.entries(STORAGE_KEYS), ['newbieTime', NEWBIE_TIME_KEY]];
            const results = await Promise.all(entries.map(async ([id, key]) => {
                try {
                    const result = await sendBridgeRequest('VKWebAppStorageSet', {key, value: ''});
                    return result && result.result === true ? id : null;
                } catch (error) {
                    return null;
                }
            }));
            const cleared = results.filter(Boolean);
            dispatch({type: CLEARED, payload: cleared});
            if (cleared.length !== entries.length) throw new Error('Не удалось сбросить все достижения.');
        })
        .finally(() => {
            resetRequest = null;
            dispatch({type: RESETTING, payload: false});
        });
    return resetRequest;
};
