import React from 'react';
import {connect} from 'react-redux';
import {ModalPage, PanelHeaderButton, PanelHeaderBack, Group, SimpleCell, Avatar} from '@vkontakte/vkui';
import {Icon24Dismiss, Icon20DonutCoinCircleFillYellow} from '@vkontakte/icons';
import ModalPageHeader from '../AppModalPageHeader';
import UserAvatar from '../UserAvatar';
import useUserPhotos from '../../hooks/useUserPhotos';
import {goBack} from '../../store/router/actions';

const contributors = [
    {id: 167786810, name: 'Андрей Харитонов', role: 'Мемы для приложения'},
    {id: 142033810, name: 'Александр Макаров', role: 'Не пытается починить настройки'},
];
const userIds = contributors.map(user => user.id);

function InfoDevModalTookPart({id, open, onClose, active, goBack}) {
    const {photos} = useUserPhotos(userIds, active);

    return <ModalPage hideCloseButton open={open} id={id} onClose={onClose} dynamicContentHeight
        header={<ModalPageHeader
            before={<PanelHeaderBack hideLabelOnIOS hideLabelOnVKCom aria-label="Назад к разработчикам" onClick={goBack}/>}
            after={<PanelHeaderButton aria-label="Закрыть окно" onClick={onClose}><Icon24Dismiss/></PanelHeaderButton>}>
            Приняли участие
        </ModalPageHeader>}>
        <Group mode="plain" separator="hide" className="TeamModal">
            {contributors.map(user => <SimpleCell key={user.id} className="TeamModal__person" chevron="auto" multiline
                href={`https://vk.com/id${user.id}`} target="_blank" rel="noopener noreferrer" subtitle={user.role}
                before={<UserAvatar size={48} src={photos[user.id]} name={user.name}>
                    <Avatar.Badge role="img" aria-label="Особый вклад в приложение">
                        <Icon20DonutCoinCircleFillYellow aria-hidden="true"/>
                    </Avatar.Badge>
                </UserAvatar>}>
                {user.name}
            </SimpleCell>)}
        </Group>
    </ModalPage>;
}

export default connect(({router}, ownProps) => ({
    active: router.activeModals[router.activeView] === ownProps.id,
}), {goBack})(InfoDevModalTookPart);
