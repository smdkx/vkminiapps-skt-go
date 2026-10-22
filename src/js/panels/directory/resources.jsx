import React from 'react';
import {Text} from '@vkontakte/vkui';
import {Icon28EducationOutline} from '@vkontakte/icons';
import DirectoryPage, {DirectorySection, DirectoryLinks} from '../../components/DirectoryPage';
import {libraryLinks, courseLinks} from '../../components/data/directory.data';

export default function Resources({id}) {
    return <DirectoryPage id={id} title="Ресурсы" introTitle="Для учебы и новых знаний"
        description="Электронные библиотеки, онлайн-курсы и лекции." Icon={Icon28EducationOutline}>
        <DirectorySection title="Электронные библиотеки"><DirectoryLinks items={libraryLinks}/>
            <Text Component="p" className="DirectoryNote">Условия доступа и регистрации уточните в библиотеке колледжа.</Text>
        </DirectorySection>
        <DirectorySection title="Курсы и лекции"><DirectoryLinks items={courseLinks}/>
            <Text Component="p" className="DirectoryNote">На платформах могут быть платные программы. Условия указаны на их сайтах.</Text>
        </DirectorySection>
    </DirectoryPage>;
}
