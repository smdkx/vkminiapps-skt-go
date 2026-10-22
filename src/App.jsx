import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from '@reduxjs/toolkit'
import {goBack, closeModal, setStory, setPage, handleHistoryChange} from "./js/store/router/actions";
import {getActivePanel} from './js/store/router/selectors';
import {initApp} from './js/services/VK';
import bridge from '@vkontakte/vk-bridge'

import {
    AdaptivityProvider,
    ViewWidth,
    AppRoot,
    View, 
    Root, 
    ConfigProvider,
    Button,
    Panel,
    PanelSpinner
} from "@vkontakte/vkui";
import {Icon56ErrorOutline, Icon56InfoOutline} from '@vkontakte/icons';
import {checkAppAccess, getInitialAccessStatus} from './js/services/access';
import AccessPlaceholder from './js/components/AccessPlaceholder';

//Импорт модальных окон
import FAQModal from './js/components/modals/FAQModal';
import UpdateInfoModal from './js/components/modals/UpdateInfoModal';
import InfoDevModal from './js/components/modals/InfoDevModal';
import InfoDevModalTookPart from './js/components/modals/InfoDevModalTookPart';
import InfoTopModal from './js/components/modals/InfoTopModal';

//Основные панели
import Home from './js/panels/home';
import Service from './js/panels/service';
import News from './js/panels/news';
import Profile from './js/panels/profile';

//Feedback
import Feedback from './js/panels/feedback'; 

//Топ студентов
import TopStudent from './js/panels/top_student';

//Расписание
import Timetable from './js/panels/timetable';
import Schedule from './js/panels/schedule';

//Random
import Random from './js/panels/random';

//Панели расписаний групп
import GroupSchedule from './js/panels/groups/groupSchedule';
import {timetablePanels} from './js/components/data/timetable.data';

//Экзамены и практика
import Exam from './js/panels/exam';
import Practice from './js/panels/practice';

//Панели справочника
import Directory from './js/panels/directory';
import BasicInfo from './js/panels/directory/basic_info';
import Commission from './js/panels/directory/commission';
import Resources from './js/panels/directory/resources';
import Security from './js/panels/directory/security';
import Diploma from './js/panels/directory/diploma';
import Structure from './js/panels/directory/structure';

//Специальности
import Specialties from './js/panels/directory/specialties';
import Specialty1 from './js/panels/directory/specialties/spec_1';
import Specialty2 from './js/panels/directory/specialties/spec_2';
import Specialty3 from './js/panels/directory/specialties/spec_3';
import Specialty4 from './js/panels/directory/specialties/spec_4';
import SpecialtyDetails from './js/components/SpecialtyDetails';
import {currentSpecialties} from './js/components/data/directory.data';

//Панель настроек
import Settings from './js/panels/settings';
import Debug, {DebugPremium, DebugAchievements, DebugMemes, DebugAccount} from './js/panels/debug';
import {loadBannerSettings, checkPremiumSubscription} from './js/store/premium';
import AchievementTracker from './js/components/AchievementTracker';
import AppLayout from './js/components/AppLayout';
import {loadAppPreferences} from './js/store/appPreferences';
import {loadHomeHighlights} from './js/store/homeHighlights';

//Панель VK Donut
import Donate from './js/panels/donate';

//Панели достижений
import Achievements from './js/panels/achievements';

import Newbie from './js/panels/achievements/newbie';
import Steep from './js/panels/achievements/steep';
import Static from './js/panels/achievements/static';
import Donut from './js/panels/achievements/donut';
import Subscriber from './js/panels/achievements/subscriber';
import EasterEgg from './js/panels/achievements/easterEgg';
import Star from './js/panels/achievements/star';
import ProgressAchievement from './js/panels/achievements/progress';

//Пасхалка в сервисах
import SashaFond from './js/panels/sasha_fond';

