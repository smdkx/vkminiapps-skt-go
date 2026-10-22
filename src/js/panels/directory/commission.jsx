import React from 'react';
import {Text} from '@vkontakte/vkui';
import {Icon28NameTagOutline} from '@vkontakte/icons';
import DirectoryPage, {DirectorySection, DirectoryFacts, DirectoryLinks} from '../../components/DirectoryPage';
import {directorySources} from '../../components/data/directory.data';

export default function Commission({id}) {
    return <DirectoryPage id={id} title="Приемная комиссия" introTitle="Вопросы о поступлении"
        description="Уточните условия приема, документы и время визита." Icon={Icon28NameTagOutline}>
        <DirectorySection title="Связаться"><DirectoryFacts items={[
            {label: 'Телефон', value: '+7 (4812) 38-90-68', href: 'tel:+74812389068'},
            {label: 'Электронная почта', value: 'pk@collegetel.ru', href: 'mailto:pk@collegetel.ru'},
            {label: 'Адрес', value: '214000, г. Смоленск, ул. Коммунистическая, 21'},
        ]}/></DirectorySection>
        <DirectorySection title="Летний прием"><DirectoryFacts items={[
            {label: 'Период', value: 'С 1 июня по 31 августа'},
            {label: 'Понедельник - пятница', value: '9:00 - 18:00'},
            {label: 'Суббота', value: '9:00 - 13:00'},
            {label: 'Воскресенье', value: 'Выходной'},
            {label: 'Кабинеты приема', value: '№110, читальный зал, и №107. Первый этаж.'},
        ]}/><Text Component="p" className="DirectoryNote">График вне летнего приема и кабинет уточните по телефону.</Text></DirectorySection>
        <DirectorySection title="Поступающим"><DirectoryLinks items={[
            {title: 'Документы и условия приема', description: 'Официальная информация для абитуриентов', href: directorySources.admission},
            {title: 'Правила приема', description: 'Действующие документы колледжа', href: 'https://collegetel.ru/sveden/abitur#anchPriemCond'},
        ]}/></DirectorySection>
    </DirectoryPage>;
}
