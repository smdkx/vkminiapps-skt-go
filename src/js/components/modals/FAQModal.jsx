import React from 'react';
import {ModalPage, PanelHeaderButton, withPlatform, Platform, Title, Text, Footnote} from '@vkontakte/vkui';
import {
    Icon24Dismiss, Icon24Cancel, Icon28EducationOutline,
    Icon28CalendarOutline, Icon28BookOutline, Icon28SmileOutline,
} from '@vkontakte/icons';
import ModalPageHeader from '../AppModalPageHeader';

const features = [
    {title: 'Расписания', description: 'Архив занятий за 2021/2022 учебный год и расписание звонков.', Icon: Icon28CalendarOutline},
    {title: 'Справочник', description: 'Информация о колледже, специальностях и документах.', Icon: Icon28BookOutline},
    {title: 'Другие возможности', description: 'Достижения, топ студентов и мемы.', Icon: Icon28SmileOutline},
];

function FAQModal({id, open, onClose, platform}) {
    const closeButton = <PanelHeaderButton aria-label="Закрыть окно" onClick={onClose}>
        {platform === Platform.IOS ? <Icon24Dismiss/> : <Icon24Cancel/>}
    </PanelHeaderButton>;

    return <ModalPage hideCloseButton open={open} id={id} onClose={onClose} dynamicContentHeight
        header={<ModalPageHeader before={platform !== Platform.IOS && closeButton}
            after={platform === Platform.IOS && closeButton}>О сервисе</ModalPageHeader>}>
        <div className="ServiceInfo">
            <div className="ServiceInfo__intro">
                <span className="ServiceInfo__logo"><Icon28EducationOutline width={32} height={32} aria-hidden="true"/></span>
                <div className="ServiceInfo__introText">
                    <Title Component="h2" level="2" weight="2" className="ServiceInfo__title">SKT Go</Title>
                    <Text className="ServiceInfo__description">Расписания, справочник и полезные сервисы для студентов.</Text>
                </div>
            </div>
            <ul className="ServiceInfo__features" aria-label="Возможности приложения">
                {features.map(({title, description, Icon}) => <li key={title} className="ServiceInfo__feature">
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

export default withPlatform(FAQModal);
