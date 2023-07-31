import React from 'react';
import {connect} from 'react-redux';

import {
    ModalPage, 
    ModalPageHeader, 
    PanelHeaderButton, 
    withPlatform, 
    IOS, 
    Div,
    Group,
    SimpleCell,
    Card,
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

import queryString from 'query-string';

class UpdateInfoModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            device: ''
        };

    }

    componentDidMount() {
        var params = queryString.parse(window.location.search);
        this.setState({
            device: params.vk_platform
        });
    }

    render() {
        const {id, onClose, platform} = this.props;

        return (
            <ModalPage
                id={id}
                header={
                    <ModalPageHeader
                        left={platform !== IOS &&
                        <PanelHeaderButton onClick={onClose}><Icon24Cancel/></PanelHeaderButton>}
                        right={platform === IOS &&
                        <PanelHeaderButton onClick={onClose}><Icon24Dismiss/></PanelHeaderButton>}
                    >
                        
                    </ModalPageHeader>
                }
                onClose={() => {
                    onClose();
                    //document.body.style.overflow = 'auto';
                }}
                settlingHeight={100}
            >
                <Div>
                    <Placeholder
                            icon={<img src={Memoji} height="150" width="150" alt="memoji" />}
                            header="Мы обновились!"
                            >
                                SKT Go обновился. Посмотрите, что изменилось. Вы удивитесь!
                        </Placeholder>
                    <Group>
                        <Card>
                            <SimpleCell
                            disabled
                            description="Такой классный и воздушный"
                            before={<Icon28PaintRollerOutline/>} 
                            >
                                Обновленный дизайн
                            </SimpleCell>
                        </Card>

                        <Card style={{ marginTop: "10px", marginBottom: "10px"}}>
                            <SimpleCell
                            disabled
                            description="Их много не бывает"
                            before={<Icon28SmileOutline/>} 
                            >
                                Еще больше мемов
                            </SimpleCell>
                        </Card>

                        <Card style={{ marginTop: "10px", marginBottom: "10px"}}>
                            <SimpleCell
                            disabled
                            description="Стал еще удобнее чем было"
                            before={<Icon28CalendarOutline/>} 
                            >
                                Улучшенный вид расписания
                            </SimpleCell>
                        </Card>

                        <Card style={{ marginTop: "10px", marginBottom: "10px"}}>
                            <SimpleCell
                            disabled
                            description="С полезной информацией внутри"
                            before={<Icon28BookOutline/>} 
                            >
                                Удобный справочник
                            </SimpleCell>
                        </Card>

                        <Card style={{ marginTop: "10px", marginBottom: "10px"}}>
                            <SimpleCell
                            disabled
                            description="Открывающие новые настройки"
                            before={<Icon28DonateOutline/>} 
                            >
                                Премиум возможности
                            </SimpleCell>
                        </Card>

                        <Card style={{ marginTop: "10px", marginBottom: "10px"}}>
                            <SimpleCell
                            disabled
                            description="Покоряй вершины уже сейчас"
                            before={<Icon28UserStarBadgeOutline/>} 
                            >
                                Топ студентов
                            </SimpleCell>
                        </Card>

                        <Card style={{ marginTop: "10px", marginBottom: "10px"}}>
                            <SimpleCell
                            disabled
                            description="Внутри приложения"
                            before={<Icon28VideoOutline/>} 
                            >
                                Отказались от рекламы
                            </SimpleCell>
                        </Card>

                        <Card style={{ marginTop: "10px", marginBottom: "10px"}}>
                            <SimpleCell
                            disabled
                            description="И делитесь с друзьями"
                            before={<Icon28SparkleOutline/>} 
                            >
                                Получайте достижения
                            </SimpleCell>
                        </Card>

                        <Card style={{ marginTop: "10px", marginBottom: "10px"}}>
                            <SimpleCell
                            disabled
                            description="Загляните на вкладку «Сервисы»"
                            before={<Icon28FireOutline/>} 
                            >
                                Обновленные разделы
                            </SimpleCell>
                        </Card>

                        <Card style={{ marginTop: "10px", marginBottom: "10px"}}>
                            <SimpleCell
                            disabled
                            description="С каждым обновлением их все меньше"
                            before={<Icon28BugOutline/>} 
                            >
                                Исправление ошибок
                            </SimpleCell>
                        </Card>
                    </Group>
                    {this.state.device !== 'mobile_iphone' && <div style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
                    </div>}
                </Div>
            </ModalPage>
        );
    }

}

export default withPlatform(connect()(UpdateInfoModal));
