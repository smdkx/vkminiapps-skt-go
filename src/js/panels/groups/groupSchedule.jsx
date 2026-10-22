import React from 'react';
import SchedulePanel from '../../components/SchedulePanel';
import {timetablePeriod} from '../../components/data/timetable.data';

export default function GroupSchedule({group, ...props}) {
    return <SchedulePanel {...props} title={group.title} documentTitle="Расписание занятий"
        documents={group.documents || [{title: group.title, src: group.image}]}
        noticeTitle="Архив расписаний"
        notice={`${timetablePeriod}. Актуальное расписание уточняйте в колледже.`}/>;
}
