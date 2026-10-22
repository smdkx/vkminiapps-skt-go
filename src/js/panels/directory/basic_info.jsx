import React from 'react';
import {Icon28SchoolOutline} from '@vkontakte/icons';
import DirectoryPage, {DirectorySection, DirectoryFacts} from '../../components/DirectoryPage';

export default function BasicInfo({id}) {
    return <DirectoryPage id={id} title="Основные сведения" introTitle="Смоленский колледж телекоммуникаций"
        description="Филиал СПбГУТ им. проф. М. А. Бонч-Бруевича" Icon={Icon28SchoolOutline}>
        <DirectorySection title="О колледже"><DirectoryFacts items={[
            {label: 'Дата основания', value: '5 апреля 1930 года'},
            {label: 'Адрес', value: '214000, г. Смоленск, ул. Коммунистическая, 21'},
        ]}/></DirectorySection>
        <DirectorySection title="График работы"><DirectoryFacts items={[
            {label: 'Понедельник - пятница', value: '8:30 - 20:00'},
            {label: 'Суббота', value: '8:30 - 18:50'},
        ]}/></DirectorySection>
        <DirectorySection title="Контакты"><DirectoryFacts items={[
            {label: 'Приемная директора', value: '+7 (4812) 38-15-05', href: 'tel:+74812381505'},
            {label: 'Электронная почта', value: 'college@collegetel.ru', href: 'mailto:college@collegetel.ru'},
            {label: 'Факс', value: '+7 (4812) 64-78-01', href: 'tel:+74812647801'},
        ]}/></DirectorySection>
    </DirectoryPage>;
}
