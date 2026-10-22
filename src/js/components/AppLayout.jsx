import React, {useEffect, useRef} from 'react';
import {
    Epic,
    Badge,
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

const SECRET_TAP_COUNT = 5;
const SECRET_TAP_GAP_MS = 2000;

const sections = [
    {id: 'home', panel: 'home_tab', title: 'Главная', Icon: Icon28HomeOutline},
    {id: 'news', panel: 'news_tab', title: 'Новости', Icon: Icon28ArticleOutline},
    {id: 'service', panel: 'service_tab', title: 'Сервисы', Icon: Icon28ServicesOutline},
    {id: 'profile', panel: 'profile_tab', title: 'Профиль', Icon: Icon28UserCircleOutline},
];

export default function AppLayout({activeStory, activePanel, showNavigation, serviceUnseen, setStory, onOpenSasha, children}) {
    const {isDesktop, viewWidth} = useAdaptivityWithJSMediaQueries();
    // VKCOM considers even a narrow iframe desktop; leave room for the content.
    // The provider's forced mobile mode also takes precedence over viewport width.
    const desktop = isDesktop && viewWidth >= ViewWidth.SMALL_TABLET;
    const serviceTaps = useRef({count: 0, lastTap: 0});

    useEffect(() => {
        serviceTaps.current = {count: 0, lastTap: 0};
    }, [activeStory, activePanel, showNavigation]);

    const selectSection = (id, panel) => {
        if (id === 'service' && activeStory === id && activePanel === panel) {
            const now = performance.now();
            const previous = serviceTaps.current;
            const count = now - previous.lastTap <= SECRET_TAP_GAP_MS ? previous.count + 1 : 1;
            serviceTaps.current = {count, lastTap: now};
            if (count === SECRET_TAP_COUNT) {
                serviceTaps.current = {count: 0, lastTap: 0};
                onOpenSasha();
                return;
            }
        } else {
            serviceTaps.current = {count: 0, lastTap: 0};
        }
        setStory(id, panel);
    };

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
                                    after={id === 'service' && serviceUnseen ? <Badge mode="prominent" aria-hidden="true"/> : undefined}
                                    aria-description={id === 'service' && serviceUnseen ? 'Раздел еще не просмотрен' : undefined}
                                    aria-current={activeStory === id ? 'page' : undefined}
                                    onClick={() => selectSection(id, panel)}>
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
                                aria-current={activeStory === id ? 'page' : undefined}
                                indicator={id === 'service' && serviceUnseen ? <Badge mode="prominent" aria-hidden="true"/> : undefined}
                                aria-description={id === 'service' && serviceUnseen ? 'Раздел еще не просмотрен' : undefined}
                                onClick={() => selectSection(id, panel)}>
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
