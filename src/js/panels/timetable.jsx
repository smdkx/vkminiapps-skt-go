import React from 'react';
import {connect} from 'react-redux';
import {
    Box,
    Group,
    Header,
    Panel,
    PanelHeaderBack,
    SimpleCell
} from '@vkontakte/vkui';
import NoticeBanner from '../components/NoticeBanner';
import PanelHeader from '../components/AppPanelHeader';
import {Icon28UsersOutline} from '@vkontakte/icons';
import {goBack, setPage} from '../store/router/actions';
import {timetableGroups, timetablePeriod} from '../components/data/timetable.data';

function Timetable({id, goBack, setPage}) {
    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Расписание занятий</PanelHeader>
            <Group mode="plain" separator="hide">
                <Box padding="system"><NoticeBanner appearance="warning" title="Архив расписаний"
                    subtitle={`${timetablePeriod}. Актуальное расписание уточняйте в колледже.`}/></Box>
            </Group>
            <Group header={<Header size="s">Выберите свою группу</Header>}>
                {timetableGroups.map(group => <SimpleCell
                    key={group.id} multiline chevron="auto" before={<Icon28UsersOutline/>}
                    onClick={() => setPage('home', group.id)}
                >{group.title}</SimpleCell>)}
            </Group>
        </Panel>
    );
}

export default connect(null, {goBack, setPage})(Timetable);
