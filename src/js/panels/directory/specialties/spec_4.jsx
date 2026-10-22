import React from 'react';
import SpecialtyDetails from '../../../components/SpecialtyDetails';
import {currentSpecialties} from '../../../components/data/directory.data';

const specialty = currentSpecialties.find(item => item.id === 'spec_4');
export default function Specialty({id}) {
    return <SpecialtyDetails id={id} specialty={specialty}/>;
}
