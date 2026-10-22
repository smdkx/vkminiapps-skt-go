import React from 'react';
import {connect} from 'react-redux';
import {ModalPage, PanelHeaderButton, withPlatform, Platform, Group, SimpleCell, Avatar} from '@vkontakte/vkui';
import {Icon24Dismiss, Icon24Cancel, Icon28UsersOutline, Icon20FireCircleFillRed} from '@vkontakte/icons';
import ModalPageHeader from '../AppModalPageHeader';
import UserAvatar from '../UserAvatar';
import useUserPhotos from '../../hooks/useUserPhotos';
import {openModal} from '../../store/router/actions';

const userIds = [214477552];

function InfoDevModal({id, open, onClose, platform, active, openModal}) {
    const {photos} = useUserPhotos(userIds, active);
    const closeButton = <PanelHeaderButton aria-label="Закрыть окно" onClick={onClose}>
        {platform === Platform.IOS ? <Icon24Dismiss/> : <Icon24Cancel/>}
    </PanelHeaderButton>;

    return <ModalPage hideCloseButton open={open} id={id} onClose={onClose} dynamicContentHeight
        header={<ModalPageHeader before={platform !== Platform.IOS && closeButton}
            after={platform === Platform.IOS && closeButton}>Разработчики</ModalPageHeader>}>
        <Group mode="plain" separator="hide" className="TeamModal">
            <SimpleCell className="TeamModal__person" chevron="auto" multiline
                subtitle="Создатель и разработчик" href="https://vk.com/id214477552" target="_blank" rel="noopener noreferrer"
                before={<UserAvatar size={48} src={photos[214477552]} name="Сергей Ушаков">
                    <Avatar.Badge role="img" aria-label="Создатель приложения">
                        <Icon20FireCircleFillRed aria-hidden="true"/>
                    </Avatar.Badge>
                </UserAvatar>}>
                Сергей Ушаков
            </SimpleCell>
            <SimpleCell className="TeamModal__participants" before={<Avatar size={48} aria-hidden="true"><Icon28UsersOutline/></Avatar>} chevron="always" multiline
                onClick={() => openModal('MODAL_PAGE_DEV_INFO_TOOK_PART')}>
                Приняли участие
            </SimpleCell>
        </Group>
    </ModalPage>;
}

export default withPlatform(connect(({router}, ownProps) => ({
    active: router.activeModals[router.activeView] === ownProps.id,
}), {openModal})(InfoDevModal));
