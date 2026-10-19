import {getCurrentAppId, sendBridgeRequest} from './bridge';

const CACHE_TIME = 5 * 60 * 1000;
const RETRY_DELAY = 60 * 1000;
const cache = new Map();
let authRequest = null;

export const getUserPhotosErrorMessage = error => {
    if (error.code === 'UNSUPPORTED_ENVIRONMENT') return 'Фотографии доступны во ВКонтакте.';
    if (error.code === 'UNSUPPORTED_METHOD') return 'Загрузка фотографий недоступна.';
    if (error.code === 'BRIDGE_TIMEOUT') return 'Сервер не ответил вовремя.';
    if (error.stage === 'photos' && error.apiCode === 5) return 'Сервер отклонил токен доступа.';
    if (error.stage === 'authorization') return 'Не удалось авторизоваться.';
    if ([6, 9, 29].includes(error.apiCode)) return 'Слишком много запросов. Попробуйте позже.';
    return 'Не удалось загрузить фотографии.';
};

const photoError = (error, stage) => {
    // Do not pass error_data, request_params or raw messages containing credentials to the UI.
    const code = error && ['UNSUPPORTED_ENVIRONMENT', 'UNSUPPORTED_METHOD', 'BRIDGE_TIMEOUT', 'INVALID_LAUNCH_PARAMS']
        .includes(error.code) ? error.code : 'PHOTO_LOAD_FAILED';
    const apiCode = error && error.error_data && error.error_data.error_code;
    const safe = {code, stage, apiCode: Number.isInteger(apiCode) ? apiCode : undefined};
    return Object.assign(new Error(getUserPhotosErrorMessage(safe)), safe);
};

const getAccessToken = () => {
    if (!authRequest) {
        const request = getCurrentAppId()
            .then(appId => sendBridgeRequest('VKWebAppGetAuthToken', {app_id: appId, scope: ''}, 60000))
            .then(auth => {
                if (!auth || typeof auth.access_token !== 'string' || !auth.access_token) {
                    throw new Error('VK не вернул токен доступа.');
                }
                return auth.access_token;
            })
            .finally(() => {
                // Share only pending authorization; each new batch requests a current token.
                if (authRequest === request) authRequest = null;
            });
        authRequest = request;
    }
    return authRequest;
};

const fetchPhotos = async (userIds, canRefreshToken = true) => {
    let stage = 'authorization';
    try {
        const accessToken = await getAccessToken();
        stage = 'photos';
        const data = await sendBridgeRequest('VKWebAppCallAPIMethod', {
            method: 'users.get',
            params: {
                user_ids: userIds.join(','),
                fields: 'photo_100,photo_200',
                access_token: accessToken,
                v: '5.199',
            },
        });
        if (data && data.error) throw Object.assign(new Error('VK отклонил запрос.'), {error_data: data.error});
        if (!data || !Array.isArray(data.response)) throw new Error('Некорректный ответ VK.');

        const requested = new Set(userIds);
        const photos = new Map();
        data.response.forEach(user => {
            // Match by ID: response order and missing profiles must not mix up photos.
            if (!user || !requested.has(user.id)) return;
            const photo = user.deactivated ? null : user.photo_200 || user.photo_100 || null;
            const src = typeof photo === 'string' && /^https:\/\//i.test(photo) ? photo : null;
            photos.set(user.id, src);
        });
        return photos;
    } catch (error) {
        if (stage === 'photos' && error && error.error_data && error.error_data.error_code === 5 && canRefreshToken) {
            return fetchPhotos(userIds, false);
        }
        throw photoError(error, stage);
    }
};

export const loadUserPhotos = (userIds) => {
    const ids = [...new Set(userIds.filter(id => Number.isSafeInteger(id) && id > 0))];
    const missing = ids.filter(id => {
        const entry = cache.get(id);
        return !entry || entry.expires <= Date.now();
    });

    if (missing.length) {
        const batch = fetchPhotos(missing);
        missing.forEach(userId => {
            const entry = {expires: Infinity, promise: null};
            entry.promise = batch.then(photos => {
                entry.expires = Date.now() + (photos.has(userId) ? CACHE_TIME : RETRY_DELAY);
                return {userId, src: photos.get(userId) || null};
            }).catch(error => {
                // A failed batch is retryable immediately, rather than cached as missing photos.
                if (cache.get(userId) === entry) cache.delete(userId);
                throw error;
            });
            cache.set(userId, entry);
        });
    }

    return Promise.all(ids.map(id => cache.get(id).promise)).then(results => results.reduce((photos, {userId, src}) => {
        photos[userId] = src;
        return photos;
    }, {}));
};
