import React from 'react';
import SchedulePanel from '../components/SchedulePanel';
import schedule from '../../img/schedule.png';

export default function Schedule(props) {
    return <SchedulePanel {...props} title="Расписание звонков" documentTitle="Время занятий и перемен"
        src={schedule} notice="Сохранённая версия. Дата обновления неизвестна — уточняйте время звонков в колледже."/>;
}
