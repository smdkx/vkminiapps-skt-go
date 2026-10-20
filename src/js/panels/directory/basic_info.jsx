import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import {
    Panel,
    PanelHeaderBack,
    Group,
    Header,
    MiniInfoCell,
    Link
} from '@vkontakte/vkui';
import PanelHeader from '../../components/AppPanelHeader';

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
            <Panel id={id} className="DirectoryPanel">
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Основные сведения
                </PanelHeader>

                <Group header={<Header size="s">Дата создания организации</Header>}>
                    <MiniInfoCell
                        before={<Icon24CalendarOutline />}
                        textWrap="full"
                        mode="accent"
                        >
                            05.04.1930
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Месторасположение</Header>}>
                    <MiniInfoCell
                        before={<Icon24PlaceOutline />}
                        textWrap="full"
                        mode="accent"
                        >
                            214000, г. Смоленск, ул. Коммунистическая, 21
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Филиалы образовательной организации</Header>}>
                    <MiniInfoCell
                        before={<Icon24EducationOutline />}
                        textWrap="full"
                        mode="accent"
                        >
                            Отсутствуют
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Представительства образовательной организации</Header>}>
                    <MiniInfoCell
                        before={<Icon24UsersOutline />}
                        textWrap="full"
                        mode="accent"
                        >
                            Отсутствуют
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">График работы</Header>}>
                    <MiniInfoCell
                        before={<Icon24ClockOutline />}
                        textWrap="full"
                        mode="accent"
                        >
                            Режим работы администрации: <br /> <br />
                            понедельник - пятница, 8:30 - 17:00 <br /> <br />
                            Учебные занятия: <br /> <br />
                            понедельник, вторник, четверг, пятница, 8:30 - 20:10 <br />
                            среда, 8:30 - 20:45 <br />
                            суббота, 8:30 - 18:50
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Контактные телефоны</Header>}>
                    <MiniInfoCell
                        before={<Icon24PhoneOutline />}
                        textWrap="full"
                        mode="accent"
                        >
                            Телефон: <Link target="_blank" href="tel:84812381505">8(4812) 38-15-05</Link> <br /> <br />
                            Факс: <Link target="_blank" href="tel:84812647801">8(4812) 64-78-01</Link>
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Адреса электронной почты</Header>}>
                    <MiniInfoCell
                        before={<Icon24MentionOutline />}
                        textWrap="full"
                        mode="accent"
                        >
                            <Link href="mailto:college@collegetel.ru">college@collegetel.ru</Link>
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Дополнительная информация</Header>}>
                    <MiniInfoCell
                        before={<Icon24LinkCircle />}
                        textWrap="full"
                        mode="accent"
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
