import React from 'react';
import {connect} from 'react-redux';
import {openModal, setPage} from '../store/router/actions';
import {shouldShowBanners} from '../store/premium';
import {loadHomeHighlights, markHomeHighlightSeen} from '../store/homeHighlights';
import Snackbar from '../components/AppSnackbar';
import moment from 'moment';
import 'moment/dist/locale/ru';
import {
    Panel, Group, PanelHeaderButton, Header, SimpleCell,
    Title, Text, Footnote, Tappable, Avatar, Badge,
} from '@vkontakte/vkui';
import NoticeBanner from '../components/NoticeBanner';
import UpdateBanner from '../components/UpdateBanner';
import PanelHeader from '../components/AppPanelHeader';
import {
    Icon20ArrowUpRightOutSquareOutline,
    Icon28MessageOutline,
    Icon28InfoOutline,
    Icon28EducationOutline,
    Icon28CalendarOutline,
    Icon28BookOutline,
    Icon28UserStarBadgeOutline,
    Icon28NotebookCheckOutline,
    Icon28BillheadOutline,
    Icon28LogoVkOutline,
    Icon28SmileOutline,
    Icon28NewsfeedOutline,
    Icon28GlobeOutline,
    Icon28UserCircleOutline,
} from '@vkontakte/icons';

const schedules = [
    {panel: 'timetable', title: 'Занятия', label: 'Расписание занятий', description: 'По учебным группам', Icon: Icon28EducationOutline},
    {panel: 'schedule', title: 'Звонки', label: 'Расписание звонков', description: 'Сохраненная версия', Icon: Icon28CalendarOutline},
    {panel: 'practice', title: 'Практика', label: 'Расписание практики', description: 'Пока нет расписания', Icon: Icon28NotebookCheckOutline},
    {panel: 'exam', title: 'Экзамены', label: 'Расписание экзаменов', description: 'Пока нет расписания', Icon: Icon28BillheadOutline},
];

const communities = [
    {name: 'teamskt', title: 'Сообщество приложения', description: 'SKT Go', color: 'blue', Icon: Icon28LogoVkOutline},
    {name: 'skt_club', title: 'Качественный контент', description: 'Публикации и общение', color: 'violet', Icon: Icon28SmileOutline, highlighted: true},
    {name: 'collegetelsml', title: 'Сообщество СКТ', description: 'Жизнь колледжа', color: 'green', Icon: Icon28EducationOutline},
    {name: 'sktnews', title: 'SKT News', description: 'Новости и события', color: 'l-blue', Icon: Icon28NewsfeedOutline},
];

function MarkedTitle({title, marked}) {
    const lastSpace = title.lastIndexOf(' ');
    return <span className="HomeMarkedTitle">{title.slice(0, lastSpace + 1)}<span className="HomeMarkedTitle__ending">
        {title.slice(lastSpace + 1)}{marked && <Badge mode="prominent" aria-hidden="true"/>}
    </span></span>;
}

class Home extends React.Component {
    state = {snackbar: null};
    mounted = false;

