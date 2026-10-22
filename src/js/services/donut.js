import {getCurrentAppId, sendBridgeRequest} from './bridge';

const API_VERSION = '5.199';
const COMMUNITY = 'teamskt';

const invalidResponse = () => Object.assign(new Error('Некорректный ответ ВКонтакте.'), {code: 'INVALID_VK_RESPONSE'});

const callAPI = async (method, params, accessToken) => {
    const data = await sendBridgeRequest('VKWebAppCallAPIMethod', {
        method,
        params: {...params, access_token: accessToken, v: API_VERSION},
    });
    if (data && data.error) throw Object.assign(new Error('VK API отклонил запрос.'), {error_type: 'api_error', error_data: data.error});
    if (!data || !Object.prototype.hasOwnProperty.call(data, 'response')) throw invalidResponse();
    return data.response;
};

const requestAccessToken = async appId => {
    const auth = await sendBridgeRequest('VKWebAppGetAuthToken', {app_id: appId, scope: ''}, 60000);
    if (!auth || typeof auth.access_token !== 'string' || !auth.access_token) throw invalidResponse();
    return auth.access_token;
};

const readSubscription = async accessToken => {
    // Resolve the subscription link's community rather than assuming an old numeric ID is current.
    const owner = await callAPI('utils.resolveScreenName', {screen_name: COMMUNITY}, accessToken);
    if (!owner || owner.type !== 'group' || !Number.isInteger(owner.object_id) || owner.object_id <= 0) {
        throw invalidResponse();
    }
    const subscribed = await callAPI('donut.isDon', {owner_id: -owner.object_id}, accessToken);
    if (subscribed !== 0 && subscribed !== 1) throw invalidResponse();
    return subscribed === 1;
};

export const checkDonutSubscription = async () => {
    let stage = 'authorization';
    try {
        const appId = await getCurrentAppId();
        const accessToken = await requestAccessToken(appId);

        stage = 'subscription';
        try {
            return await readSubscription(accessToken);
        } catch (error) {
            if (!error || !error.error_data || error.error_data.error_code !== 5) throw error;
            stage = 'authorization';
            const renewedToken = await requestAccessToken(appId);
            stage = 'subscription';
            // The host may return its cached token. Do not reuse a known revoked token
            // or keep opening authorization dialogs when VK cannot issue a replacement.
            if (renewedToken === accessToken) throw error;
            return await readSubscription(renewedToken);
        }
    } catch (error) {
        // Preserve only the fields needed for a safe user-facing message.
        // API errors can include request_params containing the access token.
        const details = error && error.error_data;
        throw Object.assign(new Error('Не удалось проверить подписку.'), {
            code: error && error.code,
            type: error && error.error_type,
            apiCode: details && details.error_code,
            stage,
        });
    }
};

export const getDonutErrorMessage = (error) => {
    if (error.code === 'UNSUPPORTED_ENVIRONMENT') return 'Откройте приложение внутри ВКонтакте.';
    if (error.code === 'UNSUPPORTED_METHOD') return 'Проверка недоступна в этом клиенте.';
    if (error.code === 'BRIDGE_TIMEOUT') return 'Сервер не ответил вовремя.';
    if (error.code === 'INVALID_VK_RESPONSE') return 'Некорректный ответ сервера.';
    if (error.code === 'INVALID_LAUNCH_PARAMS') return 'Не удалось получить данные приложения.';
    if (error.type === 'api_error' && error.apiCode === 5) {
        return 'Сервер отклонил токен доступа.';
    }
    if (error.type === 'auth_error') {
        return 'Не удалось авторизоваться.';
    }
    if (error.type === 'api_error' && [6, 9, 29].includes(error.apiCode)) {
        return 'Слишком много запросов. Попробуйте позже.';
    }
    if (error.type === 'api_error' && [7, 15, 20, 21].includes(error.apiCode)) {
        return 'Нет доступа к проверке подписки.';
    }
    if (error.stage === 'authorization') {
        return 'Не удалось авторизоваться.';
    }
    return 'Не удалось проверить подписку.';
};
