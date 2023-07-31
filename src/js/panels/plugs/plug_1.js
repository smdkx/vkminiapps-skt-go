import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from "../../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Placeholder
} from "@vkontakte/vkui";

import img_plug from '../../../img/img_plug_1.png';

class Plug extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };
    }

    setTab(tab) {
        this.setState({
            activeTab: tab
        });
    }

    render() {
        const {id, goBack} = this.props;
        return (
            <Panel id={id} centered={true}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Ошибка
                </PanelHeader>
                <Group>
                    <img className="plug" src={img_plug} alt="img_plug" />
                    <Placeholder
                    header="Страница временно недоступна"
                    >
                        Страница еще не была создана или находится на стадии разработки.
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

export default connect(null, mapDispatchToProps)(Plug);