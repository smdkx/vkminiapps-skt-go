import ModalPageHeader from '../AppModalPageHeader';
import React from 'react';
import {connect} from 'react-redux';

import {
    ModalPage,
        PanelHeaderButton,
    withPlatform,
    Platform,
    Group,
    SimpleCell,
    Placeholder
} from "@vkontakte/vkui";

import {
    Icon24Dismiss,
    Icon24Cancel,
    Icon28PaintRollerOutline,
    Icon28SmileOutline,
    Icon28CalendarOutline,
    Icon28BookOutline,
    Icon28DonateOutline,
    Icon28UserStarBadgeOutline,
    Icon28VideoOutline,
    Icon28SparkleOutline,
    Icon28FireOutline,
    Icon28BugOutline
} from '@vkontakte/icons';

import Memoji from "../../../img/memoji.png";

class UpdateInfoModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            device: ''
        };

    }

    render() {
        const {id, open, onClose, platform} = this.props;

        return (
            <ModalPage
                hideCloseButton
                open={open}
                id={id}
                header={
                    <ModalPageHeader
                        before={platform !== Platform.IOS &&
                            <PanelHeaderButton aria-label="Закрыть окно" onClick={onClose}>
                                <Icon24Cancel/>
                            </PanelHeaderButton>}

                        after={platform === Platform.IOS &&
                            <PanelHeaderButton aria-label="Закрыть окно" onClick={onClose}>
                                <Icon24Dismiss/>
                            </PanelHeaderButton>}
                    >
                        Обновление приложения
                    </ModalPageHeader>
                }
                onClose={() => {
                    onClose();
                    //document.body.style.overflow = 'auto';
                }}
                dynamicContentHeight
            >
                <Placeholder
                        icon={<img src={Memoji} height="150" width="150" alt="memoji" />}
                        title="Мы обновились!"
                        >
                            SKT Go обновился. Посмотрите, что изменилось. Вы удивитесь!
                    </Placeholder>
                <Group>
                    <SimpleCell

                    subtitle="Такой классный и воздушный"
                    before={<Icon28PaintRollerOutline/>}
                    >
                        Обновленный дизайн
                    </SimpleCell>

                    <SimpleCell

                    subtitle="Их много не бывает"
                    before={<Icon28SmileOutline/>}
                    >
                        Еще больше мемов
                    </SimpleCell>

                    <SimpleCell

                    subtitle="Стал еще удобнее чем было"
                    before={<Icon28CalendarOutline/>}
                    >
                        Улучшенный вид расписания
                    </SimpleCell>

                    <SimpleCell

                    subtitle="С полезной информацией внутри"
                    before={<Icon28BookOutline/>}
                    >
                        Удобный справочник
                    </SimpleCell>

                    <SimpleCell

                    subtitle="Открывающие новые настройки"
                    before={<Icon28DonateOutline/>}
                    >
                        Премиум возможности
                    </SimpleCell>

                    <SimpleCell

                    subtitle="Покоряй вершины уже сейчас"
                    before={<Icon28UserStarBadgeOutline/>}
                    >
                        Топ студентов
                    </SimpleCell>

                    <SimpleCell

                    subtitle="Внутри приложения"
                    before={<Icon28VideoOutline/>}
                    >
                        Отказались от рекламы
                    </SimpleCell>

                    <SimpleCell

                    subtitle="И делитесь с друзьями"
                    before={<Icon28SparkleOutline/>}
                    >
                        Получайте достижения
                    </SimpleCell>

                    <SimpleCell

                    subtitle="Загляните на вкладку «Сервисы»"
                    before={<Icon28FireOutline/>}
                    >
                        Обновленные разделы
                    </SimpleCell>

                    <SimpleCell

                    subtitle="С каждым обновлением их все меньше"
                    before={<Icon28BugOutline/>}
                    >
                        Исправление ошибок
                    </SimpleCell>
                </Group>
                {this.state.device !== 'mobile_iphone' && <div style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
                </div>}
            </ModalPage>
        );
    }

}

export default withPlatform(connect()(UpdateInfoModal));
