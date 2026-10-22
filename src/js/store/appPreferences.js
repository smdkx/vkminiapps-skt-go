import bridge from '@vkontakte/vk-bridge';
import {sendBridgeRequest, setHapticsEnabled} from '../services/bridge';

const STORAGE_KEY = 'skt_app_preferences_v1';
const NOTIFICATION_CHECK_TIMEOUT = 15000;
const UPDATE = 'appPreferences/UPDATE';
const defaults = {theme: 'auto', haptics: true};
const initialState = {...defaults, loaded: false, loading: false, saving: false,
    notificationsEnabled: null, notificationsLoading: false, notificationsSaving: false,
    notificationsChecked: false, notificationsSupported: null, notificationsUnavailableReason: null};
let loadRequest = null;
let saveRequest = null;
let notificationLoad = null;
let notificationSave = null;

export const appPreferencesReducer = (state = initialState, action) =>
    action.type === UPDATE ? {...state, ...action.payload} : state;

const validate = value => {
    if (!value || !['auto', 'light', 'dark'].includes(value.theme) || typeof value.haptics !== 'boolean') {
        throw new Error('Некорректные настройки приложения.');
    }
    return {theme: value.theme, haptics: value.haptics};
};

const readPreferences = async () => {
    if (!bridge.isEmbedded()) return window.localStorage.getItem(STORAGE_KEY) || '';
    const data = await sendBridgeRequest('VKWebAppStorageGet', {keys: [STORAGE_KEY]});
    const item = data?.keys?.find(item => item.key === STORAGE_KEY);
    if (typeof item?.value !== 'string') throw new Error('Некорректный ответ хранилища.');
    return item.value;
};

const writePreferences = async value => {
    if (!bridge.isEmbedded()) {
        if (value === '') window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, value);
        return;
    }
    const result = await sendBridgeRequest('VKWebAppStorageSet', {key: STORAGE_KEY, value});
    if (result?.result !== true) throw new Error('Сохранение не подтверждено.');
};

export const loadAppPreferences = () => (dispatch, getState) => {
    if (getState().account.resetting) return Promise.reject(new Error('Выполняется сброс данных.'));
    if (saveRequest) return saveRequest;
    if (getState().appPreferences.loaded) return Promise.resolve(getState().appPreferences);
    if (loadRequest) return loadRequest;
    dispatch({type: UPDATE, payload: {loading: true}});
    loadRequest = readPreferences().then(raw => {
        const preferences = raw === '' ? defaults : validate(JSON.parse(raw));
        setHapticsEnabled(preferences.haptics);
        dispatch({type: UPDATE, payload: {...preferences, loaded: true}});
        return preferences;
    }).finally(() => {
        loadRequest = null;
        dispatch({type: UPDATE, payload: {loading: false}});
    });
    return loadRequest;
};

export const saveAppPreferences = update => (dispatch, getState) => {
    if (getState().account.resetting) return Promise.reject(new Error('Выполняется сброс данных.'));
    if (saveRequest) return Promise.reject(new Error('Настройки уже сохраняются.'));
    const loaded = dispatch(loadAppPreferences());
    dispatch({type: UPDATE, payload: {saving: true}});
    saveRequest = loaded.then(async () => {
        const preferences = validate({...getState().appPreferences, ...update});
        await writePreferences(JSON.stringify(preferences));
        setHapticsEnabled(preferences.haptics);
        dispatch({type: UPDATE, payload: preferences});
        return preferences;
    }).finally(() => {
        saveRequest = null;
        dispatch({type: UPDATE, payload: {saving: false}});
    });
    return saveRequest;
};

