import React from 'react';
import {connect} from 'react-redux';
import {Panel, PanelHeaderBack, Group, Header, Title, Text, Footnote, Link, SimpleCell} from '@vkontakte/vkui';
import {Icon24ExternalLinkOutline} from '@vkontakte/icons';
import PanelHeader from './AppPanelHeader';
import {goBack} from '../store/router/actions';

function DirectoryPage({id, title, introTitle, description, Icon, children, snackbar, goBack}) {
    return <Panel id={id} mode="card" className="DirectoryPanel">
        <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>{title}</PanelHeader>
        <div className="DirectoryLayout">
            {introTitle && <Group mode="card" separator="hide" className="DirectorySection DirectoryIntro">
                <div className="DirectoryIntro__content">
                    {Icon && <span className="DirectoryIntro__icon"><Icon width={32} height={32} aria-hidden="true"/></span>}
                    <div className="DirectoryIntro__text">
                        <Title Component="h2" level="2" weight="2">{introTitle}</Title>
                        {description && <Text className="DirectoryIntro__description">{description}</Text>}
                    </div>
                </div>
            </Group>}
            {children}
        </div>
        {snackbar}
    </Panel>;
}
export default connect(null, {goBack})(DirectoryPage);

export function DirectorySection({title, children, className = ''}) {
    return <Group mode="card" separator="hide" className={`DirectorySection ${className}`}
        header={title && <Header multiline>{title}</Header>}>{children}</Group>;
}

export function DirectoryFacts({items}) {
    return <dl className="DirectoryFacts">{items.map(({label, value, href}) => <div className="DirectoryFacts__row" key={label}>
        <Footnote Component="dt" className="DirectoryFacts__label">{label}</Footnote>
        <Text Component="dd" className="DirectoryFacts__value">{href ? <Link href={href}>{value}</Link> : value}</Text>
    </div>)}</dl>;
}

export function DirectoryLinks({items}) {
    return <div className="DirectoryLinks">{items.map(({title, description, href}) => <SimpleCell key={href} multiline
        href={href} target="_blank" rel="noopener noreferrer" subtitle={description} style={{borderRadius: 0}}
        after={<Icon24ExternalLinkOutline width={20} height={20} className="DirectoryLinks__external" aria-hidden="true"/>}>{title}</SimpleCell>)}</div>;
}
