import VKConnect from "@vkontakte/vk-bridge";

import {setColorScheme, setSafeAreaInsets, setHostAdaptivity} from "../store/vk/actions";
import {sendBridgeRequest} from './bridge';

export const initApp = () => (dispatch) => {
    const VKConnectCallback = (e) => {
        if (['VKWebAppUpdateConfig', 'VKWebAppUpdateInsets'].includes(e.detail.type)) {
            const {scheme, appearance, insets, adaptivity} = e.detail.data;
            if (appearance === 'light' || appearance === 'dark') {
                dispatch(setColorScheme(appearance));
            } else if (scheme) {
                dispatch(setColorScheme(['space_gray', 'vkcom_dark'].includes(scheme) ? 'dark' : 'light'));
            }
            if (['adaptive', 'force_mobile', 'force_mobile_compact'].includes(adaptivity)) {
                dispatch(setHostAdaptivity(adaptivity));
            }
            if (insets) {
                const safeAreaInsets = {};
                ['top', 'right', 'bottom', 'left'].forEach(edge => {
                    if (Number.isFinite(insets[edge]) && insets[edge] >= 0) safeAreaInsets[edge] = insets[edge];
                });
                dispatch(setSafeAreaInsets(safeAreaInsets));
            }
        }
    };

    VKConnect.subscribe(VKConnectCallback);
    if (VKConnect.isEmbedded()) {
        sendBridgeRequest('VKWebAppInit').catch(() => {
            // Static college information remains available if VK initialization fails.
            // Actions requiring VK report their own request errors to the user.
            console.warn('Не удалось инициализировать VK Bridge.');
        });
    }

    return () => VKConnect.unsubscribe(VKConnectCallback);
};

export const closeApp = () => {
    return VKConnect.send("VKWebAppClose", {
        "status": "success"
    }).then(data => {
        return data;
    }).catch(error => {
        return error;
    });
};

export const swipeBackOn = () => {
    return VKConnect.send("VKWebAppEnableSwipeBack", {}).then(data => {
        return data;
    }).catch(error => {
        return error;
    });
};

export const swipeBackOff = () => {
    return VKConnect.send("VKWebAppDisableSwipeBack", {}).then(data => {
        return data;
    }).catch(error => {
        return error;
    });
};
