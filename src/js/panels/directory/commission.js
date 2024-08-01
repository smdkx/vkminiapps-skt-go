import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Header,
    MiniInfoCell,
    Link
} from "@vkontakte/vkui";

import { 
    Icon24ClockOutline,
    Icon24PlaceOutline,
    Icon24PhoneOutline,
    Icon24MentionOutline
} from '@vkontakte/icons';

class Commission extends React.Component {

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
                    Приемная комиссия
                </PanelHeader>

                <Group header={<Header mode="secondary">Режим работы</Header>}> 
                    <MiniInfoCell
                        before={<Icon24ClockOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            С 1 июня по 30 августа с 9:00 до 18:00 (кабинет №110, 1 этаж, читальный зал) <p />
                            С 1 сентября по 31 мая с 10:00 до 17:00 (кабинет №107, 1 этаж)
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Месторасположение</Header>}>
                    <MiniInfoCell
                        before={<Icon24PlaceOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            214000, г. Смоленск, ул. Коммунистическая, дом 21
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Дополнительная информация</Header>}>
                    <MiniInfoCell
                        before={<Icon24PhoneOutline />} 
                        textWrap="full"
                        textLevel="primary"
                        >
                            <Link target="_blank" href="tel:389068">38-90-68</Link>
                    </MiniInfoCell>

                    <MiniInfoCell
                        before={<Icon24MentionOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            <Link href="mailto:smol.kollegetelekom@mail.ru">smol.kollegetelekom@mail.ru</Link>
                    </MiniInfoCell>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Commission);