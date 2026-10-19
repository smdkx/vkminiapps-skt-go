import {getCurrentAppId, sendBridgeRequest} from './bridge';

const unconfirmed = () => Object.assign(new Error('VK не подтвердил действие.'), {code: 'ACTION_NOT_CONFIRMED'});

export const addAppToFavorites = async () => {
    const flag = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('vk_is_favorite') : null;
    let alreadyFavorite = flag === '1';
    if (flag !== '0' && flag !== '1') {
        try {
            const launch = await sendBridgeRequest('VKWebAppGetLaunchParams');
            alreadyFavorite = launch && launch.vk_is_favorite === 1;
        } catch (error) {
            // The action itself can still confirm success when launch params are unavailable.
            if (error && error.code === 'UNSUPPORTED_ENVIRONMENT') throw error;
        }
    }
    if (!alreadyFavorite) {
        const data = await sendBridgeRequest('VKWebAppAddToFavorites', {}, 60000);
        if (!data || data.result !== true) throw unconfirmed();
    }
};

const isShared = item => {
    if (!item || typeof item !== 'object') return false;
    if (item.type === 'message') return Array.isArray(item.users) && item.users.some(user => user && Number.isSafeInteger(user.id) && user.id > 0);
    if (item.type === 'post') return typeof item.post_id === 'string' && item.post_id.trim().length > 0;
    if (item.type === 'story') return typeof item.story_id === 'string' && item.story_id.trim().length > 0;
    return false;
};

export const shareApplication = async () => {
    const appId = await getCurrentAppId();
    const data = await sendBridgeRequest('VKWebAppShare', {link: `https://vk.com/app${appId}`}, 60000);
    // Installed bridge types describe an array; VK also returns {result: [...] }.
    const results = Array.isArray(data) ? data : data && Array.isArray(data.result) ? data.result : [data];
    if (!results.some(isShared)) throw unconfirmed();
};

export const getAppActionErrorMessage = (error, achievement) => {
    const code = error && error.code;
    if (code === 'UNSUPPORTED_ENVIRONMENT' || code === 'UNSUPPORTED_METHOD') {
        return 'Действие недоступно в этом клиенте.';
    }
    if (code === 'BRIDGE_TIMEOUT') return 'Время ожидания истекло.';
    if (code === 'ACTION_NOT_CONFIRMED') return achievement === 'star'
        ? 'Добавление в избранное не подтверждено.'
        : 'Отправка не подтверждена.';
    return achievement === 'star'
        ? 'Не удалось добавить в избранное.'
        : 'Не удалось поделиться приложением.';
};
