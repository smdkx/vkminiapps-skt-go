import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Placeholder,
    MiniInfoCell,
    Avatar
} from "@vkontakte/vkui";

import {
    Icon20ArticleOutline,
    Icon20QuestionOutline
} from "@vkontakte/icons";

import NewBie from "../../../img/achievements/newbie.svg";

class Achievement extends React.Component {

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
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Достижение
                </PanelHeader>

                <Group>
                    <Placeholder
                    stretched
                    icon={<Avatar size={160} mode='image' src={NewBie} className="Achievements__filter" />}
                    header="Новичок"
                >
                    <MiniInfoCell
                    before={<Icon20ArticleOutline />}
                    textWrap="full"
                    >
                        Пользоваться приложением определенное время
                    </MiniInfoCell>

                    <MiniInfoCell
                    before={<Icon20QuestionOutline />}
                    textWrap="full"
                    >
                        Статус достижения: не получено
                    </MiniInfoCell>

                    </Placeholder>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Achievement);