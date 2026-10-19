import React from 'react';
import SchedulePanel from '../../components/SchedulePanel';
import {timetablePeriod} from '../../components/data/timetable.data';

export default function GroupSchedule({group, ...props}) {
    return <SchedulePanel {...props} title="Расписание группы" documentTitle={group.title}
        src={group.image} documents={group.documents}
        notice={`Архив: ${timetablePeriod}. Уточняйте актуальное расписание в колледже.`}/>;
}
