import React from 'react';
import {Alert} from '@vkontakte/vkui';

export default function MemesWarning({onConfirm, onClosed}) {
    return <Alert title="Подтвердите действие"
        description="Мемы могут содержать ненормативный контент, вы хотите продолжить?"
        actionsLayout="horizontal" onClosed={onClosed} actions={[
            {title: 'Отмена', mode: 'cancel'},
            {title: 'Открыть', mode: 'destructive', action: onConfirm},
        ]}/>;
}
