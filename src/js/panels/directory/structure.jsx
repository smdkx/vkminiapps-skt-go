import React from 'react';
import {Text, Link, Title} from '@vkontakte/vkui';
import {Icon28SchoolOutline} from '@vkontakte/icons';
import DirectoryPage, {DirectorySection} from '../../components/DirectoryPage';
import {collegeUnits} from '../../components/data/directory.data';

export default function Structure({id}) {
    return <DirectoryPage id={id} title="Структура" introTitle="К кому обратиться"
        description="Подразделения и контакты колледжа." Icon={Icon28SchoolOutline}>
        <DirectorySection title="Подразделения">
            <ul className="DirectoryUnits">{collegeUnits.map(unit => <li key={unit.title}>
                <Title Component="h3" level="3" weight="2">{unit.title}</Title>
                {unit.name && <Text className="DirectoryUnits__name">{unit.name}</Text>}
                {unit.role && <Text className="DirectoryUnits__role">{unit.role}</Text>}
                <div className="DirectoryUnits__contacts">
                    <Link href={`tel:${unit.phone.replace(/[^+\d]/g, '')}`}>{unit.phone}</Link>
                    {unit.email && <Link href={`mailto:${unit.email}`}>{unit.email}</Link>}
                </div>
            </li>)}</ul>
        </DirectorySection>
    </DirectoryPage>;
}