    componentDidMount() {
        this.mounted = true;
        this.loadHighlights();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    showStorageError = (message, retry) => {
        if (this.mounted) this.setState({snackbar: <Snackbar onClosed={() => this.setState({snackbar: null})}
            action="Повторить" onActionClick={retry}>{message}</Snackbar>});
    };

    loadHighlights = () => {
        this.props.loadHomeHighlights().catch(() => {
            this.showStorageError('Не удалось загрузить отметки просмотра.', this.loadHighlights);
        });
    };

    markCommunitySeen = () => {
        this.props.markHomeHighlightSeen('quality_content').catch(() => {
            this.showStorageError('Не удалось сохранить просмотр.', this.markCommunitySeen);
        });
    };

    render() {
        const {id, setPage, openModal, showBanners, highlights} = this.props;
        const today = moment().locale('ru');

        return (
            <Panel id={id} mode="card">
                <PanelHeader before={<PanelHeaderButton aria-label="Справка о приложении"
                    onClick={() => openModal('MODAL_PAGE_FAQ')}><Icon28InfoOutline/></PanelHeaderButton>}>
                    Главная
                </PanelHeader>

                <div className="HomeLayout">
                    <Group mode="card" separator="hide" className="HomeSection HomeHero">
                        <div className="HomeHero__content">
                            <span className="HomeHero__icon"><Icon28EducationOutline width={32} height={32} aria-hidden="true"/></span>
                            <div className="HomeHero__details">
                                <Title Component="h2" level="2" weight="2" className="HomeHero__title">Все для учебы</Title>
                                <Text className="HomeHero__description">Расписания, справочник и полезные ссылки.</Text>
                            </div>
                        </div>
                        <time className="HomeToday" dateTime={today.format('YYYY-MM-DD')}>
                            <span className="HomeToday__icon"><Icon28CalendarOutline width={24} height={24} aria-hidden="true"/></span>
                            <span className="HomeToday__content">
                                <Text Component="span" weight="2" className="HomeToday__date">{today.format('D MMMM')}</Text>
                                <Footnote Component="span" className="HomeToday__label">Сегодня, {today.format('dddd')}</Footnote>
                            </span>
                        </time>
                    </Group>

                    <section className="HomeSchedules" aria-labelledby={`${id}-schedules`}>
                        <Group mode="card" separator="hide" className="HomeSchedules__intro"
                            header={<Header id={`${id}-schedules`}>Расписания</Header>}>
                            <NoticeBanner appearance="warning" className="HomeArchive" title="Архивные материалы"
                                subtitle="Занятия за 2021/2022 учебный год. Актуальное расписание уточняйте в колледже."/>
                        </Group>
                        <div className="HomeShortcuts">
                            {schedules.map(({panel, title, label, description, Icon}) => <Tappable key={panel}
                                Component="button" type="button" className={`HomeShortcut HomeShortcut--${panel}`} style={{borderRadius: 20}}
                                aria-label={label}
                                onClick={() => setPage('home', panel)}>
                                <span className="HomeShortcut__icon"><Icon aria-hidden="true"/></span>
                                <span className="HomeShortcut__title">{title}</span>
                                <span className="HomeShortcut__description">{description}</span>
                            </Tappable>)}
                        </div>
                    </section>

                    <Group mode="card" separator="hide" className="HomeSection" header={<Header>Еще для учебы</Header>}>
                        <SimpleCell multiline chevron="auto" before={<span className="HomeRowIcon HomeRowIcon--top"><Icon28UserStarBadgeOutline aria-hidden="true"/></span>}
                            subtitle="Знакомьтесь с участниками топа" onClick={() => setPage('home', 'top_student')}>
                            <MarkedTitle title="Топ студентов" marked={highlights.loaded && !highlights.seen.includes('top_students')}/>
                        </SimpleCell>
                        <SimpleCell multiline chevron="auto" before={<span className="HomeRowIcon"><Icon28BookOutline aria-hidden="true"/></span>}
                            subtitle="О колледже, специальностях и документах" onClick={() => setPage('home', 'directory')}>Справочник</SimpleCell>
                    </Group>

                    <UpdateBanner/>

                    {showBanners && <Group mode="card" separator="hide" className="HomeSection HomeFeedback">
                        <SimpleCell multiline chevron="auto" before={<span className="HomeRowIcon"><Icon28MessageOutline aria-hidden="true"/></span>}
                            subtitle="Поделитесь идеей или впечатлениями о приложении" onClick={() => setPage('home', 'feedback')}>Вам слово</SimpleCell>
                    </Group>}

                    <Group mode="card" separator="hide" className="HomeSection" header={<Header>Сообщества</Header>}>
                        <div className="HomeCommunities">
                            {communities.map(({name, title, description, color, Icon, highlighted}) => <SimpleCell key={name} multiline
                                subtitle={description} before={<Avatar size={44} noBorder gradientColor={color} aria-hidden="true"
                                    fallbackIcon={<Icon width={24} height={24}/>}/>}
                                after={<Icon20ArrowUpRightOutSquareOutline className="HomeExternalLink__arrow" aria-hidden="true"/>}
                                href={`https://vk.com/${name}`} target="_blank" rel="noopener noreferrer"
                                onClick={highlighted ? this.markCommunitySeen : undefined}
                                onAuxClick={highlighted ? event => { if (event.button === 1) this.markCommunitySeen(); } : undefined}>
                                {highlighted ? <MarkedTitle title={title} marked={highlights.loaded && !highlights.seen.includes('quality_content')}/> : title}
                            </SimpleCell>)}
                        </div>
                    </Group>

                    <Group mode="card" separator="hide" className="HomeSection" header={<Header>Полезные ссылки</Header>}>
                        {!showBanners && <SimpleCell multiline chevron="auto" before={<Avatar size={44} noBorder gradientColor="blue" aria-hidden="true"
                            fallbackIcon={<Icon28MessageOutline width={24} height={24}/>}/>}
                            onClick={() => setPage('home', 'feedback')}>Обратная связь</SimpleCell>}
                        <SimpleCell multiline subtitle="Информация о колледже"
                            before={<Avatar size={44} noBorder gradientColor="l-blue" aria-hidden="true" fallbackIcon={<Icon28GlobeOutline width={24} height={24}/>}/>}
                            after={<Icon20ArrowUpRightOutSquareOutline className="HomeExternalLink__arrow" aria-hidden="true"/>}
                            href="http://www.collegetel.ru/" target="_blank" rel="noopener noreferrer">Сайт колледжа</SimpleCell>
                        <SimpleCell multiline subtitle="Вход в личный кабинет"
                            before={<Avatar size={44} noBorder gradientColor="blue" aria-hidden="true" fallbackIcon={<Icon28UserCircleOutline width={24} height={24}/>}/>}
                            after={<Icon20ArrowUpRightOutSquareOutline className="HomeExternalLink__arrow" aria-hidden="true"/>}
                            href="https://lk.sut.ru/cabinet/" target="_blank" rel="noopener noreferrer">Личный кабинет</SimpleCell>
                    </Group>
                </div>
                {this.state.snackbar}
            </Panel>
        );
    }
}

export default connect(state => ({showBanners: shouldShowBanners(state), highlights: state.homeHighlights}),
    {setPage, openModal, loadHomeHighlights, markHomeHighlightSeen})(Home);
