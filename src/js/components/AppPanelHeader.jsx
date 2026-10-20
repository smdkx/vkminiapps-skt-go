import React from 'react';
import {PanelHeader, useAdaptivityWithJSMediaQueries, ViewWidth} from '@vkontakte/vkui';

// Use VKUI's public typography slot to style page titles consistently.
export default function AppPanelHeader({typographyProps, ...props}) {
    const {isDesktop, viewWidth} = useAdaptivityWithJSMediaQueries();
    const desktop = isDesktop && viewWidth >= ViewWidth.SMALL_TABLET;
    return <PanelHeader {...props} typographyProps={desktop ? {
        ...typographyProps,
        className: ['AppPanelHeader__title', typographyProps?.className].filter(Boolean).join(' '),
    } : typographyProps}/>;
}
