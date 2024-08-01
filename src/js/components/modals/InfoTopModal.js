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
    Card,
    ContentCard
} from "@vkontakte/vkui";

import { 
    Icon24Dismiss,
    Icon24Cancel
} from '@vkontakte/icons';

class InfoTopModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            device: ''
        };

    }

    render() {
        const {id, onClose, platform} = this.props;

        return (
            <ModalPage
                id={id}
                header={
                    <ModalPageHeader
                        before={platform !== IOS &&
                            <PanelHeaderButton onClick={onClose}>
                                <Icon24Cancel/>
                            </PanelHeaderButton>}

                        after={platform === IOS &&
                            <PanelHeaderButton onClick={onClose}>
                                <Icon24Dismiss/>
                            </PanelHeaderButton>}
                    >
                        Информация о топе
                    </ModalPageHeader>
                }
                onClose={() => {
                    onClose();
                    //document.body.style.overflow = 'auto';
                }}
                settlingHeight={100}
            >
                <Div>
                    <Group>
                        <Card style={{ marginBottom: "10px"}}>
                            <ContentCard
                            className="tw"
                            header="Как формируется топ?"
                            text= {
                                "Топ формируется по определенным критериям, которые определяют активность студента, его компетентность и некоторые другие качества. Топ может составляться как по студентам колледжа, так и участникам приложения.\n\nПоложение пользователя в топе (его числовой номер) может меняться в зависимости от критериев. Сам топ обновляется каждый месяц." 
                            }
                            maxheight={200}
                            />
                        </Card>

                        <Card style={{ marginBottom: "10px"}}>
                            <ContentCard
                            className="tw"
                            header="Кто сюда попадает?"
                            text= {
                                "Автоматически сюда попадают разработчики приложения, пользователи, оформившие VK Donut, или те, кто помогали в его разработке. В остальном, мы следуем критериям, отбираем лучших и добавляем сюда.\n\nВ некоторых случаях возможно попадание без выполнения некоторых условий." 
                            }
                            maxheight={200}
                            />
                        </Card>

                        <Card style={{ marginBottom: "10px"}}>
                            <ContentCard
                            className="tw"
                            header="Что за иконка у аватарки пользователя?"
                            text= {
                                "«Донат» — выдается пользователям, которые оформили VK Donut либо сделали свой вклад в приложение.\n\n«Огонь прометея» — эксклюзивная иконка, выдается только разработчикам приложения." 
                            }
                            maxheight={200}
                            />
                        </Card>

                        <Card style={{ marginBottom: "10px"}}>
                            <ContentCard
                            className="tw"
                            header="Возможно ли попасть в топ?"
                            text= {
                                "Конечно, все зависит от вас. Если вы считаете, что достойны оказаться тут – напишите одному из разработчиков приложения (они указаны на вкладке «Профиль»).\n\nПопав в топ у вас есть возможность выбрать себе любую подпись." 
                            }
                            maxheight={200}
                            />
                        </Card>
                    </Group>
                    {this.state.device !== 'mobile_iphone' && <div style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
                    </div>}
                </Div>
            </ModalPage>
        );
    }

}

export default withPlatform(connect()(InfoTopModal));
