import {sendBridgeRequest} from '../services/bridge';
import {checkDonutSubscription} from '../services/donut';

const STORAGE_KEY = 'skt_show_banners_v1';
const UPDATE = 'premium/UPDATE';
const initialState = {
    forced: false,
    subscribed: null,
    checking: false,
    showBanners: true,
    preferencesLoaded: false,
    saving: false,
};
let loadRequest = null;
let saveRequest = null;
let checkRequest = null;

export const premiumReducer = (state = initialState, action) =>
    action.type === UPDATE ? {...state, ...action.payload} : state;

// An earned achievement is permanent; it does not prove an active subscription.
export const isPremium = ({premium}) => premium.forced || premium.subscribed === true;
export const shouldShowBanners = state => !isPremium(state) || state.premium.showBanners;

// The override is deliberately limited to this app session, never saved as a subscription.
export const setForcedPremium = enabled => ({type: UPDATE, payload: {forced: enabled === true}});
export const setPremiumSubscription = subscribed => ({type: UPDATE, payload: {subscribed: subscribed === true}});

export const checkPremiumSubscription = () => dispatch => {
    if (checkRequest) return checkRequest;
    dispatch({type: UPDATE, payload: {checking: true}});
    checkRequest = checkDonutSubscription().then(subscribed => {
        dispatch(setPremiumSubscription(subscribed));
        return subscribed;
    }).catch(error => {
        // Failed verification must not keep an earlier entitlement active.
        dispatch({type: UPDATE, payload: {subscribed: null}});
        throw error;
    }).finally(() => {
        checkRequest = null;
        dispatch({type: UPDATE, payload: {checking: false}});
    });
    return checkRequest;
};

export const loadBannerSettings = () => (dispatch, getState) => {
    if (saveRequest) return saveRequest;
    if (getState().premium.preferencesLoaded) return Promise.resolve(getState().premium.showBanners);
    if (loadRequest) return loadRequest;
    loadRequest = sendBridgeRequest('VKWebAppStorageGet', {keys: [STORAGE_KEY]}).then(data => {
        const item = data && Array.isArray(data.keys) && data.keys.find(entry => entry && entry.key === STORAGE_KEY);
        if (!item || !['', 'true', 'false'].includes(item.value)) throw new Error('Некорректные настройки.');
        const showBanners = item.value !== 'false';
        dispatch({type: UPDATE, payload: {showBanners, preferencesLoaded: true}});
        return showBanners;
    }).finally(() => { loadRequest = null; });
    return loadRequest;
};

export const saveBannerSettings = showBanners => (dispatch, getState) => {
    if (typeof showBanners !== 'boolean' || !isPremium(getState())) {
        return Promise.reject(new Error('Настройка доступна с Premium.'));
    }
    if (saveRequest) return Promise.reject(new Error('Настройки уже сохраняются.'));
    const loaded = dispatch(loadBannerSettings());
    dispatch({type: UPDATE, payload: {saving: true}});
    saveRequest = loaded.then(async () => {
        if (!isPremium(getState())) throw new Error('Настройка доступна с Premium.');
        const result = await sendBridgeRequest('VKWebAppStorageSet', {key: STORAGE_KEY, value: String(showBanners)});
        if (!result || result.result !== true) throw new Error('Не удалось сохранить настройки.');
        dispatch({type: UPDATE, payload: {showBanners, preferencesLoaded: true}});
        return showBanners;
    }).finally(() => {
        saveRequest = null;
        dispatch({type: UPDATE, payload: {saving: false}});
    });
    return saveRequest;
};
