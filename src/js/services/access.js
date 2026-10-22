import {accessConfig} from '../../config/access';
import {sendBridgeRequest} from './bridge';

const accessError = (code, message, cause) => Object.assign(new Error(message), {code, cause});
const isUserId = value => Number.isSafeInteger(value) && value > 0;

const getConfiguredStatus = config => {
    if (config?.enabled === false) return 'unavailable';
    if (!config || typeof config !== 'object' || Array.isArray(config)
        || config.enabled !== true || !Array.isArray(config.blockedUserIds)
        || !Array.from(config.blockedUserIds).every(isUserId)) {
        throw accessError('INVALID_ACCESS_CONFIG', 'Не удалось проверить настройки доступа.');
    }
    return config.blockedUserIds.length === 0 ? 'allowed' : 'checking';
};

export const getInitialAccessStatus = (config = accessConfig) => {
    try {
        return getConfiguredStatus(config);
    } catch {
        return 'error';
    }
};

const getCurrentUserId = async search => {
    const identityError = cause => accessError(
        'ACCESS_IDENTITY_UNAVAILABLE', 'Не удалось определить пользователя.', cause
    );
    if (typeof search !== 'string') throw identityError();
    const queryIds = new URLSearchParams(search).getAll('vk_user_id');
    if (queryIds.length > 0) {
        const value = queryIds[0];
        const userId = Number(value);
        if (queryIds.length !== 1 || !/^\d+$/.test(value) || !isUserId(userId)) {
            throw identityError();
        }
        return userId;
    }

    let launchParams;
    try {
        launchParams = await sendBridgeRequest('VKWebAppGetLaunchParams');
    } catch (error) {
        throw identityError(error);
    }
    if (!isUserId(launchParams?.vk_user_id)) throw identityError();
    return launchParams.vk_user_id;
};

// Это ограничение интерфейса. Проверку запросов и подписи запуска должен выполнять сервер.
export const checkAppAccess = async ({
    config = accessConfig,
    search = typeof window === 'undefined' ? '' : window.location.search,
} = {}) => {
    const status = getConfiguredStatus(config);
    if (status !== 'checking') return status;
    const userId = await getCurrentUserId(search);
    return config.blockedUserIds.includes(userId) ? 'blocked' : 'allowed';
};
