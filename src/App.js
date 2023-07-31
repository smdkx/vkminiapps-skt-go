import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {goBack, closeModal, setStory} from "./js/store/router/actions";
import {getActivePanel} from "./js/services/_functions";
import * as VK from './js/services/VK';
import bridge from '@vkontakte/vk-bridge'

import {
    Epic, 
    View, 
    Root, 
    Tabbar, 
    TabbarItem, 
    ConfigProvider, 
    ModalRoot
} from "@vkontakte/vkui";

import {
    Icon28HomeOutline,
    Icon28ArticleOutline,
    Icon28ServicesOutline,
    Icon28UserCircleOutline
} from '@vkontakte/icons';

import './css/style.css';

/*eslint react/jsx-pascal-case: "off"*/

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

//FAQ
import FAQ from './js/panels/faq'; //временно не используется

//Feedback
import Feedback from './js/panels/feedback'; 

//Топ студентов
import TOP_Student from './js/panels/top_student';

//Расписание
import Timetable from './js/panels/timetable';
import Schedule from './js/panels/schedule';

//Random
import Random from './js/panels/random';

//Панели всех групп
import Timetable_Group_1 from './js/panels/groups/group_1';
import Timetable_Group_2 from './js/panels/groups/group_2';
import Timetable_Group_3 from './js/panels/groups/group_3';
import Timetable_Group_4 from './js/panels/groups/group_4';
import Timetable_Group_5 from './js/panels/groups/group_5';
import Timetable_Group_6 from './js/panels/groups/group_6';
import Timetable_Group_7 from './js/panels/groups/group_7';
import Timetable_Group_8 from './js/panels/groups/group_8';
import Timetable_Group_9 from './js/panels/groups/group_9';
import Timetable_Group_10 from './js/panels/groups/group_10';
import Timetable_Group_11 from './js/panels/groups/group_11';

//Расписание экзаменов + панель экзаменов
import Exam from './js/panels/exam';
import Exam_Page_1 from './js/panels/exam/exam_page_1';
import Exam_Page_2 from './js/panels/exam/exam_page_2';
import Exam_Page_3 from './js/panels/exam/exam_page_3';

//Расписание практики + панель практика
import Practice from './js/panels/practice';
import Practice_Group_1 from './js/panels/practice/practice_group_1'
import Practice_Group_2 from './js/panels/practice/practice_group_2'

//Панели справочника
import Directory from './js/panels/directory';
import Basic_Info from './js/panels/directory/basic_info';
import Commission from './js/panels/directory/commission';
import Resources from './js/panels/directory/resources';
import Security from './js/panels/directory/security';
import Diploma from './js/panels/directory/diploma';
import Structure from './js/panels/directory/structure';

//Панели специальнсоти
import Specialties from './js/panels/directory/specialties';
import Specialties_1 from './js/panels/directory/specialties/spec_1';
import Specialties_2 from './js/panels/directory/specialties/spec_2';
import Specialties_3 from './js/panels/directory/specialties/spec_3';
import Specialties_4 from './js/panels/directory/specialties/spec_4';

//Заглушки
import Plug_1 from './js/panels/plugs/plug_1';

//Панель настроек
import Settings from './js/panels/settings';

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

//Саша почини настройки
import Sasha from './js/panels/sasha';
import Sasha_Fond from './js/panels/sasha_fond';

//Блокировка приложения page
import Placeholder_page from './js/panels/placeholder_page';

//Тестовые фичи


class App extends React.Component {
    constructor(props) {
        super(props);

        this.lastAndroidBackAction = 0;
    }

