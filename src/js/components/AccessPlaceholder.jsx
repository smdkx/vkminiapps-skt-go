import React from 'react';
import {Panel, Placeholder} from '@vkontakte/vkui';

export default function AccessPlaceholder({id, title, description, Icon, action}) {
    const titleId = `${id}-title`;
    return <Panel id={id} centered>
        <section className="AccessPlaceholder" aria-labelledby={titleId}>
            <Placeholder.Container noPadding>
                {Icon && <Placeholder.Icon>
                    <span className="AccessPlaceholder__icon"><Icon aria-hidden="true"/></span>
                </Placeholder.Icon>}
                <Placeholder.Title Component="h1" id={titleId} className="AccessPlaceholder__title">
                    {title}
                </Placeholder.Title>
                <Placeholder.Description Component="p" className="AccessPlaceholder__description">
                    {description}
                </Placeholder.Description>
                {action && <Placeholder.Actions>{action}</Placeholder.Actions>}
            </Placeholder.Container>
        </section>
    </Panel>;
}
