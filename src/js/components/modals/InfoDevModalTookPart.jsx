import ModalPageHeader from '../AppModalPageHeader';
import React from 'react';
import UserAvatar from '../UserAvatar';
import useUserPhotos from '../../hooks/useUserPhotos';

import {connect} from 'react-redux';

import {
    ModalPage,
        PanelHeaderButton,
    withPlatform,
    Platform,
    Group,
    SimpleCell
} from "@vkontakte/vkui";

import {
    Icon24Dismiss,
    Icon24Cancel,
    Icon20DonateCircleFillYellow
} from '@vkontakte/icons';

const numericIndicator = {
    height: 20,
    width: 20,
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '20px',
    fontSize: 13,
    boxShadow: '0 4px 24px 0 rgb(0 0 0 / 8%), 0 0 12px 0 rgb(0 0 0 / 8%)',
}

const userIds = [167786810, 142033810];

function InfoDevModalTookPart({id, open, onClose, platform, active}) {
    const {photos} = useUserPhotos(userIds, active);

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
                    Приняли участие
                </ModalPageHeader>
            }
            onClose={() => {
                onClose();
                //document.body.style.overflow = 'auto';
            }}
            dynamicContentHeight
        >
            <Group>
                <SimpleCell
                chevron="auto"
                href="https://vk.com/id167786810" target="_blank"
                before={
                <div className="Avatar__photo">
                    <UserAvatar src={photos[167786810]} name="Андрей Харитонов"/>
                    <div className="Avatar__indicator" >
                        <Icon20DonateCircleFillYellow style={numericIndicator} />
                    </div>
                </div>
                }
                subtitle='Memes generator'
                >
                    Андрей Харитонов
                </SimpleCell>

                <SimpleCell
                chevron="auto"
                href="https://vk.com/id142033810" target="_blank"
                before={
                    <div className="Avatar__photo">
                        <UserAvatar src={photos[142033810]} name="Александр Макаров"/>
                        <div className="Avatar__indicator" >
                            <Icon20DonateCircleFillYellow style={numericIndicator} />
                        </div>
                    </div>
                }
                subtitle='Не пытается починить настройки'
                >
                    Александр Макаров
                </SimpleCell>
            </Group>
        </ModalPage>
    );
}

const mapStateToProps = ({router}, ownProps) => ({
    active: router.activeModals[router.activeView] === ownProps.id,
});

export default withPlatform(connect(mapStateToProps)(InfoDevModalTookPart));
