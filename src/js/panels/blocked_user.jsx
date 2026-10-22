import React from 'react';
import {Button} from '@vkontakte/vkui';
import {Icon56BlockOutline} from '@vkontakte/icons';
import AccessPlaceholder from '../components/AccessPlaceholder';

export default function BlockedUserPage({id, onBack}) {
    return <AccessPlaceholder id={id} title="Доступ заблокирован"
        description="Ваш аккаунт заблокирован в приложении." Icon={Icon56BlockOutline}
        action={onBack && <Button size="l" mode="secondary" onClick={onBack}>Вернуться в дебаг-меню</Button>}/>;
}
