import React from 'react';
import moment from 'moment';
import 'moment/dist/locale/ru';
import {Accordion, Footnote, Group, Header, Panel, Placeholder, SimpleCell, Text, Title} from '@vkontakte/vkui';
import {Icon28ArticleOutline, Icon28LogoVkOutline, Icon28SparkleOutline} from '@vkontakte/icons';
import PanelHeader from '../components/AppPanelHeader';
import {newsData} from '../components/data/news.data';

function NewsArticle({entry, featured = false}) {
    return <article className={`NewsArticle${featured ? ' NewsArticle--latest' : ''}`}
        aria-labelledby={`news-title-${entry.id}`}>
        <header className="NewsArticle__meta">
            {featured && <span className="NewsArticle__icon"><Icon28SparkleOutline aria-hidden="true"/></span>}
            <div>
                {featured && <Footnote Component="p" weight="2" className="NewsArticle__label">Последнее обновление</Footnote>}
                <time className="NewsArticle__date" dateTime={entry.date.format('YYYY-MM-DD')}>
                    {entry.date.format('D MMMM YYYY')}
                </time>
            </div>
        </header>
        <Title Component={featured ? 'h2' : 'h3'} level={featured ? '1' : '2'} weight="2"
            id={`news-title-${entry.id}`} className="NewsArticle__title">{entry.title}</Title>
        <Text Component="p" className="NewsArticle__text">{entry.text}</Text>
    </article>;
}

const recordCount = count => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    const word = lastTwoDigits >= 11 && lastTwoDigits <= 14 ? 'записей'
        : lastDigit === 1 ? 'запись' : lastDigit >= 2 && lastDigit <= 4 ? 'записи' : 'записей';
    return `${count} ${word}`;
};

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

    return <Panel id={id} mode="card">
        <PanelHeader>Новости</PanelHeader>
        <div className="NewsLayout">
            <Group mode="card" separator="hide" className="NewsSection NewsCommunity">
                <SimpleCell multiline style={{borderRadius: 0}}
                    before={<span className="NewsCommunity__icon"><Icon28LogoVkOutline aria-hidden="true"/></span>}
                    subtitle="Сообщество во ВКонтакте" href="https://vk.com/sktnews"
                    aria-label="Перейти в SKT News во ВКонтакте" target="_blank" rel="noopener noreferrer">SKT News</SimpleCell>
            </Group>
            {entries.length ? <React.Fragment>
                <Group mode="card" separator="hide" className="NewsSection NewsLatest">
                    <NewsArticle entry={entries[0]} featured/>
                </Group>
                {archive.length > 0 && <Group mode="card" separator="hide" className="NewsSection NewsArchive"
                    header={<Header>История обновлений</Header>}>
                    {archive.map(group => <section key={group.year} className="NewsArchive__year">
                        <Accordion id={`${id}-year-${group.year}`} unmountOnCollapsed>
                            <Accordion.Summary style={{borderRadius: 0}}>
                                <span className="NewsArchive__summary">
                                    <Text Component="span" weight="2">{group.year}</Text>
                                    <Footnote Component="span" className="NewsArchive__count">{recordCount(group.entries.length)}</Footnote>
                                </span>
                            </Accordion.Summary>
                            <Accordion.Content>
                                <div className="NewsArchive__entries">
                                    {group.entries.map(entry => <NewsArticle key={entry.id} entry={entry}/>)}
                                </div>
                            </Accordion.Content>
                        </Accordion>
                    </section>)}
                </Group>}
            </React.Fragment> : <Group mode="card" separator="hide" className="NewsSection">
                <Placeholder icon={<Icon28ArticleOutline aria-hidden="true"/>} title="Новостей пока нет">
                    Когда появятся записи об обновлениях, они будут здесь.
                </Placeholder>
            </Group>}
        </div>
    </Panel>;
}
