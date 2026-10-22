import React from 'react';
import {ModalPage, PanelHeaderButton, withPlatform, Platform, Title, Text, Footnote} from '@vkontakte/vkui';
import {
    Icon24Dismiss, Icon24Cancel, Icon28PaintRollerOutline, Icon28SmileOutline,
    Icon28CalendarOutline, Icon28BookOutline, Icon28DonateOutline, Icon28UserStarBadgeOutline,
    Icon28VideoOutline, Icon28SparkleOutline, Icon28FireOutline, Icon28BugOutline,
} from '@vkontakte/icons';
import ModalPageHeader from '../AppModalPageHeader';
import {appVersion} from '../data/profile.data';

const updates = [
    {title: 'Обновленный дизайн', description: 'Такой классный и воздушный', Icon: Icon28PaintRollerOutline},
    {title: 'Еще больше мемов', description: 'Их много не бывает', Icon: Icon28SmileOutline},
    {title: 'Улучшенный вид расписания', description: 'Стал еще удобнее чем было', Icon: Icon28CalendarOutline},
    {title: 'Удобный справочник', description: 'С полезной информацией внутри', Icon: Icon28BookOutline},
    {title: 'Премиум возможности', description: 'Открывающие новые настройки', Icon: Icon28DonateOutline},
    {title: 'Топ студентов', description: 'Покоряй вершины уже сейчас', Icon: Icon28UserStarBadgeOutline},
    {title: 'Отказались от рекламы', description: 'Внутри приложения', Icon: Icon28VideoOutline},
    {title: 'Получайте достижения', description: 'И делитесь с друзьями', Icon: Icon28SparkleOutline},
    {title: 'Обновленные разделы', description: 'Загляните на вкладку «Сервисы»', Icon: Icon28FireOutline},
    {title: 'Исправление ошибок', description: 'С каждым обновлением их все меньше', Icon: Icon28BugOutline},
];

function UpdateInfoModal({id, open, onClose, platform}) {
    const closeButton = <PanelHeaderButton aria-label="Закрыть окно" onClick={onClose}>
        {platform === Platform.IOS ? <Icon24Dismiss/> : <Icon24Cancel/>}
    </PanelHeaderButton>;

    return <ModalPage hideCloseButton open={open} id={id} onClose={onClose} dynamicContentHeight
        header={<ModalPageHeader before={platform !== Platform.IOS && closeButton}
            after={platform === Platform.IOS && closeButton}>Обновление приложения</ModalPageHeader>}>
        <div className="ServiceInfo">
            <div className="ServiceInfo__intro">
                <span className="ServiceInfo__logo"><Icon28SparkleOutline width={32} height={32} aria-hidden="true"/></span>
                <div className="ServiceInfo__introText">
                    <Title Component="h2" level="2" weight="2" className="ServiceInfo__title">Мы обновились!</Title>
                    <Footnote Component="p" className="ServiceInfo__description">SKT Go {appVersion}</Footnote>
                </div>
            </div>
            <ul className="ServiceInfo__features" aria-label="Изменения в приложении">
                {updates.map(({title, description, Icon}) => <li key={title} className="ServiceInfo__feature">
                    <span className="ServiceInfo__icon"><Icon aria-hidden="true"/></span>
                    <div className="ServiceInfo__featureText">
                        <Text Component="h3" weight="2" className="ServiceInfo__featureTitle">{title}</Text>
                        <Footnote Component="p" className="ServiceInfo__description">{description}</Footnote>
                    </div>
                </li>)}
            </ul>
        </div>
    </ModalPage>;
}

export default withPlatform(UpdateInfoModal);
