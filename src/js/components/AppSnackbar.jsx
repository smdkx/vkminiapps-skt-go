import React from 'react';
import {Snackbar} from '@vkontakte/vkui';
import {Icon28CheckCircleOutline, Icon28ErrorCircleOutline, Icon28InfoOutline} from '@vkontakte/icons';

const icons = {
    success: [Icon28CheckCircleOutline, 'var(--vkui--color_icon_positive)'],
    error: [Icon28ErrorCircleOutline, 'var(--vkui--color_icon_negative)'],
    info: [Icon28InfoOutline, 'var(--vkui--color_icon_accent)'],
};

export default function AppSnackbar({status = 'error', before, ...props}) {
    const [Icon, color] = icons[status] || icons.info;
    return <Snackbar {...props} before={before || <Icon style={{color}} fill="currentColor" aria-hidden/>}/>;
}