//Экран отключения приложения
import PlaceholderPage from './js/panels/placeholder_page';
import BlockedUserPage from './js/panels/blocked_user';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {accessStatus: getInitialAccessStatus()};
        this.onHistoryChange = event => {
            if (this.state.accessStatus === 'allowed') this.props.handleHistoryChange(event);
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.unsubscribeVK = this.props.dispatch(initApp());
        window.addEventListener('popstate', this.onHistoryChange);
        if (this.state.accessStatus === 'allowed') this.startApp();
        else if (this.state.accessStatus === 'checking') this.checkAccess();
    }

    startApp = () => {
        if (!this.mounted || this.appStarted) return;
        this.appStarted = true;
        this.props.dispatch(loadAppPreferences()).catch(() => {});
        this.props.dispatch(loadHomeHighlights()).catch(() => {});
        this.props.dispatch(loadBannerSettings()).catch(() => {});
        // Premium controls are unlocked automatically after successful verification.
        // Keep them locked when VK cannot confirm the subscription.
        this.props.dispatch(checkPremiumSubscription()).catch(() => {});
    };

    checkAccess = async () => {
        if (!this.mounted || this.accessPending) return;
        this.accessPending = true;
        this.setState({accessStatus: 'checking'});
        try {
            const accessStatus = await checkAppAccess();
            if (!this.mounted) return;
            this.setState({accessStatus});
            if (accessStatus === 'allowed') this.startApp();
        } catch {
            if (this.mounted) this.setState({accessStatus: 'error'});
        } finally {
            this.accessPending = false;
        }
    };

    componentWillUnmount() {
        this.mounted = false;
        this.unsubscribeVK();
        window.removeEventListener('popstate', this.onHistoryChange);
    }

    renderAccessStatus() {
        const {accessStatus} = this.state;
        let page;
        if (accessStatus === 'blocked') page = <BlockedUserPage id="access_status"/>;
        else if (accessStatus === 'unavailable') page = <AccessPlaceholder id="access_status"
            title="Приложение временно недоступно" description="Попробуйте открыть его позже." Icon={Icon56InfoOutline}/>;
        else if (accessStatus === 'error') page = <AccessPlaceholder id="access_status"
            title="Не удалось проверить доступ" description="Повторите попытку." Icon={Icon56ErrorOutline}
            action={<Button size="l" mode="secondary" onClick={this.checkAccess}>Повторить</Button>}/>;
        else page = <Panel id="access_status" centered><PanelSpinner aria-label="Проверяем доступ"/></Panel>;
        return <View activePanel="access_status">{page}</View>;
    }

    render() {
        const {goBack, setStory, setPage, closeModal, serviceUnseen, popouts, activeView, activeStory, activePanel, activeModals, swipeBackHistory, homePanel, newsPanel, servicePanel, profilePanel, colorScheme, safeAreaInsets, hostAdaptivity} = this.props;
        const showNavigation = !['random', 'practice', 'exam', 'placeholder_page', 'debug_region', 'debug_blocked'].includes(activePanel);

        const launchPlatform = new URLSearchParams(window.location.search).get('vk_platform') || '';
        const platform = launchPlatform.startsWith('desktop_') ? 'vkcom'
            : /^mobile_(iphone|ipad)/.test(launchPlatform) ? 'ios'
            : launchPlatform.startsWith('mobile_android') ? 'android' : undefined;
        const hasHostControls = bridge.isWebView()
            || (bridge.isEmbedded() && launchPlatform.startsWith('mobile_'));
        const forcedMobile = hostAdaptivity === 'force_mobile' || hostAdaptivity === 'force_mobile_compact';
        const history = swipeBackHistory;
        let popout = (popouts[activeView] === undefined) ? null : popouts[activeView];

        let activeModal = (activeModals[activeView] === undefined) ? null : activeModals[activeView];

        const homeModals = (
            <>
                <FAQModal
                    id="MODAL_PAGE_FAQ"
                    open={activeModal === "MODAL_PAGE_FAQ"}
                    onClose={() => closeModal()}
                />
                <InfoDevModal
                    id="MODAL_PAGE_DEV_INFO"
                    open={activeModal === "MODAL_PAGE_DEV_INFO"}
                    onClose={() => closeModal()}
                />
                <InfoDevModalTookPart
                    id="MODAL_PAGE_DEV_INFO_TOOK_PART"
                    open={activeModal === "MODAL_PAGE_DEV_INFO_TOOK_PART"}
                    onClose={() => closeModal()}
                />
                <InfoTopModal
                    id="MODAL_PAGE_TOP_INFO"
                    open={activeModal === "MODAL_PAGE_TOP_INFO"}
                    onClose={() => closeModal()}
                />
                <UpdateInfoModal
                    id="MODAL_PAGE_UPDATE_INFO"
                    open={activeModal === "MODAL_PAGE_UPDATE_INFO"}
                    onClose={() => closeModal()}
                />
            </>
        );

        return (
            <ConfigProvider isWebView={bridge.isWebView()} colorScheme={colorScheme}
                platform={platform}
                hasCustomPanelHeaderAfter={hasHostControls}>
                <AdaptivityProvider viewWidth={forcedMobile ? ViewWidth.MOBILE : undefined}
                    density={forcedMobile ? (hostAdaptivity === 'force_mobile_compact' ? 'compact' : 'regular') : undefined}>
                <AppRoot safeAreaInsets={safeAreaInsets}>
                    {this.state.accessStatus === 'allowed' ? <>
                    <AppLayout activeStory={activeStory} activePanel={activePanel} showNavigation={showNavigation} serviceUnseen={serviceUnseen} setStory={setStory}
                        onOpenSasha={() => setPage('service', 'sasha_fond')}>
                        <Root id="home" activeView={activeView}>
                            <View
                                id="home"
                                activePanel={homePanel}
                                history={history}
                                onSwipeBack={() => goBack()}
                            >
                                <Home id="home_tab"/>

                                <Feedback id="feedback"/>

                                <TopStudent id="top_student"/>

                                <Timetable id="timetable"/>
                                {timetablePanels.map(group => <GroupSchedule key={group.id} id={group.id} group={group}/>)}

                                <Schedule id="schedule"/>

                                <Practice id="practice"/>

                                <Directory id="directory"/>
                                <BasicInfo id="basic_info"/>
                                <Commission id="commission"/>

                                <Specialties id="spec"/>
                                <Specialty1 id="spec_1"/>
                                <Specialty2 id="spec_2"/>
                                <Specialty3 id="spec_3"/>
                                <Specialty4 id="spec_4"/>
                                {currentSpecialties.filter(specialty => !['spec_1', 'spec_4'].includes(specialty.id))
                                    .map(specialty => <SpecialtyDetails key={specialty.id} id={specialty.id} specialty={specialty}/>)}
                                
                                <Resources id="resources"/>
                                <Security id="security"/>
                                <Diploma id="diploma"/>
                                <Structure id="structure"/>

                                <Exam id="exam"/>

                                <PlaceholderPage id="placeholder_page"/>
                            </View>
                        </Root>

                        <Root id="news" activeView={activeView}>
                            <View
                                id="news"
                                activePanel={newsPanel}
                                history={history}
                                onSwipeBack={() => goBack()}
                            >
                                <News id="news_tab"/>
                            </View>
                        </Root>

                        <Root id="service" activeView={activeView}>
                            <View
                                id="service"
                                activePanel={servicePanel}
                                history={history}
                                onSwipeBack={() => goBack()}
                            >
                                <Service id="service_tab"/>

                                <Random id="random"/>

                                <SashaFond id="sasha_fond"/>
                            </View>
                        </Root>

                        <Root id="profile" activeView={activeView}>
                            <View
                                id="profile"
                                activePanel={profilePanel}
                                history={history}
                                onSwipeBack={() => goBack()}
                            >
                                <Profile id='profile_tab'/>
                                <Random id="random" backLabel="Вернуться в профиль"/>

                                <Settings id="settings"/>
                                <Debug id="debug"/>
                                <DebugPremium id="debug_premium"/>
                                <DebugAchievements id="debug_achievements"/>
                                <DebugMemes id="debug_memes"/>
                                <DebugAccount id="debug_account"/>
                                <PlaceholderPage id="debug_region" onBack={goBack}/>
                                <BlockedUserPage id="debug_blocked" onBack={goBack}/>

                                <Donate id="donate"/>

                                <Achievements id="achievements"/>

                                <Newbie id="newbie"/>
                                <Steep id="steep"/>
                                <Static id="static"/>
                                <Donut id="donut"/>
                                <Subscriber id="subscriber"/>
                                <EasterEgg id="easteregg"/>
                                <Star id="star"/>
                                <ProgressAchievement id="mygroup"/>
                                <ProgressAchievement id="memologist"/>
                                <ProgressAchievement id="collector"/>

                            </View>
                        </Root>
                    </AppLayout>
                    {homeModals}
                    {popout}
                    <AchievementTracker/>
                    </> : this.renderAccessStatus()}
                </AppRoot>
                </AdaptivityProvider>
            </ConfigProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        serviceUnseen: state.homeHighlights.loaded && !state.homeHighlights.seen.includes('services'),
        activeStory: state.router.activeStory,
        activePanel: state.router.activePanel,
        homePanel: getActivePanel(state.router, 'home'),
        newsPanel: getActivePanel(state.router, 'news'),
        servicePanel: getActivePanel(state.router, 'service'),
        profilePanel: getActivePanel(state.router, 'profile'),
        swipeBackHistory: state.router.swipeBackHistory,
        activeModals: state.router.activeModals,
        popouts: state.router.popouts,

        colorScheme: state.appPreferences.theme === 'auto' ? state.vkui.colorScheme : state.appPreferences.theme,
        safeAreaInsets: state.vkui.safeAreaInsets,
        hostAdaptivity: state.vkui.hostAdaptivity
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({setStory, setPage, goBack, closeModal, handleHistoryChange}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
