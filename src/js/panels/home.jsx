import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../store/router/actions';
import {shouldShowBanners} from '../store/premium';

import moment from 'moment';
import 'moment/dist/locale/ru';

import {
    Panel,
    Group,
    PanelHeaderButton,
    Banner,
    Header,
    SimpleCell,
    Box,
    Footnote
} from '@vkontakte/vkui';
import NoticeBanner from '../components/NoticeBanner';
import UpdateBanner from '../components/UpdateBanner';
import PanelHeader from '../components/AppPanelHeader';

import {
    Icon20RecentOutline,
    Icon28MessageOutline,
    Icon28InfoOutline,
    Icon28EducationOutline,
    Icon28CalendarOutline,
    Icon28BookOutline,
    Icon28UserStarBadgeOutline,
    Icon28NotebookCheckOutline,
    Icon28BillheadOutline,
    Icon28LogoVkOutline,
    Icon28LinkCircleOutline
 } from '@vkontakte/icons';

class Home extends React.Component {

    render() {
        const {id, setPage, showBanners} = this.props;
        const currentDate = moment().locale('ru').format("DD MMMM, dddd");

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

                <UpdateBanner/>

                <Box padding="system" className="HomeHighlights">
                    <NoticeBanner appearance="warning"
                        title="Перед использованием"
                        subtitle="В приложении есть архивные материалы. Расписание занятий сохранено за 2021/2022 учебный год — актуальные даты и время уточняйте в колледже."
                    />

                    {showBanners && <Banner mode="tint" Component="button" type="button" className="HomeFeedback"
                        before={<Icon28MessageOutline className="HomeFeedback__icon"/>}
                        title="Вам слово"
                        subtitle="Поделитесь впечатлениями о приложении или идеями, как его можно улучшить"
                        after="chevron" onClick={() => setPage('home', 'feedback')}
                    />}

                    <div className="HomeToday">
                        <Icon20RecentOutline/>
                        <div>
                            <Footnote weight="2">Сегодня — {currentDate}.</Footnote>
                            <Footnote>Не теряйся во времени!</Footnote>
                        </div>
                    </div>
                </Box>

                <Group header={<Header size="s">Обучение</Header>}>
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
                </Group>

                <Group header={<Header size="s">Сообщества</Header>}>
                    <SimpleCell
                    chevron="auto"
                    subtitle='teamskt'
                    before={<Icon28LogoVkOutline/>}
                    href='https://vk.com/teamskt' target="_blank"
                    >
                        Сообщество приложения
                    </SimpleCell>

                    <SimpleCell
                    chevron="auto"
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
                    chevron="auto"
                    subtitle='collegetelsml'
                    before={<Icon28LogoVkOutline/>}
                    href='https://vk.com/collegetelsml' target="_blank"
                    >
                        Сообщество СКТ
                    </SimpleCell>

                    <SimpleCell
                    chevron="auto"
                    subtitle='sktnews'
                    before={<Icon28LogoVkOutline/>}
                    href='https://vk.com/sktnews' target="_blank"
                    >
                        SKT News
                    </SimpleCell>
                </Group>

                <Group header={<Header size="s">Ссылки</Header>}>
                    {!showBanners && <SimpleCell chevron="auto" onClick={() => setPage('home', 'feedback')}>
                        Обратная связь
                    </SimpleCell>}
                    <SimpleCell
                    chevron="auto"
                    subtitle='collegetel.ru'
                    before={<Icon28LinkCircleOutline/>}
                    href='http://www.collegetel.ru/' target="_blank"
                    >
                        Перейти на сайт колледжа
                    </SimpleCell>

                    <SimpleCell
                    chevron="auto"
                    subtitle='lk.sut.ru'
                    before={<Icon28LinkCircleOutline/>}
                    href='https://lk.sut.ru/cabinet/' target="_blank"
                    >
                        Перейти в личный кабинет
                    </SimpleCell>
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

export default connect(state => ({showBanners: shouldShowBanners(state)}), mapDispatchToProps)(Home);
