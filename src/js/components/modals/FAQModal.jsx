import ModalPageHeader from '../AppModalPageHeader';
import React from 'react';
import {connect} from 'react-redux';

import {
    ModalPage,
        PanelHeaderButton,
    withPlatform,
    Platform,
    Box,
    Group,
    Header,
    Text
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
                        Справка
                    </ModalPageHeader>
                }
                onClose={() => {
                    onClose();
                    //document.body.style.overflow = 'auto';
                }}
                dynamicContentHeight
            >
                <Group mode="plain" header={<Header multiline>Информация о сервисе</Header>}>
                    <Box padding="system"><Text className="tw">{
                        "SKT Go – это небольшое мини-приложение (сервис), которое создано для помощи студентам. В самом приложении имеются разделы с учебным расписанием, расписанием самих групп, справочником и другой полезной информации!\n\nСо временем будут дополняться и обновляться уже имеющиеся разделы. Для предложения своей идеи можно связаться с разработчиком (информация расположена на вкладке «Профиль»)."
                    }</Text></Box>
                </Group>
                {this.state.device !== 'mobile_iphone' && <div style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
                </div>}
            </ModalPage>
        );
    }

}

export default withPlatform(connect()(TopInfoModal));
