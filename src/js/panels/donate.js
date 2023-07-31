import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Placeholder,
    Button,
    MiniInfoCell
} from "@vkontakte/vkui";

import {
    Icon28DonateCircleFillYellow,
    Icon20LifebuoyOutline,
    Icon20GiftOutline,
    Icon20ServicesOutline,
    Icon20FavoriteOutline
} from "@vkontakte/icons";

class Donate extends React.Component {

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
                    VK Donut
                </PanelHeader>

                <Group>
                    <Placeholder
                    icon={<Icon28DonateCircleFillYellow width={56} height={56} />}
                    stretched
                    header="Что дает подписка VK Donut?"
                    action={<Button mode="commerce" size="m" href="https://vk.com/donut/teamskt" target="_blank">Оформить подписку</Button>}
                >
                        <MiniInfoCell
                        before={<Icon20LifebuoyOutline />}
                        textWrap="full"
                        >
                            Поддержка разработчиков и приложения в целом.
                        </MiniInfoCell>

                        <MiniInfoCell
                        before={<Icon20GiftOutline />}
                        textWrap="full"
                        >
                            Розыгрыш подарков среди подписчиков VK Donut.
                        </MiniInfoCell>

                        <MiniInfoCell
                        before={<Icon20ServicesOutline />}
                        textWrap="full"
                        >
                            Доступ к Premium возможностям в приложении.
                        </MiniInfoCell>

                        <MiniInfoCell
                        before={<Icon20FavoriteOutline />}
                        textWrap="full"
                        >
                            Добавление в топ студентов со специальной иконкой.
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

export default connect(null, mapDispatchToProps)(Donate);