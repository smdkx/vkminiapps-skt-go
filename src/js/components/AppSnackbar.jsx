import React, {useEffect, useRef} from 'react';
import {Snackbar} from '@vkontakte/vkui';
import {Icon28CheckCircleOutline, Icon28ErrorCircleOutline, Icon28InfoOutline, Icon28WarningTriangleOutline} from '@vkontakte/icons';
import {hapticNotification} from '../services/bridge';

const icons = {
    success: [Icon28CheckCircleOutline, 'var(--vkui--color_icon_positive)'],
    error: [Icon28ErrorCircleOutline, 'var(--vkui--color_icon_negative)'],
    warning: [Icon28WarningTriangleOutline, 'var(--vkui--color_icon_warning)'],
    info: [Icon28InfoOutline, 'var(--vkui--color_icon_accent)'],
};

export default function AppSnackbar({status = 'error', before, children, ...props}) {
    const previousMessage = useRef(null);
    useEffect(() => {
        if (previousMessage.current?.status === status && previousMessage.current?.children === children) return;
        previousMessage.current = {status, children};
        if (status === 'success' || status === 'error' || status === 'warning') hapticNotification(status);
    }, [status, children]);
    const [Icon, color] = icons[status] || icons.info;
    return <Snackbar {...props} before={before || <Icon style={{color}} fill="currentColor" aria-hidden/>}>{children}</Snackbar>;
}
