import bridge from '@vkontakte/vk-bridge';

const bridgeError = (code, message) => Object.assign(new Error(message), {code});
let hapticsEnabled = true;

export const setHapticsEnabled = enabled => { hapticsEnabled = enabled === true; };

export const sendBridgeRequest = (method, params = {}, timeout = 15000) => {
    if (!bridge.isEmbedded()) {
        return Promise.reject(bridgeError('UNSUPPORTED_ENVIRONMENT', 'Откройте приложение внутри ВКонтакте.'));
    }

    return new Promise((resolve, reject) => {
        let expired = false;
        const timer = setTimeout(() => {
            expired = true;
            reject(bridgeError('BRIDGE_TIMEOUT', 'Время ожидания истекло.'));
        }, timeout);

        // Initialization must not wait for capability negotiation with the host.
        Promise.resolve().then(() => method === 'VKWebAppInit' || bridge.supportsAsync(method)).then(supported => {
            // Do not send a late request after the capability check has timed out.
            if (expired) return;
            if (!supported) throw bridgeError('UNSUPPORTED_METHOD', 'Функция недоступна в этом клиенте.');
            return bridge.send(method, params);
        }).then(
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
    if (!hapticsEnabled) return;
    sendBridgeRequest('VKWebAppTapticNotificationOccurred', {type}).catch(() => {});
};