export const loadNotificationPermission = () => (dispatch, getState) => {
    if (getState().account.resetting) return Promise.reject(new Error('Выполняется сброс данных.'));
    if (notificationSave) return notificationSave;
    if (notificationLoad) return notificationLoad;
    if (getState().appPreferences.notificationsChecked) return Promise.resolve();
    if (!bridge.isEmbedded()) {
        dispatch({type: UPDATE, payload: {notificationsChecked: true, notificationsSupported: false}});
        return Promise.resolve();
    }
    dispatch({type: UPDATE, payload: {notificationsLoading: true}});
    let checkTimeout;
    // Capability negotiation needs a deadline even when launch parameters arrive successfully.
    notificationLoad = Promise.race([
        Promise.all([
            bridge.supportsAsync('VKWebAppAllowNotifications'),
            bridge.supportsAsync('VKWebAppDenyNotifications'),
            sendBridgeRequest('VKWebAppGetLaunchParams'),
        ]),
        new Promise((_, reject) => {
            checkTimeout = setTimeout(() => reject(Object.assign(new Error('Время ожидания истекло.'),
                {code: 'BRIDGE_TIMEOUT'})), NOTIFICATION_CHECK_TIMEOUT);
        }),
    ]).then(([allow, deny, launch]) => {
        if (!allow || !deny) {
            dispatch({type: UPDATE, payload: {notificationsChecked: true, notificationsSupported: false}});
            return;
        }
        const enabled = launch?.vk_are_notifications_enabled;
        if (enabled !== 0 && enabled !== 1) throw new Error('Статус уведомлений неизвестен.');
        dispatch({type: UPDATE, payload: {notificationsEnabled: enabled === 1,
            notificationsChecked: true, notificationsSupported: true, notificationsUnavailableReason: null}});
    }).finally(() => {
        clearTimeout(checkTimeout);
        notificationLoad = null;
        dispatch({type: UPDATE, payload: {notificationsLoading: false}});
    });
    return notificationLoad;
};

export const saveNotificationPermission = enabled => (dispatch, getState) => {
    if (getState().account.resetting) return Promise.reject(new Error('Выполняется сброс данных.'));
    if (notificationSave) return Promise.reject(new Error('Разрешение уже меняется.'));
    if (typeof enabled !== 'boolean' || !getState().appPreferences.notificationsSupported ||
        getState().appPreferences.notificationsEnabled === null) return Promise.reject(new Error('Уведомления недоступны.'));
    const method = enabled ? 'VKWebAppAllowNotifications' : 'VKWebAppDenyNotifications';
    dispatch({type: UPDATE, payload: {notificationsSaving: true}});
    notificationSave = sendBridgeRequest(method, {}, 60000)
        .then(result => {
            if (result?.result !== true) throw Object.assign(new Error('Изменение разрешения не подтверждено.'),
                {code: 'NOTIFICATIONS_UNCONFIRMED'});
            dispatch({type: UPDATE, payload: {notificationsEnabled: enabled}});
        }).catch(error => {
            const description = error?.error_data?.error_reason ?? error?.error_data?.error_description;
            console.warn('VK notification permission failed', {
                method,
                type: error?.error_type,
                code: error?.error_data?.error_code ?? error?.code,
                description: error?.error_data?.error_reason ?? error?.error_data?.error_description ?? error?.message,
            });
            if (enabled && error?.error_type === 'client_error' && error?.error_data?.error_code === 6 &&
                typeof description === 'string' && /Notifications are not allowed for untrusted apps/i.test(description)) {
                dispatch({type: UPDATE, payload: {notificationsSupported: false, notificationsUnavailableReason: 'untrusted'}});
                throw Object.assign(new Error('Уведомления временно недоступны.'),
                    {code: 'NOTIFICATIONS_UNTRUSTED_APP'});
            }
            throw error;
        }).finally(() => {
            notificationSave = null;
            dispatch({type: UPDATE, payload: {notificationsSaving: false}});
        });
    return notificationSave;
};

export const resetAppPreferences = () => async dispatch => {
    await Promise.allSettled([loadRequest, saveRequest, notificationLoad, notificationSave].filter(Boolean));
    await writePreferences('');
    setHapticsEnabled(true);
    // VK permissions are external to the app's stored data and stay unchanged.
    dispatch({type: UPDATE, payload: {...defaults, loaded: true}});
};
