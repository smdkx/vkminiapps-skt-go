import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../../store/router/actions";

import {
    Panel,
    PanelHeaderBack,
    Group,
    Header,
    MiniInfoCell
} from '@vkontakte/vkui';
import PanelHeader from '../../../components/AppPanelHeader';

import { 
    Icon24ArticleOutline,
    Icon24ClockOutline,
    Icon24InfoCircleOutline
} from '@vkontakte/icons';

class Spec extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };
    }

    render() {
        const {id, goBack} = this.props;

        return (
            <Panel id={id} className="DirectoryPanel">
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Специальность
                </PanelHeader>

                <Group header={<Header size="s">Наименование специальности</Header>}>
                    <MiniInfoCell
                        before={<Icon24ArticleOutline />} 
                        textWrap="full"
                        mode="accent"
                        >
                            Информационные системы и программирование. Квалификация: «Программист».
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Срок обучения</Header>}>
                    <MiniInfoCell
                        before={<Icon24ClockOutline />} 
                        textWrap="full"
                        mode="accent"
                        >
                            Бюджет, Очное на базе 9 кл. (3 года 10 месяцев) <br />
                            Бюджет, Очное на базе 11 кл. (2 года 10 месяцев) <br />
                            Платное, Очное на базе 9 кл. (3 года 10 месяцев) <br />
                            Платное, Очное на базе 11 кл. (2 года 10 месяцев)
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Дополнительная информация</Header>}>
                    <MiniInfoCell
                        before={<Icon24InfoCircleOutline />} 
                        textWrap="full"

                        >
                            Программист – это специалист, занимающийся разработкой программного обеспечения (ПО) для персональных, встраиваемых, промышленных и других разновидностей компьютеров, то есть программированием.
                    </MiniInfoCell>

                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Spec);