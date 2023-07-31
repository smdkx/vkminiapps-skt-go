import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Header,
    MiniInfoCell
} from "@vkontakte/vkui";

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
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Специальность
                </PanelHeader>

                <Group header={<Header mode="secondary">Наименование специальности</Header>}> 
                    <MiniInfoCell
                        before={<Icon24ArticleOutline />} 
                        textWrap="full"
                        textLevel="primary"
                        >
                            Инфокоммуникационные сети и системы связи. Квалификация: «Специалист по обслуживанию телекоммуникаций».
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Срок обучения</Header>}>
                    <MiniInfoCell
                        before={<Icon24ClockOutline />} 
                        textWrap="full"
                        textLevel="primary"
                        >
                            Бюджет, Очное на базе 9 кл. (4 года 10 месяцев)
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Дополнительная информация</Header>}>
                    <MiniInfoCell
                        before={<Icon24InfoCircleOutline />} 
                        textWrap="full"
                        textLevel="secondary"
                        >
                            Специалист по обслуживанию сетей телекоммуникации занимается установкой и настройкой телекоммуникационного оборудования, их техобслуживанием и устранением неполадок. Специалисты пользуются высоким спросом.
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