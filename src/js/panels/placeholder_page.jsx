import React from 'react';
import {Button} from '@vkontakte/vkui';
import {Icon56GlobeCrossOutline} from '@vkontakte/icons';
import AccessPlaceholder from '../components/AccessPlaceholder';

export default function PlaceholderPage({id, onBack}) {
    return <AccessPlaceholder id={id} title="Доступ ограничен"
        description="Приложение недоступно в вашем регионе." Icon={Icon56GlobeCrossOutline}
        action={onBack && <Button size="l" mode="secondary" onClick={onBack}>Вернуться в дебаг-меню</Button>}/>;
}
