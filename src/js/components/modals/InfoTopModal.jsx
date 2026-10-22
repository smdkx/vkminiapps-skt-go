import React from 'react';
import {ModalPage, PanelHeaderButton, withPlatform, Platform, Title, Text, Footnote} from '@vkontakte/vkui';
import {
    Icon24Dismiss, Icon24Cancel, Icon28UserStarBadgeOutline, Icon28UsersOutline, Icon28MessageOutline,
    Icon20FireCircleFillRed, Icon20DonutCoinCircleFillYellow,
} from '@vkontakte/icons';
import ModalPageHeader from '../AppModalPageHeader';

const details = [
    {title: 'Как формируется список', description: 'Список составляется вручную. Положение участников в топе может меняться.', Icon: Icon28UsersOutline},
    {title: 'Как попасть в топ', description: 'Напиши разработчику из раздела «Профиль». После добавления можно выбрать свою подпись.', Icon: Icon28MessageOutline},
];
const badges = [
    {id: 'creator', description: 'Создатель приложения.', Icon: Icon20FireCircleFillRed},
    {id: 'supporter', description: 'Подписка VK Donut или вклад в развитие приложения.', Icon: Icon20DonutCoinCircleFillYellow},
];

function InfoTopModal({id, open, onClose, platform}) {
    const closeButton = <PanelHeaderButton aria-label="Закрыть окно" onClick={onClose}>
        {platform === Platform.IOS ? <Icon24Dismiss/> : <Icon24Cancel/>}
    </PanelHeaderButton>;

    return <ModalPage hideCloseButton open={open} id={id} onClose={onClose} dynamicContentHeight
        header={<ModalPageHeader before={platform !== Platform.IOS && closeButton}
            after={platform === Platform.IOS && closeButton}>О топе</ModalPageHeader>}>
        <div className="ServiceInfo TopInfo">
            <div className="ServiceInfo__intro">
                <span className="ServiceInfo__logo"><Icon28UserStarBadgeOutline width={32} height={32} aria-hidden="true"/></span>
                <div className="ServiceInfo__introText">
                    <Title Component="h2" level="2" weight="2" className="ServiceInfo__title">Топ студентов</Title>
                    <Text className="ServiceInfo__description">Знакомься с участниками приложения.</Text>
                </div>
            </div>
            <ul className="ServiceInfo__features" aria-label="Об участии в топе">
                {details.map(({title, description, Icon}) => <li key={title} className="ServiceInfo__feature">
                    <span className="ServiceInfo__icon"><Icon aria-hidden="true"/></span>
                    <div className="ServiceInfo__featureText">
                        <Text Component="h3" weight="2" className="ServiceInfo__featureTitle">{title}</Text>
                        <Footnote Component="p" className="ServiceInfo__description">{description}</Footnote>
                    </div>
                </li>)}
            </ul>
            <section className="TopInfo__badges" aria-labelledby={`${id}-badges`}>
                <Text Component="h3" weight="2" className="TopInfo__legendTitle" id={`${id}-badges`}>Значки у аватарки</Text>
                <ul className="ServiceInfo__features">
                    {badges.map(({id, description, Icon}) => <li key={id} className="ServiceInfo__feature TopInfo__badge">
                        <span className="ServiceInfo__icon"><Icon width={24} height={24} aria-hidden="true"/></span>
                        <Footnote Component="p" className="ServiceInfo__description ServiceInfo__featureText">{description}</Footnote>
                    </li>)}
                </ul>
            </section>
        </div>
    </ModalPage>;
}

export default withPlatform(InfoTopModal);
