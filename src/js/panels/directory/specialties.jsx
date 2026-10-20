import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from "../../store/router/actions";

import {
    Panel,
    PanelHeaderBack,
    Group,
    Header,
    SimpleCell
} from '@vkontakte/vkui';
import PanelHeader from '../../components/AppPanelHeader';

import {
    Icon28WorkOutline
} from '@vkontakte/icons';

class Specialties extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };
    }

    render() {
        const {id, goBack, setPage} = this.props;

        return (
            <Panel id={id} className="DirectoryPanel">
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Специальности
                </PanelHeader>

                <Group header={<Header size="s">Список специальностей</Header>}>
                    <SimpleCell multiline
                    before={<Icon28WorkOutline/>}
                    onClick={() => setPage('home', 'spec_1')}
                    >
                        Сетевое и системное администрирование
                    </SimpleCell>

                    <SimpleCell multiline
                    before={<Icon28WorkOutline/>}
                    onClick={() => setPage('home', 'spec_2')}
                    >
                        Информационные системы и программирование
                    </SimpleCell>

                    <SimpleCell multiline
                    before={<Icon28WorkOutline/>}
                    onClick={() => setPage('home', 'spec_3')}
                    >
                        Средства связи с подвижными объектами
                    </SimpleCell>

                    <SimpleCell multiline
                    before={<Icon28WorkOutline/>}
                    onClick={() => setPage('home', 'spec_4')}
                    >
                        Инфокоммуникационные сети и системы связи
                    </SimpleCell>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack,
    setPage
};

export default connect(null, mapDispatchToProps)(Specialties);