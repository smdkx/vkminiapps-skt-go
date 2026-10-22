// Times transcribed from src/img/schedule.png. The source has no update date.
const regular = [
    {label: '1 пара', times: [['08:30', '09:15'], ['09:20', '10:05']]},
    {label: '2 пара', times: [['10:15', '11:00'], ['11:05', '11:50']]},
    {label: '3 пара', times: [['12:35', '13:20'], ['13:25', '14:10']]},
    {label: '4 пара', times: [['14:30', '15:15'], ['15:20', '16:05']]},
    {label: '5 пара', times: [['16:15', '17:00'], ['17:05', '17:50']]},
    {label: '6 пара', times: [['18:35', '19:20'], ['19:25', '20:10']]},
];

export const bellSchedules = [
    {id: 'regular', label: 'Пн, вт, чт, пт', slots: regular},
    {id: 'wednesday', label: 'Среда', slots: [
        ...regular.slice(0, 3),
        {label: 'Оргчас', times: [['14:20', '15:00']], special: true},
        {label: '4 пара', times: [['15:05', '15:50'], ['15:55', '16:40']]},
        {label: '5 пара', times: [['16:50', '17:35'], ['17:40', '18:25']]},
        {label: '6 пара', times: [['19:10', '19:55'], ['20:00', '20:45']]},
    ]},
    {id: 'saturday', label: 'Суббота', slots: [
        ...regular.slice(0, 2),
        {label: '3 пара', times: [['12:00', '12:45'], ['12:50', '13:35']]},
        {label: '4 пара', times: [['13:45', '14:30'], ['14:35', '15:20']]},
        {label: '5 пара', times: [['15:30', '16:15'], ['16:20', '17:05']]},
        {label: '6 пара', times: [['17:15', '18:00'], ['18:05', '18:50']]},
    ]},
];
