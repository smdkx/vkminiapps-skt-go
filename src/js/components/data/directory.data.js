// Saved public college information, not live data.
export const directorySources = {
    common: 'https://collegetel.ru/sveden/common',
    admission: 'https://collegetel.ru/abituriuntu/informaciya-dlya-abiturienta',
    specialties: 'https://collegetel.ru/specialnosti',
    structure: 'https://collegetel.ru/sveden/struct',
    staff: 'https://collegetel.ru/sveden/employees',
    library: 'https://collegetel.ru/o-kolledzhe/biblioteka',
    security: 'https://collegetel.ru/o-kolledzhe/bezopasnost/informacionnaya-bezopasnost',
    diplomas: 'https://collegetel.ru/abituriuntu/obrazci-diplomov',
};

const specialtyUrl = slug => `https://collegetel.ru/specialnosti/${slug}`;
export const currentSpecialties = [
    {id: 'spec_1', code: '09.02.06', title: 'Сетевое и системное администрирование', qualification: 'Сетевой и системный администратор',
        description: 'Проектирование, настройка и обслуживание компьютерных сетей.',
        programs: [{form: 'Очная', base: '9 классов', duration: '3 года 10 месяцев'}],
        source: specialtyUrl('setevoe-i-sistemnoe-administrirovanie')},
    {id: 'spec_090211', code: '09.02.11', title: 'Разработка и управление программным обеспечением', qualification: 'Программист',
        description: 'Разработка, внедрение и сопровождение программного обеспечения.',
        programs: [{form: 'Очная', base: '9 классов', duration: '3 года 10 месяцев'}, {form: 'Очная', base: '11 классов', duration: '2 года 10 месяцев'}, {form: 'Заочная', base: '11 классов', duration: '3 года 10 месяцев'}],
        source: specialtyUrl('razrabotka-i-upravlenie-po'), extraSource: specialtyUrl('razrabotka-i-upravlenie-po-zo')},
    {id: 'spec_090212', code: '09.02.12', title: 'Техническая эксплуатация и сопровождение информационных систем', qualification: 'Специалист по технической эксплуатации и сопровождению информационных систем',
        description: 'Обслуживание информационных систем, оборудования, программ и баз данных.',
        programs: [{form: 'Очная', base: '9 классов', duration: '2 года 10 месяцев'}, {form: 'Очная', base: '11 классов', duration: '1 год 10 месяцев'}],
        source: specialtyUrl('tehnicheskaya-ekspluataciya-i-soprovozhdenie-informacionnih-sistem')},
    {id: 'spec_090213', code: '09.02.13', title: 'Интеграция решений с применением технологий искусственного интеллекта', qualification: 'Специалист по работе с искусственным интеллектом',
        description: 'Разработка и внедрение решений с искусственным интеллектом и обработка данных.',
        programs: [{form: 'Очная', base: '9 классов', duration: '3 года 10 месяцев'}],
        source: specialtyUrl('integraciya-resheniy-s-primeneniem-tehnologiy-iskusstvennogo-intellekta')},
    {id: 'spec_100204', code: '10.02.04', title: 'Обеспечение информационной безопасности телекоммуникационных систем', qualification: 'Техник по защите информации',
        description: 'Защита информации в телекоммуникационных сетях и работа с техническими средствами защиты.',
        programs: [{form: 'Очная', base: '9 классов', duration: '3 года 10 месяцев'}],
        source: specialtyUrl('obespechenie-informacionnoy-bezopasnosti-telekommunikacionnih-sistem')},
    {id: 'spec_4', code: '11.02.15', title: 'Инфокоммуникационные сети и системы связи', qualification: 'Специалист по монтажу и обслуживанию телекоммуникаций',
        description: 'Монтаж, настройка и эксплуатация оборудования сетей связи.',
        programs: [{form: 'Очная', base: '9 классов', duration: '3 года 10 месяцев'}],
        source: specialtyUrl('infokommunikacionnie-seti-i-sistemi-svyazi')},
    {id: 'spec_110218', code: '11.02.18', title: 'Системы радиосвязи, мобильной связи и телерадиовещания', qualification: 'Специалист по системам радиосвязи, мобильной связи и телерадиовещания',
        description: 'Проектирование, монтаж и эксплуатация систем радиосвязи и вещания.',
        programs: [{form: 'Очная', base: '9 классов', duration: '3 года 10 месяцев'}, {form: 'Заочная', base: '9 классов', duration: '4 года 10 месяцев'}],
        source: specialtyUrl('sistemi-radiosvyazi-mobilnoy-svyazi-i-teleradioveschaniya'), extraSource: specialtyUrl('sistemi-radiosvyazi-mobilnoy-svyazi-i-teleradioveschaniya-zo')},
];

