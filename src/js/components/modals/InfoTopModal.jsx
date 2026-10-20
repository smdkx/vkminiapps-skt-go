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

class InfoTopModal extends React.Component {

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
                        Информация о топе
                    </ModalPageHeader>
                }
                onClose={() => {
                    onClose();
                    //document.body.style.overflow = 'auto';
                }}
                dynamicContentHeight
            >
                <Group mode="plain" header={<Header multiline>Как формируется топ?</Header>}>
                    <Box padding="system"><Text className="tw">{
                        "Топ формируется по определенным критериям, которые определяют активность студента, его компетентность и некоторые другие качества. Топ может составляться как по студентам колледжа, так и участникам приложения.\n\nПоложение пользователя в топе (его числовой номер) может меняться в зависимости от критериев. Сам топ обновляется каждый месяц."
                    }</Text></Box>
                </Group>

                <Group mode="plain" header={<Header multiline>Кто сюда попадает?</Header>}>
                    <Box padding="system"><Text className="tw">{
                        "Автоматически сюда попадают разработчики приложения, пользователи, оформившие VK Donut, или те, кто помогали в его разработке. В остальном, мы следуем критериям, отбираем лучших и добавляем сюда.\n\nВ некоторых случаях возможно попадание без выполнения некоторых условий."
                    }</Text></Box>
                </Group>

                <Group mode="plain" header={<Header multiline>Что за иконка у аватарки пользователя?</Header>}>
                    <Box padding="system"><Text className="tw">{
                        "«Донат» — выдается пользователям, которые оформили VK Donut либо сделали свой вклад в приложение.\n\n«Огонь прометея» — эксклюзивная иконка, выдается только разработчикам приложения."
                    }</Text></Box>
                </Group>

                <Group mode="plain" header={<Header multiline>Возможно ли попасть в топ?</Header>}>
                    <Box padding="system"><Text className="tw">{
                        "Конечно, все зависит от вас. Если вы считаете, что достойны оказаться тут – напишите одному из разработчиков приложения (они указаны на вкладке «Профиль»).\n\nПопав в топ у вас есть возможность выбрать себе любую подпись."
                    }</Text></Box>
                </Group>
                {this.state.device !== 'mobile_iphone' && <div style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
                </div>}
            </ModalPage>
        );
    }

}

export default withPlatform(connect()(InfoTopModal));
