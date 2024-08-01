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
    Snackbar,
    Button,
    Div
} from "@vkontakte/vkui";

import {
    Icon16ErrorCircleOutline,
    Icon20ArticleOutline,
    Icon20QuestionOutline
} from "@vkontakte/icons";

import Donut from "../../../img/achievements/donut.svg";

class Achievement extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };

        this.openSnackbar = this.openSnackbar.bind(this);
    }

    openSnackbar () {
        bridge.send("VKWebAppTapticNotificationOccurred", {"type": "error"}); //вибро
        if (this.state.snackbar) return;
        this.setState({ snackbar:
          <Snackbar
            layout='vertical'
            onClose={() => this.setState({ snackbar: null })}
            before={<Avatar size={24} style={{ background: 'red' }}><Icon16ErrorCircleOutline fill="#fff" width={14} height={14} /></Avatar>}
          >
              Подписка VK Donut не оформлена.
          </Snackbar>
        });
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
                    icon={<Avatar size={160} mode='image' src={Donut} className="Achievements__filter" />}
                    header="Пончик"
                >
                    <MiniInfoCell
                    before={<Icon20ArticleOutline />}
                    textWrap="full"
                    >
                        Оформить подписку VK Donut
                    </MiniInfoCell>

                    <MiniInfoCell
                    before={<Icon20QuestionOutline />}
                    textWrap="full"
                    >
                        Статус достижения: не получено
                    </MiniInfoCell>

                    <Div>
                        <Button onClick={this.openSnackbar} size="m">Проверить подписку</Button>
                    </Div>

                    </Placeholder>
                </Group>

                {this.state.snackbar}

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Achievement);