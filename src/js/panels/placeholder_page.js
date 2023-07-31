import React from 'react';
import {connect} from 'react-redux';

import {
    Panel,
    Group,
    Placeholder
} from "@vkontakte/vkui";

import img_plug from '../../img/img_plug_2.png';

class PlaceholderPage extends React.Component {

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

    /*render() {
        const {id} = this.props;

        return (
            <Panel id={id} centered={true}>
                <Group>
                    <Placeholder>
                        На данный момент сервис SKT Go недоступен в этом регионе.
                    </Placeholder>
                </Group>
            </Panel>
        );
    }*/

    render() {
        const {id} = this.props;

        return (
            <Panel id={id} centered={true}>
                <Group>
                <img className="plug" src={img_plug} alt="img_plug" />
                    <Placeholder
                    //header="Практики нет"
                    >
                        Приложение SKT Go прекратило свою поддержку.
                    </Placeholder>
                </Group>
            </Panel>
        );
    }

}

export default connect(null)(PlaceholderPage);