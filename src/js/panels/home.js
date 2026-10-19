import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../store/router/actions';
import {isPremium, shouldShowBanners} from '../store/premium';

//import bridge from '@vkontakte/vk-bridge';

import moment from 'moment';
import 'moment/locale/ru';

import {
    Panel, 
    Group, 
    PanelHeaderButton, 
    PanelHeader,
    Banner,
    Header,
    SimpleCell,
    Button,
    Card,
    Div,
    Avatar,
    Tappable
} from "@vkontakte/vkui";

import { 
    Icon28RecentOutline,
    Icon28InfoOutline,
    Icon28EducationOutline,
    Icon28CalendarOutline,
    Icon28BookOutline,
    Icon28UserStarBadgeOutline,
    Icon28NotebookCheckOutline,
    Icon28BillheadOutline,
    Icon28LogoVkOutline,
    Icon28LinkCircleOutline,
    Icon24Chevron
 } from '@vkontakte/icons';

 /*
    {this.state.BannerWelcomeStatus && <Banner
    mode="image"
    size="m"
    header="Добро пожаловать в приложение!"
    subheader={<span>Вы можете узнать информацию о приложении, нажав на знак вопроса в левом верхнем углу.</span>}
    background={
    <div
        style={{
            backgroundColor: '#3F8AE0',
        }}
    />
    }
    asideMode="dismiss"
    onDismiss={() => {
        this.setState({
            BannerWelcomeStatus: false
        });
        BannerWelcome = false;
    }}
/>}

/*
{this.state.BannerWelcomeStatus && <Banner
    mode="image"
    size="m"
    header="Поддержите нас"
    subheader={<span>Наше приложение полностью бесплатное, чтобы поддержать нас, вы можете нажать на кнопку ниже и посмотреть рекламу. Спасибо!</span>}
    background={
        <div
            style={{
            backgroundColor: 'rgb(124, 169, 230)',
            }}
        />
        }
    asideMode="dismiss"
    onDismiss={() => {
        this.setState({
            BannerWelcomeStatus: false
        });
        BannerWelcome = false;
    }}
    actions={<Button mode="overlay_primary" onClick={() => {
        bridge.send("VKWebAppShowNativeAds", {ad_format:"preloader"});
        }} size="m">Показать рекламу</Button>}
/>}
 */

 var BannerWelcome = true; //баннер рекламы
 var BannerUpdate = true; //баннер обновления

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
            BannerWelcomeStatus: BannerWelcome,
            BannerUpdateStatus: BannerUpdate,
        };
    }

    render() {
        const {id, setPage, showBanners, activePremium} = this.props;
        const currentDate = moment().format("DD MMMM, dddd");

        return (
            <Panel id={id}>
                <PanelHeader
                before={
                    <PanelHeaderButton aria-label="Справка о приложении" onClick={() => this.props.openModal('MODAL_PAGE_FAQ')}>
                        <Icon28InfoOutline />
                    </PanelHeaderButton>
                }
                >
                    Главная
                </PanelHeader>

                {showBanners && (!activePremium || this.state.BannerUpdateStatus) && <Banner
                    mode="image"
                    size="m"
                    header="Мы обновились!"
                    subheader={<span>Узнай что нового было добавлено в свежую версию приложения</span>}
                    background={
                        <div
                            style={{
                                backgroundColor: '#215db0',
                                backgroundImage: 'linear-gradient(120deg, #215db0, #244c83)',
                            }}
                        />
                        }
                    asideMode={activePremium ? 'dismiss' : undefined}
                    dismissLabel="Скрыть баннер об обновлениях"
                    onDismiss={() => {
                        if (!this.props.activePremium) return;
                        this.setState({
                            BannerUpdateStatus: false
                        });
                        BannerUpdate = false;
                    }}
                    actions={<Button mode="overlay_primary" onClick={() => {
                        this.props.openModal('MODAL_PAGE_UPDATE_INFO')}} size="m">Подробнее</Button>
                    }
                />}

                <Div>
                    <Card size="l" mode="shadow">
                        <div className="CustomBanner HomeNotice">
                        <div className="CustomBanner__aside">
                            <Avatar size={28} style={{ backgroundImage: 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)' }}>
                                <span style={{ color: '#fff' }}>!</span>
                            </Avatar>
                            </div>
                            <div className="CustomBanner__main">
                                <div className="CustomBanner__header">Перед использованием</div>
                                <div className="CustomBanner__subheader">В приложении есть архивные материалы. Расписание занятий сохранено за 2021/2022 учебный год — актуальные даты и время уточняйте в колледже.</div>
                            </div>
                        </div>
                    </Card>
                </Div>

                {showBanners && <Div>
                    <Card size="l" mode="shadow">
                        <Tappable Component="button" type="button" className="FeedbackBanner" onClick={() => setPage('home', 'feedback')}>
                            <div className="FeedbackBanner__main">
                                <div className="FeedbackBanner__header">Вам слово</div>
                                <div className="FeedbackBanner__subheader">Поделитесь впечатлениями о приложении или идеями, как его можно улучшить</div>
                            </div>
                            <div className="FeedbackBanner__aside">{<Icon24Chevron/>}</div>
                        </Tappable>
                    </Card>
                </Div>}

                <Div>
                    <Card size="l" mode="shadow">
                        <div className="CustomBanner">
                        <div className="CustomBanner__aside">{<Icon28RecentOutline style={{ color: 'var(--icon_tertiary)'}}/>}</div>
                            <div className="CustomBanner__main">
                                <div className="CustomBanner__header">
                                    <React.Fragment>
                                        Сегодня — {currentDate}.
                                    </React.Fragment></div>
                                <div className="CustomBanner__subheader">Не теряйся во времени!</div>
                            </div>
                        </div>
                    </Card>
                </Div>

                <Group header={<Header mode="secondary">Обучение</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            before={<Icon28EducationOutline/>} 
                            subtitle="Архив за 2021/2022 учебный год"
                            multiline
                            onClick={() => setPage('home', 'timetable')}
                            >
                                Расписание занятий
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28CalendarOutline/>} 
                            subtitle="Сохранённая версия"
                            onClick={() => setPage('home', 'schedule')}
                            >
                                Расписание звонков
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28NotebookCheckOutline/>} 
                            onClick={() => setPage('home', 'practice')}
                            >
                                Расписание практики
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28BillheadOutline/>} 
                            onClick={() => setPage('home', 'exam')}
                            >
                                Расписание экзаменов
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28UserStarBadgeOutline/>} 
                            onClick={() => setPage('home', 'top_student')}
                            >
                                <span className="title-with-badge">
                                    <span className="title-with-badge__text">Топ студентов</span>
                                    <span className="block__new">NEW</span>
                                </span>
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28BookOutline/>} 
                            onClick={() => setPage('home', 'directory')}
                            >
                                Справочник
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode="secondary">Сообщества</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            expandable = 'true'
                            subtitle='teamskt'
                            before={<Icon28LogoVkOutline/>} 
                            href='https://vk.com/teamskt' target="_blank"
                            >
                                Сообщество приложения
                            </SimpleCell>

                            <SimpleCell
                            expandable = 'true'
                            subtitle='skt_club'
                            before={<Icon28LogoVkOutline/>} 
                            href='https://vk.com/skt_club' target="_blank"
                            >
                                <span className="title-with-badge">
                                    <span className="title-with-badge__text">Качественный контент</span>
                                    <span className="block__hot">HOT</span>
                                </span>
                            </SimpleCell>

                            <SimpleCell
                            expandable = 'true'
                            subtitle='collegetelsml'
                            before={<Icon28LogoVkOutline/>} 
                            href='https://vk.com/collegetelsml' target="_blank"
                            >
                                Сообщество СКТ
                            </SimpleCell>

                            <SimpleCell
                            expandable = 'true'
                            subtitle='sktnews'
                            before={<Icon28LogoVkOutline/>} 
                            href='https://vk.com/sktnews' target="_blank"
                            >
                                SKT News
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode="secondary">Ссылки</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            {!showBanners && <SimpleCell expandable onClick={() => setPage('home', 'feedback')}>
                                Обратная связь
                            </SimpleCell>}
                            <SimpleCell
                            expandable = 'true'
                            subtitle='collegetel.ru'
                            before={<Icon28LinkCircleOutline/>}
                            href='http://www.collegetel.ru/' target="_blank"
                            >
                                Перейти на сайт колледжа
                            </SimpleCell>

                            <SimpleCell 
                            expandable = 'true'
                            subtitle='lk.sut.ru'
                            before={<Icon28LinkCircleOutline/>}
                            href='https://lk.sut.ru/cabinet/' target="_blank"
                            >
                                Перейти в личный кабинет
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>
                
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage,
    goBack,
    openPopout,
    closePopout,
    openModal
};

export default connect(state => ({showBanners: shouldShowBanners(state), activePremium: isPremium(state)}), mapDispatchToProps)(Home);
