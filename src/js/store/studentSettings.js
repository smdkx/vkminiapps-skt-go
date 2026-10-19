import {sendBridgeRequest} from '../services/bridge';
import {studentGroups, collegeDepartments, normalizeStudentGroup, isValidStudentGroup} from '../components/data/education.data';

const STORAGE_KEY = 'skt_profile_settings_v1';
const RECEIVED = 'studentSettings/RECEIVED';
const LOADING = 'studentSettings/LOADING';
const SAVING = 'studentSettings/SAVING';
const initialState = {group: '', department: '', loaded: false, loading: false, saving: false};
let loadRequest = null;
let saveRequest = null;

export const studentSettingsReducer = (state = initialState, action) => {
    if (action.type === RECEIVED) return {...state, ...action.payload, loaded: true};
    if (action.type === LOADING) return {...state, loading: action.payload};
    if (action.type === SAVING) return {...state, saving: action.payload};
    return state;
};

const validateSettings = value => {
    if (!value || typeof value !== 'object' || typeof value.group !== 'string' ||
        typeof value.department !== 'string') throw new Error('Некорректные настройки.');
    const group = normalizeStudentGroup(value.group);
    if (!isValidStudentGroup(group) || (value.department !== '' &&
        !collegeDepartments.some(item => item.id === value.department))) {
        throw new Error('Некорректные настройки.');
    }
    return {group, department: value.department};
};

export const loadStudentSettings = () => (dispatch, getState) => {
    if (saveRequest) return saveRequest;
    if (getState().studentSettings.loaded) return Promise.resolve(getState().studentSettings);
    if (loadRequest) return loadRequest;
    dispatch({type: LOADING, payload: true});
    loadRequest = sendBridgeRequest('VKWebAppStorageGet', {keys: [STORAGE_KEY]})
        .then(data => {
            const item = data && Array.isArray(data.keys) && data.keys.find(entry => entry && entry.key === STORAGE_KEY);
            if (!item || typeof item.value !== 'string') throw new Error('Некорректный ответ хранилища.');
            const settings = item.value === '' ? {group: '', department: ''} : validateSettings(JSON.parse(item.value));
            dispatch({type: RECEIVED, payload: settings});
            return settings;
        })
        .finally(() => {
            loadRequest = null;
            dispatch({type: LOADING, payload: false});
        });
    return loadRequest;
};

export const saveStudentSettings = value => (dispatch, getState) => {
    if (saveRequest) return Promise.reject(new Error('Настройки уже сохраняются.'));
    let settings;
    try {
        settings = validateSettings(value);
        // Read legacy groups without clearing them, but allow new saves only from the archive.
        if (settings.group && !studentGroups.includes(settings.group)) throw new Error('Выберите группу из архива расписаний.');
    } catch (error) {
        return Promise.reject(error);
    }
    // Read first: a failed load must not silently replace existing settings.
    const loaded = dispatch(loadStudentSettings());
    dispatch({type: SAVING, payload: true});
    saveRequest = loaded.then(async () => {
        const current = getState().studentSettings;
        if (current.group !== settings.group || current.department !== settings.department) {
            const result = await sendBridgeRequest('VKWebAppStorageSet', {key: STORAGE_KEY, value: JSON.stringify(settings)});
            if (!result || result.result !== true) throw new Error('Не удалось сохранить настройки.');
            dispatch({type: RECEIVED, payload: settings});
        }
        return settings;
    }).finally(() => {
        saveRequest = null;
        dispatch({type: SAVING, payload: false});
    });
    return saveRequest;
};
