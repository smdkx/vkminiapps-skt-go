import React from 'react';
import {
    Epic,
    Group,
    Header,
    SimpleCell,
    SplitCol,
    SplitLayout,
    Tabbar,
    TabbarItem,
    Text,
    useAdaptivityWithJSMediaQueries,
    ViewWidth,
} from '@vkontakte/vkui';
import {
    Icon28HomeOutline,
    Icon28ArticleOutline,
    Icon28ServicesOutline,
    Icon28UserCircleOutline,
} from '@vkontakte/icons';

const sections = [
    {id: 'home', panel: 'home_tab', title: 'Главная', Icon: Icon28HomeOutline},
    {id: 'news', panel: 'news_tab', title: 'Новости', Icon: Icon28ArticleOutline},
    {id: 'service', panel: 'service_tab', title: 'Сервисы', Icon: Icon28ServicesOutline},
    {id: 'profile', panel: 'profile_tab', title: 'Профиль', Icon: Icon28UserCircleOutline},
];

export default function AppLayout({activeStory, showNavigation, setStory, children}) {
    const {isDesktop, viewWidth} = useAdaptivityWithJSMediaQueries();
    // VKCOM considers even a narrow iframe desktop; leave room for the content.
    // The provider's forced mobile mode also takes precedence over viewport width.
    const desktop = isDesktop && viewWidth >= ViewWidth.SMALL_TABLET;

    return (
        <SplitLayout center className={desktop ? 'AppLayout AppLayout--desktop' : 'AppLayout'}
            slotProps={{content: {className: 'AppLayout__columns'}}}>
            {desktop && showNavigation && (
                <SplitCol key="navigation" width="var(--app-sidebar-width)" maxWidth={232} fixed
                    className="AppLayout__sidebar">
                    <nav aria-label="Основная навигация" className="AppNavigation">
                        <Group mode="card" header={<Header>SKT Go</Header>}>
                            {sections.map(({id, panel, title, Icon}) => (
                                <SimpleCell key={id} before={<Icon/>}
                                    className="AppNavigation__item"
                                    aria-current={activeStory === id ? 'page' : undefined}
                                    onClick={() => setStory(id, panel)}>
                                    <Text className="AppNavigation__label">{title}</Text>
                                </SimpleCell>
                            ))}
                        </Group>
                    </nav>
                </SplitCol>
            )}
            <SplitCol key="content" width="100%" maxWidth={720} minWidth={0}>
                <Epic activeStory={activeStory} tabbar={!desktop && showNavigation ? (
                    <Tabbar className="AppLayout__tabbar">
                        {sections.map(({id, panel, title, Icon}) => (
                            <TabbarItem key={id} selected={activeStory === id} label={title}
                                onClick={() => setStory(id, panel)}>
                                <Icon/>
                            </TabbarItem>
                        ))}
                    </Tabbar>
                ) : null}>
                    {children}
                </Epic>
            </SplitCol>
        </SplitLayout>
    );
}
