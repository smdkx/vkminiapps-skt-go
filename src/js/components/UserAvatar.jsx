import React, {useState} from 'react';
import {Avatar} from '@vkontakte/vkui';
import {Icon28UserOutline} from '@vkontakte/icons';

export default function UserAvatar({src, name, children, size = 48}) {
    const [failedSource, setFailedSource] = useState(null);
    const photo = src && src !== failedSource ? src : undefined;

    return <Avatar size={size} src={photo} alt={photo && name ? `Фотография: ${name}` : undefined}
        onError={() => setFailedSource(src)}>
        {!photo && <Icon28UserOutline aria-hidden="true"/>}
        {children}
    </Avatar>;
}
