import React from 'react';
import {Banner} from '@vkontakte/vkui';
import {Icon28InfoOutline, Icon28WarningTriangleOutline} from '@vkontakte/icons';

export default function NoticeBanner({appearance = 'info', className = '', before, ...props}) {
    return <Banner {...props} mode="tint" className={`NoticeBanner NoticeBanner--${appearance} ${className}`}
        before={before || (appearance === 'warning' ? <Icon28WarningTriangleOutline/> : <Icon28InfoOutline/>)}/>;
}
