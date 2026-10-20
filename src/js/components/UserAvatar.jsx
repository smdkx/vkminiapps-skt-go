import React, {useState} from 'react';
import {Avatar} from '@vkontakte/vkui';
import {Icon28UserOutline} from '@vkontakte/icons';

export default function UserAvatar({src, name}) {
    const [failedSource, setFailedSource] = useState(null);
    const photo = src && src !== failedSource ? src : undefined;

    return <Avatar size={48} src={photo} alt={photo && name ? `Фотография: ${name}` : undefined}
        onError={() => setFailedSource(src)}>
        {!photo && <Icon28UserOutline aria-hidden="true"/>}
    </Avatar>;
}
