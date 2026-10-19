import bridge from '@vkontakte/vk-bridge';

const bridgeError = (code, message) => Object.assign(new Error(message), {code});

export const sendBridgeRequest = (method, params = {}, timeout = 15000) => {
    if (!bridge.isEmbedded()) {
        return Promise.reject(bridgeError('UNSUPPORTED_ENVIRONMENT', 'Откройте приложение во ВКонтакте.'));
    }

    if (!bridge.supports(method)) {
        return Promise.reject(bridgeError('UNSUPPORTED_METHOD', 'Функция недоступна в этом клиенте.'));
    }

    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(bridgeError('BRIDGE_TIMEOUT', 'Время ожидания истекло.'));
        }, timeout);

        Promise.resolve().then(() => bridge.send(method, params)).then(
            (data) => {
                clearTimeout(timer);
                resolve(data);
            },
            (error) => {
                clearTimeout(timer);
                reject(error);
            }
        );
    });
};

export const getCurrentAppId = async () => {
    const queryId = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('vk_app_id') : null;
    const parseId = value => /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) > 0
        ? Number(value) : null;
    const appId = parseId(queryId);
    if (appId) return appId;

    const launch = await sendBridgeRequest('VKWebAppGetLaunchParams');
    const launchAppId = launch && parseId(launch.vk_app_id);
    if (!launchAppId) throw bridgeError('INVALID_LAUNCH_PARAMS', 'Не удалось получить данные приложения.');
    return launchAppId;
};

export const hapticNotification = (type) => {
    if (bridge.isEmbedded() && bridge.supports('VKWebAppTapticNotificationOccurred')) {
        bridge.send('VKWebAppTapticNotificationOccurred', {type}).catch(() => {});
    }
};
