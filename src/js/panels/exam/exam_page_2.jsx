import React from 'react';
import SchedulePanel from '../../components/SchedulePanel';

export default function ExamPage({id}) {
    return <SchedulePanel id={id} title="Экзамены" documentTitle="Расписание экзаменов"
        notice="Сохранённое расписание экзаменов за 2021 год. Актуальные даты уточняйте в колледже."
        src="https://i.postimg.cc/d0WKhs9m/2021-05-26-14-41-36.png"/>;
}