    componentDidMount() {
        const {goBack, dispatch} = this.props;

        dispatch(VK.initApp());

        bridge.subscribe(({ detail: { type, data } }) => {
            if (type === "VKWebAppUpdateConfig") {
                const schemeAttribute = document.createAttribute("scheme");
                schemeAttribute.value = data.scheme ? data.scheme : "client_light";
                this.setState({ theme: data.scheme });
                document.body.attributes.setNamedItem(schemeAttribute);
            }
        });

        window.onpopstate = () => {
            let timeNow = +new Date();

            if (timeNow - this.lastAndroidBackAction > 500) {
                this.lastAndroidBackAction = timeNow;

                goBack();
            } else {
                window.history.pushState(null, null);
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {activeView, activeStory, activePanel, scrollPosition} = this.props;

        if (
            prevProps.activeView !== activeView ||
            prevProps.activePanel !== activePanel ||
            prevProps.activeStory !== activeStory
        ) {
            let pageScrollPosition = scrollPosition[activeStory + "_" + activeView + "_" + activePanel] || 0;

            window.scroll(0, pageScrollPosition);
        }
    }

    render() {
        const {goBack, setStory, closeModal, popouts, activeView, activeStory, activeModals, panelsHistory, colorScheme} = this.props;

        let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];
        let popout = (popouts[activeView] === undefined) ? null : popouts[activeView];

        let activeModal = (activeModals[activeView] === undefined) ? null : activeModals[activeView];

        const homeModals = (
            <ModalRoot activeModal={activeModal}>
                <FAQModal
                    id="MODAL_PAGE_FAQ"
                    onClose={() => closeModal()}
                />
                <InfoDevModal
                    id="MODAL_PAGE_DEV_INFO"
                    onClose={() => closeModal()}
                />
                <InfoDevModalTookPart
                    id="MODAL_PAGE_DEV_INFO_TOOK_PART"
                    onClose={() => closeModal()}
                />
                <InfoTopModal
                    id="MODAL_PAGE_TOP_INFO"
                    onClose={() => closeModal()}
                />
                <UpdateInfoModal
                    id="MODAL_PAGE_UPDATE_INFO"
                    onClose={() => closeModal()}
                />
            </ModalRoot>
        );

        return (
            <ConfigProvider isWebView={true} scheme={colorScheme}>
                <Epic activeStory={activeStory} tabbar={
                    <Tabbar>
                        <TabbarItem //Первый таб
                            onClick={() => setStory('home', 'home_tab')}
                            selected={activeStory === 'home'}
                            text="Главная"
                        ><Icon28HomeOutline/></TabbarItem>

                        <TabbarItem //Второй таб
                            onClick={() => setStory('news', 'news_tab')}
                            selected={activeStory === 'news'}
                            text="Новости"
                        ><Icon28ArticleOutline/></TabbarItem>

                        <TabbarItem //Третий таб
                            onClick={() => setStory('service', 'service_tab')}
                            selected={activeStory === 'service'}
                            text="Сервисы"
                        ><Icon28ServicesOutline/></TabbarItem>

                        <TabbarItem //Четвертый таб
                            onClick={() => setStory('profile', 'profile_tab')}
                            selected={activeStory === 'profile'}
                            text="Профиль"
                        ><Icon28UserCircleOutline/></TabbarItem>
                    </Tabbar>
                }>
                    <Root id="home" activeView={activeView} popout={popout}>
                        <View
                            id="home"
                            modal={homeModals}
                            activePanel={getActivePanel("home")}
                            history={history}
                            onSwipeBack={() => goBack()}
                        >
                            <Home id="home_tab"/>

                            <FAQ id="faq"/>

                            <Feedback id="feedback"/>

                            <TOP_Student id="top_student"/>

                            <Timetable id="timetable"/>
                            <Timetable_Group_1 id="group_1"/>
                            <Timetable_Group_2 id="group_2"/>
                            <Timetable_Group_3 id="group_3"/>
                            <Timetable_Group_4 id="group_4"/>
                            <Timetable_Group_5 id="group_5"/>
                            <Timetable_Group_6 id="group_6"/>
                            <Timetable_Group_7 id="group_7"/>
                            <Timetable_Group_8 id="group_8"/>
                            <Timetable_Group_9 id="group_9"/>
                            <Timetable_Group_10 id="group_10"/>
                            <Timetable_Group_11 id="group_11"/>

                            <Schedule id="schedule"/>

                            <Practice id="practice"/>
                            <Practice_Group_1 id="practice_group_1"/>
                            <Practice_Group_2 id="practice_group_2"/>

                            <Directory id="directory"/>
                            <Basic_Info id="basic_info"/>
                            <Commission id="commission"/>

                            <Specialties id="spec"/>
                            <Specialties_1 id="spec_1"/>
                            <Specialties_2 id="spec_2"/>
                            <Specialties_3 id="spec_3"/>
                            <Specialties_4 id="spec_4"/>
                            
                            <Resources id="resources"/>
                            <Security id="security"/>
                            <Diploma id="diploma"/>
                            <Structure id="structure"/>

                            <Exam id="exam"/>
                            <Exam_Page_1 id="exam_page_1"/>
                            <Exam_Page_2 id="exam_page_2"/>
                            <Exam_Page_3 id="exam_page_3"/>

                            <Plug_1 id="plug_1"/>

                            <Placeholder_page id="placeholder_page"/>
                        </View>
                    </Root>

                    <Root id="news" activeView={activeView} popout={popout}>
                        <View
                            id="news"
                            modal={homeModals}
                            activePanel={getActivePanel("news")}
                            history={history}
                            onSwipeBack={() => goBack()}
                        >
                            <News id="news_tab"/>
                        </View>
                    </Root>

                    <Root id="service" activeView={activeView} popout={popout}>
                        <View
                            id="service"
                            modal={homeModals}
                            activePanel={getActivePanel("service")}
                            history={history}
                            onSwipeBack={() => goBack()}
                        >
                            <Service id="service_tab"/>

                            <Random id="random"/>

                            <Sasha_Fond id="sasha_fond"/>
                        </View>
                    </Root>

                    <Root id="profile" activeView={activeView} popout={popout}>
                        <View
                            id="profile"
                            modal={homeModals}
                            activePanel={getActivePanel("profile")}
                            history={history}
                            onSwipeBack={() => goBack()}
                        >
                            <Profile id='profile_tab'/>

                            <Settings id="settings"/>

                            <Donate id="donate"/>

                            <Achievements id="achievements"/>

                            <Newbie id="newbie"/>
                            <Steep id="steep"/>
                            <Static id="static"/>
                            <Donut id="donut"/>
                            <Subscriber id="subscriber"/>
                            <EasterEgg id="easteregg"/>
                            <Star id="star"/>

                            <Sasha id="sasha"/>
                        </View>
                    </Root>
                </Epic>
            </ConfigProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        activeStory: state.router.activeStory,
        panelsHistory: state.router.panelsHistory,
        activeModals: state.router.activeModals,
        popouts: state.router.popouts,
        scrollPosition: state.router.scrollPosition,

        colorScheme: state.vkui.colorScheme
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({setStory, goBack, closeModal}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);