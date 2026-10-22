import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Accordion, Box, Group, Header, Panel, PanelHeaderBack, SegmentedControl, VisuallyHidden} from '@vkontakte/vkui';
import PanelHeader from '../components/AppPanelHeader';
import NoticeBanner from '../components/NoticeBanner';
import DocumentImage from '../components/DocumentImage';
import Snackbar from '../components/AppSnackbar';
import {goBack} from '../store/router/actions';
import {bellSchedules} from '../components/data/bellSchedule.data';
import schedule from '../../img/schedule.png';

const dayOptions = bellSchedules.map(({id, label}) => ({value: id, label: <span className="BellSchedule__option">{label}</span>}));

function Schedule({id, goBack}) {
    const [day, setDay] = useState('regular');
    const [error, setError] = useState(null);
    const selected = bellSchedules.find(item => item.id === day);

    return <Panel id={id}>
        <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>Расписание звонков</PanelHeader>
        <div className="BellScheduleLayout">
            <NoticeBanner appearance="warning" title="Сохраненная версия"
                subtitle="Дата обновления неизвестна. Актуальное время звонков уточняйте в колледже."/>
            <SegmentedControl name={`${id}-days`} size="l" aria-label="Вариант расписания"
                options={dayOptions} value={day} onChange={setDay}/>
            <Group mode="card" separator="hide" className="BellSchedule__section" header={<Header>Время занятий</Header>}>
                <table className="BellSchedule__table">
                    <caption><VisuallyHidden>Время занятий: {selected.label}</VisuallyHidden></caption>
                    <tbody>{selected.slots.map(slot => <tr key={slot.label} className={slot.special ? 'BellSchedule__special' : undefined}>
                        <th scope="row">{slot.label}</th>
                        <td><div className="BellSchedule__intervals">{slot.times.map(([start, end]) => <span key={start} className="BellSchedule__time">
                            <time dateTime={start}>{start}</time><span aria-hidden="true"> - </span><VisuallyHidden> до </VisuallyHidden><time dateTime={end}>{end}</time>
                        </span>)}</div></td>
                    </tr>)}</tbody>
                </table>
            </Group>
            <Group mode="card" separator="hide" className="BellSchedule__section BellSchedule__source">
                <Accordion unmountOnCollapsed>
                    <Accordion.Summary style={{borderRadius: 0}}>Исходное изображение</Accordion.Summary>
                    <Accordion.Content>
                        <Box padding="system"><DocumentImage src={schedule} title="Исходное расписание звонков" onError={setError}/></Box>
                    </Accordion.Content>
                </Accordion>
            </Group>
        </div>
        {error && <Snackbar key={error} onClosed={() => setError(null)}>{error}</Snackbar>}
    </Panel>;
}

export default connect(null, {goBack})(Schedule);
