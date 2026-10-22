import React from 'react';
import {connect} from 'react-redux';
import {SimpleCell} from '@vkontakte/vkui';
import {Icon28TearOffFlyerOutline, Icon28NameTagOutline, Icon28WorkOutline, Icon28EducationOutline, Icon28CheckShieldDeviceOutline, Icon28SchoolOutline, Icon28Users3Outline, Icon28Cards2Outline, Icon24ExternalLinkOutline, Icon28BookOutline} from '@vkontakte/icons';
import {setPage} from '../store/router/actions';
import DirectoryPage, {DirectorySection} from '../components/DirectoryPage';
import {directorySources} from '../components/data/directory.data';

const sections = [
    {title: 'О колледже', items: [
        {panel: 'basic_info', title: 'Основные сведения', description: 'Адрес, график работы и контакты', Icon: Icon28TearOffFlyerOutline},
        {panel: 'structure', title: 'Организационная структура', description: 'Подразделения и руководители', Icon: Icon28SchoolOutline},
        {href: directorySources.staff, title: 'Педагогический состав', description: 'Преподаватели на сайте колледжа', Icon: Icon28Users3Outline},
    ]},
    {title: 'Поступление', items: [
        {panel: 'commission', title: 'Приемная комиссия', description: 'Как связаться и куда обратиться', Icon: Icon28NameTagOutline},
        {panel: 'spec', title: 'Специальности', description: 'Программы и сроки обучения', Icon: Icon28WorkOutline},
        {panel: 'diploma', title: 'Образцы дипломов', description: 'Документы о среднем профессиональном образовании', Icon: Icon28Cards2Outline},
    ]},
    {title: 'Для учебы', items: [
        {panel: 'resources', title: 'Образовательные ресурсы', description: 'Библиотеки, курсы и лекции', Icon: Icon28EducationOutline},
        {panel: 'security', title: 'Информационная безопасность', description: 'Рекомендации и полезные материалы', Icon: Icon28CheckShieldDeviceOutline},
    ]},
];

function Directory({id, setPage}) {
    return <DirectoryPage id={id} title="Справочник" introTitle="Колледж под рукой"
        description="Контакты, специальности и полезные материалы в одном месте." Icon={Icon28BookOutline}>
        {sections.map(section => <DirectorySection title={section.title} key={section.title}>
            {section.items.map(({panel, title, description, href, Icon}) => <SimpleCell key={panel || href} multiline
                before={<span className="DirectoryNav__icon"><Icon aria-hidden="true"/></span>} subtitle={description}
                chevron={href ? undefined : 'always'} after={href && <Icon24ExternalLinkOutline width={20} height={20} className="DirectoryLinks__external" aria-hidden="true"/>}
                style={{borderRadius: 0}} {...(href ? {href, target: '_blank', rel: 'noopener noreferrer'} : {onClick: () => setPage('home', panel)})}>
                {title}
            </SimpleCell>)}
        </DirectorySection>)}
    </DirectoryPage>;
}
export default connect(null, {setPage})(Directory);
