import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Placeholder,
    MiniInfoCell,
    Avatar,
    Button,
    Div
} from "@vkontakte/vkui";

import {
    Icon20ArticleOutline,
    Icon20QuestionOutline
} from "@vkontakte/icons";

import Subscriber from "../../../img/achievements/subscriber.svg";

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
                    icon={<Avatar size={160} mode='image' src={Subscriber} className="Achievements__filter" />}
                    header="Подписчик"
                >
                    <MiniInfoCell
                    before={<Icon20ArticleOutline />}
                    textWrap="full"
                    >
                        Подписаться на сообщество приложения
                    </MiniInfoCell>

                    <MiniInfoCell
                    before={<Icon20QuestionOutline />}
                    textWrap="full"
                    >
                        Статус достижения: не получено
                    </MiniInfoCell>

                    <Div>
                        <Button onClick={() => bridge.send("VKWebAppJoinGroup", {"group_id": 204275493})} size="m">Подписаться на сообщество</Button>
                    </Div>

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