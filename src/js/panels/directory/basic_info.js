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
    Icon24CalendarOutline,
    Icon24ClockOutline,
    Icon24PlaceOutline,
    Icon24EducationOutline,
    Icon24UsersOutline,
    Icon24PhoneOutline,
    Icon24MentionOutline,
    Icon24LinkCircle
} from '@vkontakte/icons';

class BasicInfo extends React.Component {

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
                    Основные сведения
                </PanelHeader>

                <Group header={<Header mode="secondary">Дата создания организации</Header>}> 
                    <MiniInfoCell
                        before={<Icon24CalendarOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            05.04.1930
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Месторасположение</Header>}>
                    <MiniInfoCell
                        before={<Icon24PlaceOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            214000, г. Смоленск, ул. Коммунистическая, 21
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Филиалы образовательной организации</Header>}>
                    <MiniInfoCell
                        before={<Icon24EducationOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            Отсутствуют
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Представительства образовательной организации</Header>}>
                    <MiniInfoCell
                        before={<Icon24UsersOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            Отсутствуют
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">График работы</Header>}>
                    <MiniInfoCell
                        before={<Icon24ClockOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            Режим работы администрации: <br /> <br />
                            понедельник - пятница, 8:30 - 17:00 <br /> <br />
                            Учебные занятия: <br /> <br />
                            понедельник, вторник, четверг, пятница, 8:30 - 20:10 <br />
                            среда, 8:30 - 20:45 <br />
                            суббота, 8:30 - 18:50
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Контактные телефоны</Header>}>
                    <MiniInfoCell
                        before={<Icon24PhoneOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            Телефон: <Link target="_blank" href="tel:84812381505">8(4812) 38-15-05</Link> <br /> <br />
                            Факс: <Link target="_blank" href="tel:84812647801">8(4812) 64-78-01</Link>
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Адреса электронной почты</Header>}>
                    <MiniInfoCell
                        before={<Icon24MentionOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            <Link href="mailto:smol.kollegetelekom@mail.ru">college@collegetel.ru</Link>
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Дополнительная информация</Header>}>
                    <MiniInfoCell
                        before={<Icon24LinkCircle />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            <Link href="http://www.collegetel.ru/sveden/employees" target="_blank">Показать подробнее</Link>
                    </MiniInfoCell>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(BasicInfo);