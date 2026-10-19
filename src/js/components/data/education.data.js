import {timetableGroups} from './timetable.data';

// Offer only groups with a saved schedule, using the archive as the single source.
export const studentGroups = [...new Set(timetableGroups.reduce((groups, {title}) =>
    groups.concat(title.split(',').map(group => group.trim())), []))];

// https://collegetel.ru/sveden/struct
export const collegeDepartments = [
    {id: 'fulltime_1', title: 'Очное отделение №1'},
    {id: 'fulltime_2', title: 'Очное отделение №2'},
    {id: 'parttime', title: 'Заочное отделение'},
];

export const normalizeStudentGroup = group => group.trim().replace(/\s+/g, ' ').toUpperCase();

export const isValidStudentGroup = group => group === '' || /^[A-ZА-ЯЁ0-9][A-ZА-ЯЁ0-9 /-]{0,39}$/.test(group);

export const getDepartmentTitle = id => {
    const department = collegeDepartments.find(item => item.id === id);
    return department ? department.title : 'Не выбрано';
};
