import React from 'react';
import {connect} from 'react-redux';
import {Button, Group, Panel, PanelHeader, PanelHeaderBack, Placeholder} from '@vkontakte/vkui';
import {goBack} from '../store/router/actions';
import imgPlug from '../../img/img_plug_2.png';

function Practice({id, goBack}) {
    return (
        <Panel id={id} centered>
            <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Практика</PanelHeader>
            <Group>
                <img className="plug" src={imgPlug} alt=""/>
                <Placeholder header="Расписание пока не добавлено"
                    action={<Button size="m" mode="secondary" href="https://www.collegetel.ru/"
                        target="_blank" rel="noopener noreferrer">Сайт колледжа</Button>}
                >Уточните даты и время в колледже. Отсутствие расписания в приложении не означает, что занятий нет.</Placeholder>
            </Group>
        </Panel>
    );
}

export default connect(null, {goBack})(Practice);
