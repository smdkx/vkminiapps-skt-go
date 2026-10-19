import React from 'react';
import {connect} from 'react-redux';
import {Banner, Card, Div, Group, Header, Panel, PanelHeader, PanelHeaderBack, SimpleCell} from '@vkontakte/vkui';
import {Icon28InfoOutline, Icon28UsersOutline} from '@vkontakte/icons';
import {goBack, setPage} from '../store/router/actions';
import {timetableGroups, timetablePeriod} from '../components/data/timetable.data';

function Timetable({id, goBack, setPage}) {
    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Расписание занятий</PanelHeader>
            <Group>
                <Banner before={<Icon28InfoOutline/>} header="Архив расписаний"
                    subheader={`${timetablePeriod}. Актуальное расписание уточняйте в колледже.`}/>
            </Group>
            <Group header={<Header mode="secondary">Выберите свою группу</Header>}>
                <Div>
                    <Card mode="shadow">
                        {timetableGroups.map(group => <SimpleCell
                            key={group.id} multiline expandable before={<Icon28UsersOutline/>}
                            onClick={() => setPage('home', group.id)}
                        >{group.title}</SimpleCell>)}
                    </Card>
                </Div>
            </Group>
        </Panel>
    );
}

export default connect(null, {goBack, setPage})(Timetable);
