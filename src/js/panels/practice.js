import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    /*SimpleCell,
    Header,
    Div,*/
    Placeholder
} from "@vkontakte/vkui";

/*
import { 
    Icon28UsersOutline
} from '@vkontakte/icons';
*/

import img_plug from '../../img/img_plug_2.png';

class Practice extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };
    }

    async componentDidMount() {
        document.getElementsByClassName('Tabbar')[0].style.display = 'none'; //отключаем таббар
    }

    render() {
        const {id, goBack, /*setPage*/} = this.props;

        /*return (
            <Panel id={id}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Практика
                </PanelHeader>

                <Group header={<Header mode="secondary">Учебная практика</Header>}>
                    <SimpleCell 
                    before={<Icon28UsersOutline/>} 
                    onClick={() => setPage('home', 'practice_group_1')}
                    >
                        Практика группы КС9518
                    </SimpleCell>

                    <SimpleCell 
                    before={<Icon28UsersOutline/>} 
                    onClick={() => setPage('home', 'practice_group_2')}
                    >
                        Практика группы КС11519
                    </SimpleCell>
                </Group>

                <Group header={<Header mode="secondary">Производственная практика</Header>}>
                    <Div style={{ color: '#818C99' }}>
                    Информация временно отсутствует.
                    </Div>
                </Group>
            </Panel>
        );*/

        return (
            <Panel id={id} centered={true}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Практика
                </PanelHeader>
                <Group>
                    <img className="plug" src={img_plug} alt="img_plug" />
                    <Placeholder
                    header="Практики нет"
                    >
                        Кажется, практика была закончена, все под контролем!
                    </Placeholder>
                </Group>
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack,
    setPage
};

export default connect(null, mapDispatchToProps)(Practice);