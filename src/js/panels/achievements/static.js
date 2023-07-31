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

import Static from "../../../img/achievements/static.svg";

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
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Достижение
                </PanelHeader>

                <Group>
                    <Placeholder
                    stretched
                    icon={<Avatar size={160} mode='image' src={Static} className="Achievements__filter" />}
                    header="Статистика"
                >
                    <MiniInfoCell
                    before={<Icon20ArticleOutline />}
                    textWrap="full"
                    >
                        Поделиться приложением с друзьями
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