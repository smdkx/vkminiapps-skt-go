import React from 'react';
import SpecialtyDetails from '../../../components/SpecialtyDetails';
import {previousSpecialties} from '../../../components/data/directory.data';

const specialty = previousSpecialties.find(item => item.id === 'spec_2');
export default function Specialty({id}) {
    return <SpecialtyDetails id={id} specialty={specialty}/>;
}