// Preserve the two older entries without presenting their former admission terms as current.
export const previousSpecialties = [
    {id: 'spec_2', code: '09.02.07', title: 'Информационные системы и программирование', qualification: 'Программист', archived: true,
        description: 'Разработка программного обеспечения и работа с информационными системами.'},
    {id: 'spec_3', code: '11.02.08', title: 'Средства связи с подвижными объектами', qualification: 'Техник связи', archived: true,
        description: 'Обслуживание оборудования связи и систем оповещения.'},
];

// https://collegetel.ru/sveden/struct
export const collegeUnits = [
    {title: 'Администрация', name: 'Казаков Андрей Викторович', role: 'Директор', phone: '+7 (4812) 38-15-05', email: 'a.v.kazakov@collegetel.ru'},
    {title: 'Учебный отдел', name: 'Овчинникова Ирина Александровна', role: 'Заместитель директора по учебной работе', phone: '+7 (4812) 38-09-24', email: 'ovchinnikova.ia@collegetel.ru'},
    {title: 'Отдел по воспитательной и социальной работе', name: 'Ломатенков Дмитрий Александрович', role: 'Начальник отдела', phone: '+7 (4812) 38-90-68', email: 'lomatenkov@collegetel.ru'},
    {title: 'Административно-хозяйственное управление', name: 'Дубаенков Сергей Николаевич', role: 'И. о. начальника управления', phone: '+7 (4812) 38-84-14', email: 'dubaenkov@collegetel.ru'},
    {title: 'Финансово-экономический отдел', name: 'Фаталиева Галина Васильевна', role: 'Начальник отдела, главный бухгалтер', phone: '+7 (4812) 38-34-20', email: 'gb@collegetel.ru'},
    {title: 'Административно-кадровый отдел', name: 'Маркелова Ирина Сергеевна', role: 'Начальник отдела', phone: '+7 (4812) 38-88-25', email: 'otdelkadrov@collegetel.ru'},
    {title: 'Учебно-лабораторный центр', name: 'Давыдов Алексей Васильевич', role: 'Руководитель центра', phone: '+7 (4812) 38-84-14', email: 'davidov.av@collegetel.ru'},
    {title: 'Отдел информационно-образовательных ресурсов', phone: '+7 (4812) 38-12-59'},
];

// Library links are published at directorySources.library; access conditions may change.
export const libraryLinks = [
    {title: 'Айбукс', description: 'Учебная и профессиональная литература', href: 'https://ibooks.ru/'},
    {title: 'Лань', description: 'Учебники, пособия и журналы', href: 'https://e.lanbook.com/'},
    {title: 'Юрайт', description: 'Образовательная платформа', href: 'https://urait.ru/'},
    {title: 'Знаниум', description: 'Электронная библиотечная система', href: 'https://znanium.com/'},
];
export const courseLinks = [
    {title: 'Stepik', description: 'Каталог онлайн-курсов', href: 'https://stepik.org/catalog'},
    {title: 'Открытое образование', description: 'Курсы российских вузов', href: 'https://openedu.ru/'},
    {title: 'Лекториум', description: 'Онлайн-курсы, лекции и вебинары', href: 'https://www.lektorium.tv/'},
    {title: 'Arzamas', description: 'История, искусство и культура', href: 'https://arzamas.academy/courses'},
    {title: 'Яндекс Образование', description: 'Программы по цифровым технологиям', href: 'https://education.yandex.ru/'},
    {title: 'HTML Academy', description: 'HTML, CSS и JavaScript', href: 'https://htmlacademy.ru/'},
    {title: 'Microsoft Learn', description: 'Модули и учебные курсы по технологиям Microsoft', href: 'https://learn.microsoft.com/ru-ru/training/'},
];
export const securityLinks = [
    {title: 'Обучающимся', description: 'Материалы по безопасности в интернете', href: `${directorySources.security}/obuchauschimsya`},
    {title: 'Родителям', description: 'Рекомендации и памятки колледжа', href: `${directorySources.security}/roditelyam`},
    {title: 'Подборка сайтов колледжа', description: 'Образовательные ресурсы и материалы', href: `${directorySources.security}/bezopasnie-sayti`},
];

// Four gallery links verified in the DOM at directorySources.diplomas.
export const diplomaDocuments = ['1716816191', '1716816190', '1716816189', '1716816188'].map((image, index) => ({
    src: `https://collegetel.ru/new_site/images/blocks/${image}.jpg`, title: `Образец №${index + 1}`,
}));
