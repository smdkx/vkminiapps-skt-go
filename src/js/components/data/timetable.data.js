import timetable1 from '../../../img/groups/timetable_1.png';
import timetable2 from '../../../img/groups/timetable_2.png';
import timetable3 from '../../../img/groups/timetable_3.png';
import timetable5 from '../../../img/groups/timetable_5.png';
import timetable6 from '../../../img/groups/timetable_6.png';
import timetable8 from '../../../img/groups/timetable_8.png';
import timetable9 from '../../../img/groups/timetable_9.png';
import timetable10 from '../../../img/groups/timetable_10.png';
import timetable11 from '../../../img/groups/timetable_11.png';
import timetable12 from '../../../img/groups/timetable_12.png';

// Сохранённые документы, а не актуальное расписание колледжа.
export const timetablePeriod = '2-й семестр 2021/2022 учебного года';

export const timetableGroups = [
    {id: 'group_1', title: 'СП9121, ИКСС9221, ИКСС9321', image: timetable1},
    {id: 'group_2', title: 'ИКСС9421, ССА9521, ИСП9621', image: timetable2},
    {id: 'group_3', title: 'ИСП9721, ИСП9921', image: timetable3},
    {id: 'group_4', title: 'С9120, М9220, СП9420', image: timetable5},
    {id: 'group_5', title: 'КС9520', image: timetable6},
    {id: 'group_6', title: 'ПКС9620', image: timetable6},
    {id: 'group_7', title: 'ПКС9720', image: timetable6},
    {id: 'group_8', title: 'КС9419', image: timetable9},
    {id: 'group_9', title: 'ПКС9718, ПКС9818, ПКС11819, ПКС11919', documents: [
        {title: 'ПКС9718, ПКС11819', src: timetable12},
        {title: 'ПКС9818, ПКС11919', src: timetable11},
    ]},
    {id: 'group_10', title: 'ПКС9619, ПКС9719', image: timetable8},
    {id: 'group_11', title: 'КС11519, КС9518', image: timetable10},
];

// Each group gets its own route while sharing the original scan.
export const timetableEntries = timetableGroups.flatMap(group => {
    const titles = group.title.split(',').map(title => title.trim());
    return titles.map((title, index) => ({
        id: titles.length === 1 ? group.id : `${group.id}_${index + 1}`,
        title,
        documents: group.documents
            ? group.documents.filter(document => document.title.split(',').some(item => item.trim() === title))
            : [{title: group.title, src: group.image}],
    }));
});

// Keep existing grouped routes working as well.
export const timetablePanels = [
    ...timetableGroups,
    ...timetableEntries.filter(entry => !timetableGroups.some(group => group.id === entry.id)),
];
