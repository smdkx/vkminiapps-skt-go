import React from 'react';
import {Title, Text, Footnote} from '@vkontakte/vkui';
import {Icon28WorkOutline} from '@vkontakte/icons';
import DirectoryPage, {DirectorySection, DirectoryFacts} from './DirectoryPage';
import NoticeBanner from './NoticeBanner';

export default function SpecialtyDetails({id, specialty}) {
    return <DirectoryPage id={id} title="Специальность" introTitle={specialty.title}
        description={specialty.code} Icon={Icon28WorkOutline}>
        {specialty.archived && <NoticeBanner title="Из прежнего справочника"
            subtitle="Сведения сохранены для ознакомления. Условия текущего набора смотрите в актуальном списке специальностей."/>}
        <DirectorySection title="О специальности"><DirectoryFacts items={[
            {label: 'Квалификация', value: specialty.qualification},
            {label: 'Чем предстоит заниматься', value: specialty.description},
        ]}/></DirectorySection>
        {specialty.programs && <DirectorySection title="Форма и срок обучения">
            <ul className="DirectoryPrograms">{specialty.programs.map(program => <li key={`${program.form}-${program.base}`}>
                <div>
                    <Title Component="h3" level="3" weight="2">{program.form}</Title>
                    <Footnote Component="p">На базе {program.base}</Footnote>
                </div>
                <Text weight="2">{program.duration}</Text>
            </li>)}</ul>
            <Text Component="p" className="DirectoryNote">Наличие мест, стоимость и условия приема уточняйте в приемной комиссии.</Text>
        </DirectorySection>}
    </DirectoryPage>;
}
