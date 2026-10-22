import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import bridge from '@vkontakte/vk-bridge';
import {Group, Header, Panel, PanelHeaderBack, SimpleCell, Search, Placeholder, Button, Spinner} from '@vkontakte/vkui';
import {Icon28UsersOutline, Icon28SearchOutline} from '@vkontakte/icons';
import NoticeBanner from '../components/NoticeBanner';
import Snackbar from '../components/AppSnackbar';
import PanelHeader from '../components/AppPanelHeader';
import {goBack, setPage} from '../store/router/actions';
import {loadStudentSettings} from '../store/studentSettings';
import {timetableEntries, timetablePeriod} from '../components/data/timetable.data';

function Timetable({id, goBack, setPage, studentSettings, loadStudentSettings}) {
    const [query, setQuery] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!bridge.isEmbedded()) return;
        let active = true;
        loadStudentSettings().catch(() => { if (active) setError('Не удалось загрузить вашу группу.'); });
        return () => { active = false; };
    }, [loadStudentSettings]);

    const search = query.trim().toUpperCase().replace(/\s+/g, '');
    const groups = timetableEntries.filter(group => group.title.includes(search));
    const myGroup = studentSettings.loaded && timetableEntries.find(group => group.title === studentSettings.group);

    return <Panel id={id} mode="card">
        <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>Расписание занятий</PanelHeader>
        <div className="TimetableLayout">
            <NoticeBanner appearance="warning" title="Архив расписаний"
                subtitle={`${timetablePeriod}. Актуальное расписание уточняйте в колледже.`}/>
            {!search && (myGroup || studentSettings.loading) && <Group mode="card" separator="hide"
                className="TimetableSection TimetableMyGroup" header={<Header>Моя группа</Header>}>
                {myGroup ? <SimpleCell before={<span className="TimetableMyGroup__icon"><Icon28UsersOutline aria-hidden="true"/></span>}
                    subtitle="Открыть расписание" chevron="always" style={{borderRadius: 0}}
                    onClick={() => setPage('home', myGroup.id)}>{myGroup.title}</SimpleCell>
                    : <div className="TimetableMyGroup__loading" role="status"><Spinner size="s" aria-hidden/>Загружаем группу</div>}
            </Group>}
            <Group mode="card" separator="hide" className="TimetableSection TimetableGroups"
                header={<Header>Выберите группу</Header>}>
                <Search value={query} onChange={event => setQuery(event.target.value)} placeholder="Найти группу"
                    clearLabel="Очистить поиск" slotProps={{input: {'aria-label': 'Найти группу'}}}/>
                {groups.length ? <div className="TimetableGroups__list">
                    {groups.map(group => <SimpleCell key={group.id} chevron="always" style={{borderRadius: 0}}
                        onClick={() => setPage('home', group.id)}>{group.title}</SimpleCell>)}
                </div> : <Placeholder icon={<Icon28SearchOutline aria-hidden/>} title="Группа не найдена"
                    action={<Button mode="secondary" size="m" onClick={() => setQuery('')}>Сбросить поиск</Button>}>
                    Проверьте название. Здесь только группы с архивным расписанием.
                </Placeholder>}
            </Group>
        </div>
        {error && <Snackbar onClosed={() => setError(null)}>{error}</Snackbar>}
    </Panel>;
}

export default connect(state => ({studentSettings: state.studentSettings}), {goBack, setPage, loadStudentSettings})(Timetable);
