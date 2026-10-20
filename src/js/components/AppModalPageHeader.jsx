import React from 'react';
import {ModalPageHeader} from '@vkontakte/vkui';

export default function AppModalPageHeader({typographyProps, ...props}) {
    return <ModalPageHeader {...props} typographyProps={{
        ...typographyProps,
        style: {
            margin: 0,
            fontSize: 20,
            lineHeight: '28px',
            ...typographyProps?.style,
        },
    }}/>;
}
