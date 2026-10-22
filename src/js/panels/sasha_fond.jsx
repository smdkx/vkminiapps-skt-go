import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Panel, PanelHeaderBack, Group, Header, Title, Text, Footnote, Button, Spinner} from '@vkontakte/vkui';
import {Icon24BowlSticksOutline, Icon28SettingsOutline, Icon28GameOutline, Icon28UserCircleOutline, Icon28MessageOutline, Icon28HeartCircleOutline} from '@vkontakte/icons';
import {goBack} from '../store/router/actions';
import PanelHeader from '../components/AppPanelHeader';
import Snackbar from '../components/AppSnackbar';
import {DONUT_SUBSCRIPTION_URL} from '../components/data/community.data';

const photoUrl = 'https://i.postimg.cc/g2kXdqW0/imgonline-com-ua-Black-White-xu-RTRVb38-Z.jpg';
const rescuePlan = [
    {title: 'Сначала каша', description: 'На голодный желудок настройки не чинятся.', Icon: Icon24BowlSticksOutline},
    {title: 'Потом настройки', description: 'Кнопки сами себя не починят. Мы проверяли.', Icon: Icon28SettingsOutline},
    {title: 'Дота подождет', description: 'Еще одна катка не считается рабочим планом.', Icon: Icon28GameOutline},
];

function SashaPhoto() {
    const [status, setStatus] = useState('loading');
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (status !== 'loading') return;
        const timer = setTimeout(() => setStatus('error'), 15000);
        return () => clearTimeout(timer);
    }, [status, attempt]);

    return <div className="SashaPhoto" aria-busy={status === 'loading'}>
        {status === 'loading' && <div className="SashaPhoto__placeholder" role="status">
            <span className="SashaPhoto__spinner"><Spinner size="l" aria-hidden="true"/></span><Footnote>Загружаем фото</Footnote>
        </div>}
        {status === 'error' ? <div className="SashaPhoto__placeholder" role="status">
            <Icon28UserCircleOutline width={48} height={48} aria-hidden="true"/>
            <Footnote>Фото Саши не загрузилось</Footnote>
            <Button mode="secondary" size="m" onClick={() => {setAttempt(attempt + 1); setStatus('loading');}}>Повторить</Button>
        </div> : <img key={attempt} src={attempt ? `${photoUrl}?retry=${attempt}` : photoUrl} alt="Саша"
            className={`SashaPhoto__image${status === 'ready' ? ' SashaPhoto__image--ready' : ''}`}
            onLoad={() => setStatus(current => current === 'loading' ? 'ready' : current)}
            onError={() => setStatus('error')}/>}
    </div>;
}

function SashaFond({id, goBack}) {
    const [showDiscovery, setShowDiscovery] = useState(true);
    return <Panel id={id} mode="card">
        <PanelHeader before={<PanelHeaderBack hideLabelOnIOS aria-label="Назад" onClick={goBack}/>}>Помощь Сашке</PanelHeader>
        <div className="SashaLayout">
            <Group mode="card" separator="hide" className="SashaSection SashaHero">
                <div className="SashaHero__content">
                    <SashaPhoto/>
                    <div className="SashaHero__story">
                        <Footnote Component="p" className="SashaHero__eyebrow">Шуточный фонд</Footnote>
                        <Title Component="h2" level="1" weight="2" className="SashaHero__title">Саше на кашу</Title>
                        <Text className="SashaHero__description">Сашка фармит в Доте, а настройки ждут своего героя. Поможем ему вспомнить про кашу, работу и жизнь вне катки.</Text>
                        <Footnote Component="p" className="SashaHero__caption">Почему фото черно-белое? Дота забрала все краски.</Footnote>
                    </div>
                </div>
            </Group>

            <Group mode="card" separator="hide" className="SashaSection" header={<Header>План спасения</Header>}>
                <ol className="SashaPlan">
                    {rescuePlan.map(({title, description, Icon}) => <li key={title}>
                        <span className="SashaPlan__icon"><Icon aria-hidden="true"/></span>
                        <div><Text Component="h3" weight="2" className="SashaPlan__title">{title}</Text>
                            <Footnote Component="p" className="SashaPlan__description">{description}</Footnote></div>
                    </li>)}
                </ol>
            </Group>

            <Group mode="card" separator="hide" className="SashaSection" header={<Header>Помощь на выбор</Header>}>
                <div className="SashaActions">
                    <div className="SashaActions__item">
                        <Button size="l" stretched before={<Icon28MessageOutline aria-hidden="true"/>}
                            href="https://vk.me/reizyk" target="_blank" rel="noopener noreferrer">Саша, иди на работу</Button>
                        <Footnote Component="p">Откроется личная переписка с Сашей. Дальше слово за вами.</Footnote>
                    </div>
                    <div className="SashaActions__item">
                        <Button size="l" stretched mode="secondary" before={<Icon28HeartCircleOutline aria-hidden="true"/>}
                            href={DONUT_SUBSCRIPTION_URL} target="_blank" rel="noopener noreferrer">Поддержать SKT Go</Button>
                        <Footnote Component="p">VK Donut сообщества teamskt. Подписка поддерживает приложение.</Footnote>
                    </div>
                </div>
            </Group>
            <Footnote Component="p" className="SashaSignature">Создано шутником. Одобрено приколистом.</Footnote>
        </div>
        {showDiscovery && <Snackbar status="success" onClosed={() => setShowDiscovery(false)}>Секретный фонд Саши найден 🥣</Snackbar>}
    </Panel>;
}

export default connect(null, {goBack})(SashaFond);
