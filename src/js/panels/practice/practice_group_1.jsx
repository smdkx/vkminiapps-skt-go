import React from 'react';
import SchedulePanel from '../../components/SchedulePanel';
import practice from '../../../img/practices/practice_group_1.png';

export default function PracticeGroup({id}) {
    return <SchedulePanel id={id} title="Расписание практики" documentTitle="Расписание практики"
        notice="Сохранённое расписание практики. Актуальные даты уточняйте в колледже."
        src={practice}/>;
}
