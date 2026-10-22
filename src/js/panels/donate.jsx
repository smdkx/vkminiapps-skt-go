import React from 'react';
import {connect} from 'react-redux';
import {Panel, PanelHeaderBack, Group, Title, Text, Button, Box, Header} from '@vkontakte/vkui';
import {Icon28DonutCoinCircleFillYellow, Icon28HideOutline, Icon28CupOutline, Icon28LifebuoyOutline} from '@vkontakte/icons';
import {goBack, setPage} from '../store/router/actions';
import {isPremium} from '../store/premium';
import PanelHeader from '../components/AppPanelHeader';
import {DONUT_SUBSCRIPTION_URL} from '../components/data/community.data';

const benefits = [
    {title: 'Без лишних баннеров', description: 'Скрывайте обновления, предложения и объявления в настройках.', Icon: Icon28HideOutline},
    {title: 'Значок Donut', description: 'Специальный значок рядом с аватаркой в вашем профиле.', Icon: Icon28DonutCoinCircleFillYellow},
    {title: 'Достижение «Пончик»', description: 'Подтвердите подписку и пополните свою коллекцию.', Icon: Icon28CupOutline},
    {title: 'Поддержка SKT Go', description: 'Помогаете развивать приложение и добавлять новые возможности.', Icon: Icon28LifebuoyOutline},
];

function Donate({id, goBack, setPage, activePremium, donutEarned}) {
    return <Panel id={id} mode="card">
        <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>VK Donut</PanelHeader>
        <div className="DonateLayout">
            <Group mode="card" separator="hide" className="DonateSection DonateHero">
                <div className="DonateHero__content">
                    <Icon28DonutCoinCircleFillYellow width={72} height={72} aria-hidden="true"/>
                    <div className="DonateHero__identity">
                        <Text className="DonateHero__eyebrow">{activePremium ? 'Premium активен' : 'VK Donut'}</Text>
                        <Title level="2" weight="2" className="DonateHero__title">{activePremium ? 'Спасибо за поддержку!' : 'Поддержать SKT Go'}</Title>
                        <Text className="DonateHero__description">{activePremium
                            ? 'Вы помогаете приложению развиваться. Возможности Premium уже доступны.'
                            : 'Помогайте приложению развиваться и получайте дополнительные возможности.'}</Text>
                    </div>
                </div>
                <Box padding="system" className="DonateHero__actions">
                    {activePremium ? <Button size="l" stretched onClick={() => setPage('profile', 'settings')}>Настройки Premium</Button>
                        : <Button size="l" stretched href={DONUT_SUBSCRIPTION_URL} target="_blank" rel="noopener noreferrer">Оформить подписку</Button>}
                    {!activePremium && <Text className="DonateHero__hint">Стоимость и условия указаны на странице VK Donut сообщества teamskt.</Text>}
                </Box>
            </Group>

            <Group mode="card" separator="hide" className="DonateSection" header={<Header>Что дает подписка</Header>}>
                <div className="DonateBenefits">
                    {benefits.map(({title, description, Icon}) => <div className="DonateBenefit" key={title}>
                        <span className="DonateBenefit__icon"><Icon aria-hidden="true"/></span>
                        <div>
                            <Text weight="2" className="DonateBenefit__title">{title}</Text>
                            <Text className="DonateBenefit__description">{description}</Text>
                        </div>
                    </div>)}
                </div>
            </Group>

            {!donutEarned && <Group mode="card" separator="hide" className="DonateSection" header={<Header>Достижение за поддержку</Header>}>
                <Box padding="system" className="DonateAchievement">
                    <Text>Подписка уже есть? Откройте достижение «Пончик» и подтвердите ее.</Text>
                    <Button size="l" stretched mode="secondary" onClick={() => setPage('profile', 'donut')}>Достижение «Пончик»</Button>
                </Box>
            </Group>}
        </div>
    </Panel>;
}

export default connect(state => ({activePremium: isPremium(state), donutEarned: Boolean(state.achievements.earned.donut)}), {
    goBack, setPage,
})(Donate);
