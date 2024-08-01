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

class TopInfoModal extends React.Component {

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
                        Справка
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
                            header="Информация о сервисе"
                            text= {
                                "SKT Go – это небольшое мини-приложение (сервис), которое создано для помощи студентам. В самом приложении имеются разделы с учебным расписанием, расписанием самих групп, справочником и другой полезной информации!\n\nСо временем будут дополняться и обновляться уже имеющиеся разделы. Для предложения своей идеи можно связаться с разработчиком (информация расположена на вкладке «Профиль»)." 
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

export default withPlatform(connect()(TopInfoModal));
