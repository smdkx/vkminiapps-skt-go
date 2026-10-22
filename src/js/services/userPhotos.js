import {sendBridgeRequest} from './bridge';

const CACHE_TIME = 5 * 60 * 1000;
const RETRY_DELAY = 60 * 1000;
const cache = new Map();

export const getUserPhotosErrorMessage = error => {
    if (error.code === 'UNSUPPORTED_ENVIRONMENT') return 'Откройте приложение внутри ВКонтакте.';
    if (error.code === 'UNSUPPORTED_METHOD') return 'Загрузка фотографий недоступна.';
    if (error.code === 'BRIDGE_TIMEOUT') return 'Сервер не ответил вовремя.';
    if (error.apiCode === 5) return 'Не удалось получить фотографии из ВК.';
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

const fetchPhotos = async (userIds) => {
    try {
        const data = await sendBridgeRequest('VKWebAppGetUserInfo', {
            user_ids: userIds.join(','),
        });
        if (data && data.error) throw Object.assign(new Error('VK отклонил запрос.'), {error_data: data.error});
        // Bridge returns a single profile for one ID, or {result: profiles} for a batch.
        const users = userIds.length === 1 && data && data.id === userIds[0]
            ? [data] : data && data.result;
        if (!Array.isArray(users)) throw new Error('Некорректный ответ VK.');

        const requested = new Set(userIds);
        const photos = new Map();
        users.forEach(user => {
            // Match by ID: response order and missing profiles must not mix up photos.
            if (!user || !requested.has(user.id)) return;
            const photo = user.deactivated ? null : user.photo_200 || user.photo_100 || null;
            const src = typeof photo === 'string' && /^https:\/\//i.test(photo) ? photo : null;
            photos.set(user.id, src);
        });
        return photos;
    } catch (error) {
        throw photoError(error, 'photos');
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
