import React from 'react';
import SchedulePanel from '../../components/SchedulePanel';

export default function ExamPage({id}) {
    return <SchedulePanel id={id} title="Экзамены" documentTitle="Расписание экзаменов"
        notice="Сохранённое расписание экзаменов за 2021 год. Актуальные даты уточняйте в колледже."
        src="https://i.postimg.cc/fTFZKR4H/2021-05-26-14-39-07.png"/>;
}
