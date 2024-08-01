import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Placeholder
} from "@vkontakte/vkui";

import img_plug from '../../img/img_plug_2.png';

class Exam extends React.Component {

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
        const {id, goBack} = this.props;

        /*return (
            <Panel id={id}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Экзамены
                </PanelHeader>

                <Group header={<Header mode="secondary">Расписание экзаменов</Header>}>
                    <SimpleCell 
                    before={<Icon28UsersOutline/>} 
                    onClick={() => setPage('home', 'exam_page_1')}
                    >
                        Расписание групп КС11618, КС9517
                    </SimpleCell>

                    <SimpleCell 
                    before={<Icon28UsersOutline/>} 
                    onClick={() => setPage('home', 'exam_page_2')}
                    >
                        Расписание групп ПКС9617, ПКС9717
                    </SimpleCell>

                    <SimpleCell 
                    before={<Icon28UsersOutline/>} 
                    onClick={() => setPage('home', 'exam_page_3')}
                    >
                        Расписание групп КС11519, КС9518
                    </SimpleCell>
                </Group>

            </Panel>
        );*/

        return (
            <Panel id={id} centered={true}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Экзамены
                </PanelHeader>
                <Group>
                    <img className="plug" src={img_plug} alt="img_plug" />
                    <Placeholder
                    header="Экзаменов нет"
                    >
                        Кажется, экзамены были закончены, все под контролем!
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

export default connect(null, mapDispatchToProps)(Exam);