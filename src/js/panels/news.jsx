import React from 'react';
import moment from 'moment';
import 'moment/dist/locale/ru';
import {
    Card, Box, Group, Header, Panel,
    Placeholder, SimpleCell, Text, Title,
} from '@vkontakte/vkui';
import PanelHeader from '../components/AppPanelHeader';
import {Icon28LogoVkOutline} from '@vkontakte/icons';
import {newsData} from '../components/data/news.data';

function NewsArticle({entry, featured = false}) {
    return <Box padding="system" className="NewsFeed__item">
        <Card mode="outline" className={`NewsCard${featured ? ' NewsCard--latest' : ''}`}>
            <article className="NewsCard__body" aria-labelledby={`news-title-${entry.id}`}>
                <time className="NewsCard__date" dateTime={entry.date.format('YYYY-MM-DD')}>
                    {entry.date.format('D MMMM YYYY')}
                </time>
                <Title Component={featured ? 'h2' : 'h3'} level="2" weight="2"
                    id={`news-title-${entry.id}`} className="NewsCard__title">{entry.title}</Title>
                <Text Component="p" className="NewsCard__text">{entry.text}</Text>
            </article>
        </Card>
    </Box>;
}

export default function News({id}) {
    const entries = [...newsData].reverse().map(entry => ({...entry, date: moment(entry.date, 'DD.MM.YY').locale('ru')}));
    const archive = entries.slice(1).reduce((groups, entry) => {
        const year = entry.date.year();
        let group = groups[groups.length - 1];
        if (!group || group.year !== year) {
            group = {year, entries: []};
            groups.push(group);
        }
        group.entries.push(entry);
        return groups;
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>Новости</PanelHeader>
            <Group mode="plain" separator="hide" className="NewsFeed">
                <Box padding="system" className="NewsFeed__source">
                    <Card mode="outline">
                        <SimpleCell multiline className="NewsFeed__sourceLink"
                            before={<Icon28LogoVkOutline/>} subtitle="Сообщество во ВКонтакте"
                            href="https://vk.com/sktnews" aria-label="Перейти в SKT News во ВКонтакте"
                            target="_blank" rel="noopener noreferrer"
                        >SKT News</SimpleCell>
                    </Card>
                </Box>
                {entries.length ? <React.Fragment>
                    <Header size="s">Последняя запись</Header>
                    <NewsArticle entry={entries[0]} featured/>
                    {archive.map(group => <section key={group.year} aria-label={`Обновления за ${group.year} год`}>
                        <Header size="s">{group.year}</Header>
                        {group.entries.map(entry => <NewsArticle key={entry.id} entry={entry}/>)}
                    </section>)}
                </React.Fragment> : <Placeholder title="Новостей пока нет">Когда появятся записи об обновлениях, они будут здесь.</Placeholder>}
            </Group>
        </Panel>
    );
}
