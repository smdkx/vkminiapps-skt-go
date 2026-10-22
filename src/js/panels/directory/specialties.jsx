import React from 'react';
import {connect} from 'react-redux';
import {SimpleCell, Accordion} from '@vkontakte/vkui';
import {Icon28WorkOutline} from '@vkontakte/icons';
import {setPage} from '../../store/router/actions';
import DirectoryPage, {DirectorySection} from '../../components/DirectoryPage';
import {currentSpecialties, previousSpecialties} from '../../components/data/directory.data';

function Specialties({id, setPage}) {
    const row = specialty => <SimpleCell key={specialty.id} multiline chevron="always" style={{borderRadius: 0}}
        subtitle={`${specialty.code}${specialty.programs ? ` · ${[...new Set(specialty.programs.map(program => program.form))].join(' / ')}` : ''}`}
        onClick={() => setPage('home', specialty.id)}>
        <span className="DirectorySpecialtyTitle">{specialty.title}</span>
    </SimpleCell>;
    return <DirectoryPage id={id} title="Специальности" introTitle="Выберите направление"
        description="Программы, опубликованные колледжем для приема в 2026 году." Icon={Icon28WorkOutline}>
        <DirectorySection title="Программы колледжа" className="DirectorySpecialties">{currentSpecialties.map(row)}</DirectorySection>
        <DirectorySection>
            <Accordion unmountOnCollapsed>
                <Accordion.Summary style={{borderRadius: 0}}>Из прежнего справочника</Accordion.Summary>
                <Accordion.Content>{previousSpecialties.map(row)}</Accordion.Content>
            </Accordion>
        </DirectorySection>
    </DirectoryPage>;
}
export default connect(null, {setPage})(Specialties);
