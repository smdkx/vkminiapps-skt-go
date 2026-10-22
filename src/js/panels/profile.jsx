import React from 'react';
import {connect} from 'react-redux';

import {setPage, openModal, closeModal, openPopout, closePopout} from "../store/router/actions";

import { appVersion } from '../components/data/profile.data';

import {sendBridgeRequest} from '../services/bridge';
import {addAppToFavorites, shareApplication, getAppActionErrorMessage} from '../services/appActions';
import {earnAchievement, loadAchievements} from '../store/achievements';
import {memeCatalog, loadMemeProgress} from '../store/memes';
import {loadStudentSettings} from '../store/studentSettings';
import {isPremium} from '../store/premium';
import {getDepartmentTitle} from '../components/data/education.data';
import {achievementCatalog, CREATOR_ID} from '../components/data/achievements.data';
import ProfileStoryModal from '../components/ProfileStoryModal';
import AchievementIcon from '../components/AchievementIcon';
import MemesWarning from '../components/MemesWarning';

import {
    Panel,
    PanelHeaderButton,
    PanelSpinner,
    Group,
    Header,
    SimpleCell,
    Avatar,
    Title,
    Text,
    Button,
    Link,
    Box,
    Placeholder,
    Tappable,
    Progress
} from '@vkontakte/vkui';
import Snackbar from '../components/AppSnackbar';
import PanelHeader from '../components/AppPanelHeader';

import { 
    Icon28SettingsOutline,
    Icon28EducationOutline,
    Icon28Users3Outline,
    Icon28UsersOutline,
    Icon28FavoriteOutline, 
    Icon28ShareOutline,
    Icon28ServicesOutline, 
    Icon28EmployeeOutline,
    Icon20FireCircleFillRed,
    Icon20DonutCoinCircleFillYellow,
    Icon20ChevronRight,
    Icon28DonateOutline,
    Icon28CupOutline,
    Icon28SmileOutline,
    Icon28StoryOutline
} from '@vkontakte/icons';

// Keep the loaded header while panels unmount during navigation. Replacing it
// with a smaller spinner on every Back would shift the restored scroll position.
let sessionUser = null;

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            user: sessionUser,
            loading: !sessionUser,
            error: null,
            addingToFavorites: false,
            sharing: false,
            progressLoading: true,
        };

        this.isMountedProfile = false;
        this.profilePending = false;
        this.actionPending = new Set();
        this.awaitingAchievementSave = new Set();
        this.loadProfile = this.loadProfile.bind(this);
        this.AddToFavorites = this.AddToFavorites.bind(this);
        this.shareApp = this.shareApp.bind(this);
        this.onVersionTap = this.onVersionTap.bind(this);
        this.versionTapCount = 0;
    }

    componentDidMount() {
        this.isMountedProfile = true;
        if (!this.state.user) this.loadProfile();
        this.props.loadStudentSettings().catch(() => this.showSnackbar('Не удалось загрузить настройки.'));
        this.loadProgress();
    }

    componentWillUnmount() {
        this.isMountedProfile = false;
    }

    async loadProgress() {
        const results = await Promise.allSettled([
            this.props.loadAchievements(),
            this.props.loadMemeProgress(),
        ]);
        if (!this.isMountedProfile) return;
        this.setState({progressLoading: false});
        if (results.some(result => result.status === 'rejected')) {
            this.showSnackbar('Не удалось загрузить статистику профиля.');
        }
    }

    async loadProfile() {
        if (this.profilePending) return;
        this.profilePending = true;
        this.setState({loading: true, error: null});

        try {
            const user = await sendBridgeRequest('VKWebAppGetUserInfo');
            if (!user || !user.first_name) throw new Error('Invalid user info');
            sessionUser = user;
            if (this.isMountedProfile) this.setState({user});
        } catch (error) {
            const code = error && error.code;
            let message = 'Не удалось загрузить профиль.';
            if (code === 'UNSUPPORTED_ENVIRONMENT') {
                message = 'Откройте приложение внутри ВКонтакте.';
            } else if (code === 'UNSUPPORTED_METHOD') {
                message = 'Профиль недоступен в этом клиенте.';
            } else if (code === 'BRIDGE_TIMEOUT') {
                message = 'Время ожидания истекло.';
            }
            if (this.isMountedProfile) this.setState({error: message});
        } finally {
            this.profilePending = false;
            if (this.isMountedProfile) this.setState({loading: false});
        }
    }

    showSnackbar(message, success = false) {
        if (!this.isMountedProfile) return;
        this.setState({snackbar:
            <Snackbar status={success ? 'success' : 'error'}
                layout='vertical'
                onClosed={() => {
                    if (this.isMountedProfile) this.setState({snackbar: null});
                }}
            >
                {message}
            </Snackbar>
        });
    }

    async completeAchievementAction(achievement, action, loadingState, successMessage) {
        if (this.actionPending.has(achievement)) return;
        this.actionPending.add(achievement);
        this.setState({[loadingState]: true, snackbar: null});
        let confirmed = this.awaitingAchievementSave.has(achievement);
        try {
            if (!confirmed) await action();
            confirmed = true;
            this.awaitingAchievementSave.add(achievement);
            await this.props.earnAchievement(achievement);
            this.awaitingAchievementSave.delete(achievement);
            this.showSnackbar(successMessage, true);
        } catch (error) {
            this.showSnackbar(confirmed
                ? 'Не удалось сохранить достижение.'
                : getAppActionErrorMessage(error, achievement));
        } finally {
            this.actionPending.delete(achievement);
            if (this.isMountedProfile) this.setState({[loadingState]: false});
        }
    }

    AddToFavorites() {
        return this.completeAchievementAction('star', addAppToFavorites, 'addingToFavorites',
            'Приложение в избранном. Достижение «Избранный» сохранено!');
    }

    shareApp() {
        return this.completeAchievementAction('static', shareApplication, 'sharing',
            'Вы поделились приложением. Достижение «Статистика» сохранено!');
    }

    onVersionTap() {
        this.versionTapCount += 1;
        if (this.versionTapCount < 5) return;
        this.versionTapCount = 0;
        this.props.setPage('profile', 'debug');
    }

    openMemes = () => this.props.openPopout(<MemesWarning
        onConfirm={() => this.props.setPage('profile', 'random')} onClosed={this.props.closePopout}/>);

    render() {
        const {id, setPage, studentSettings, activePremium, premiumChecking,
            achievements, memes, storyOpen, closeModal} = this.props;
        const {user, loading, error, progressLoading} = this.state;
        const settingsStatus = studentSettings.loading ? 'Загружаем…' : 'Не загружено';
        const creator = user && user.id === CREATOR_ID;
        const received = achievementCatalog.filter(item => achievements.earned[item.id])
            .sort((left, right) => achievements.earned[right.id] - achievements.earned[left.id]);
        const previewAchievements = received.length ? received.slice(0, 4) : achievementCatalog.slice(0, 4);
        const viewedMemes = memeCatalog.filter(item => memes.seen.includes(item.id)).length;
        const progressStatus = progressLoading ? 'Загружаем…' : 'Не загружено';

        return (
            <Panel id={id}>
                <PanelHeader
                before={
                    <PanelHeaderButton aria-label="Настройки профиля" onClick={() => setPage('profile', 'settings')}>
                        <Icon28SettingsOutline />
                    </PanelHeaderButton>
                }
                >
                    Профиль
                </PanelHeader>

                <div className="ProfileLayout">
                <Group mode="card" separator="hide" className="ProfileSection ProfileHero">
                    {loading ? <PanelSpinner aria-label="Загрузка профиля"/> : error ? <Placeholder
                        title="Профиль недоступен"
                        action={<Button onClick={this.loadProfile}>Повторить</Button>}
                    >
                        <span role="alert">{error}</span>
                    </Placeholder> : user && <div className="ProfileHero__content">
                        <Avatar size={96} src={user.photo_200} alt="Фото профиля">
                            {creator && <Avatar.Badge role="img" aria-label="Создатель приложения"
                                className={activePremium ? 'ProfileAvatar__creatorBadge--stacked' : undefined}>
                                <Icon20FireCircleFillRed width={24} height={24} aria-hidden="true"/>
                            </Avatar.Badge>}
                            {activePremium && <Avatar.Badge role="img" aria-label="Подписчик VK Donut"
                                background={creator ? 'stroke' : 'shadow'}>
                                <Icon20DonutCoinCircleFillYellow width={24} height={24} aria-hidden="true"/>
                            </Avatar.Badge>}
                        </Avatar>
                        <div className="ProfileHero__details">
                            <Title className="ProfileHero__name" level="2" weight="2">{user.first_name} {user.last_name}</Title>
                            <Text className="ProfileHero__status">{user.sex === 1 ? 'Студентка' : user.sex === 2 ? 'Студент' : 'Профиль ВКонтакте'}</Text>
                            <Text className="ProfileHero__college">СКТ (ф) СПбГУТ</Text>
                            <Link Component="button" type="button" className="ProfileHero__group"
                                onClick={() => setPage('profile', 'settings')}>
                                {studentSettings.loaded
                                    ? studentSettings.group ? `Группа ${studentSettings.group}` : 'Выбрать группу'
                                    : 'Настроить профиль'}
                            </Link>
                        </div>
                        <Button size="l" mode="secondary" className="ProfileHero__share" before={<Icon28StoryOutline/>}
                            disabled={!achievements.loaded || achievements.resetting}
                            onClick={() => this.props.openModal('MODAL_PAGE_PROFILE_STORY')}>Поделиться в Истории</Button>
                    </div> }
                </Group>

                <div className="ProfileStats" aria-label="Статистика профиля">
                    <Tappable Component="button" type="button" className="ProfileStat ProfileStat--achievements"
                        onClick={() => setPage('profile', 'achievements')}>
                        <span className="ProfileStat__icon"><Icon28CupOutline aria-hidden="true"/></span>
                        <span className="ProfileStat__value">{achievements.loaded ? `${received.length} / ${achievementCatalog.length}` : '-'}</span>
                        <span className="ProfileStat__label">Достижения</span>
                        <span className="ProfileStat__hint">{achievements.loaded ? 'Мой прогресс' : progressStatus}</span>
                    </Tappable>
                    <Tappable Component="button" type="button" className="ProfileStat ProfileStat--memes"
                        onClick={this.openMemes}>
                        <span className="ProfileStat__icon"><Icon28SmileOutline aria-hidden="true"/></span>
                        <span className="ProfileStat__value">{memes.loaded ? `${viewedMemes} / ${memeCatalog.length}` : '-'}</span>
                        <span className="ProfileStat__label">Мемы</span>
                        <span className="ProfileStat__hint">{memes.loaded ? 'Просмотрено' : progressStatus}</span>
                    </Tappable>
                </div>

                <Group mode="card" separator="hide" className="ProfileSection" header={<Header>
                    <Link Component="button" type="button" className="ProfileSection__link"
                        onClick={() => setPage('profile', 'achievements')}>Все достижения<Icon20ChevronRight aria-hidden="true"/></Link>
                </Header>}>
                    <Box padding="system" className="ProfileAchievements">
                        {achievements.loaded ? <>
                            <Text className="ProfileAchievements__description">{received.length === achievementCatalog.length
                                ? 'Вся коллекция собрана!'
                                : received.length ? 'Здесь собраны твои последние достижения.' : 'Первое достижение еще впереди!'}</Text>
                            <Progress value={received.length / achievementCatalog.length * 100} height={6}
                                aria-label="Прогресс достижений" aria-valuetext={`Получено ${received.length} из ${achievementCatalog.length}`}/>
                            <div className="ProfileAchievements__list">
                                {previewAchievements.map(item => <Tappable Component="button" type="button" key={item.id}
                                    className="ProfileAchievement" onClick={() => setPage('profile', item.id)}
                                    aria-label={`${item.title}: ${achievements.earned[item.id] ? 'получено' : 'не получено'}`}>
                                    <AchievementIcon achievement={item.id} earned={Boolean(achievements.earned[item.id])}/>
                                    <span>{item.title}</span>
                                </Tappable>)}
                            </div>
                        </> : <Text className="ProfileAchievements__description">{progressLoading
                            ? 'Загружаем достижения…' : 'Откройте достижения, чтобы повторить загрузку.'}</Text>}
                    </Box>
                </Group>

                <Group mode="card" separator="hide" className="ProfileSection ProfileDonut">
                    <div className="ProfileDonut__content">
                        <span className="ProfileDonut__icon"><Icon28DonateOutline width={36} height={36} aria-hidden="true"/></span>
                        <div className="ProfileDonut__details">
                            <Text className="ProfileDonut__eyebrow">VK Donut</Text>
                            <Title level="3" weight="2" className="ProfileDonut__title">{activePremium
                                ? 'Спасибо за поддержку!' : 'Поддержать SKT Go'}</Title>
                            <Text className="ProfileDonut__description">{activePremium
                                ? 'Premium активен. Можно скрыть баннеры в настройках.'
                                : 'Значок Donut в профиле, достижение «Пончик» и возможность скрывать баннеры.'}</Text>
                            <div className="ProfileDonut__actions">
                                <Button size="m" mode="secondary" className="ProfileDonut__button" loading={premiumChecking && !activePremium}
                                    disabled={premiumChecking && !activePremium}
                                    onClick={() => setPage('profile', activePremium ? 'settings' : 'donate')}>
                                    {activePremium ? 'Настройки баннеров' : 'Подробнее'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Group>

                <Group mode="card" separator="hide" className="ProfileSection" header={<Header>Учеба</Header>}>
                    <SimpleCell

                    before={<span className="ProfileRowIcon"><Icon28EducationOutline aria-hidden="true"/></span>}
                    subtitle='СКТ (ф) СПбГУТ'
                    >
                        Место учебы
                    </SimpleCell>

                    <SimpleCell
                    before={<span className="ProfileRowIcon"><Icon28Users3Outline aria-hidden="true"/></span>}
                    subtitle={studentSettings.loaded ? getDepartmentTitle(studentSettings.department) : settingsStatus}
                    chevron="auto" multiline onClick={() => setPage('profile', 'settings')}
                    >
                        Отделение
                    </SimpleCell>

                    <SimpleCell
                    before={<span className="ProfileRowIcon"><Icon28UsersOutline aria-hidden="true"/></span>}
                    subtitle={studentSettings.loaded ? studentSettings.group || 'Не выбрана' : settingsStatus}
                    chevron="auto" multiline onClick={() => setPage('profile', 'settings')}
                    >
                        Группа
                    </SimpleCell>
                </Group>

                <Group mode="card" separator="hide" className="ProfileSection" header={<Header>Дополнительно</Header>}>
                    <SimpleCell
                    before={<span className="ProfileRowIcon"><Icon28FavoriteOutline aria-hidden="true"/></span>}
                    subtitle={this.state.addingToFavorites ? 'Ожидаем подтверждение ВКонтакте…' : 'Добавляет сервис в избранные приложения'}
                    disabled={this.state.addingToFavorites}
                    onClick={this.AddToFavorites}
                    >
                        Добавить в избранное
                    </SimpleCell>

                    <SimpleCell
                    before={<span className="ProfileRowIcon"><Icon28ShareOutline aria-hidden="true"/></span>}
                    subtitle={this.state.sharing ? 'Ожидаем ответ ВКонтакте…' : 'Поделитесь с друзьями нашим приложением'}
                    disabled={this.state.sharing}
                    onClick={this.shareApp}
                    >
                        Поделиться с друзьями
                    </SimpleCell>
                </Group>

                <Group mode="card" separator="hide" className="ProfileSection" header={<Header>О приложении</Header>}>
                    <SimpleCell
                    before={<span className="ProfileRowIcon ProfileRowIcon--muted"><Icon28EmployeeOutline aria-hidden="true"/></span>}
                    subtitle='Показать всех разработчиков'
                    onClick={() => this.props.openModal('MODAL_PAGE_DEV_INFO')}
                    >
                        Разработчики
                    </SimpleCell>

                    <SimpleCell
                    before={<span className="ProfileRowIcon ProfileRowIcon--muted"><Icon28ServicesOutline aria-hidden="true"/></span>}
                    subtitle={appVersion}
                    onClick={this.onVersionTap}
                    >
                        Версия приложения
                    </SimpleCell>
                </Group>
                </div>

                <ProfileStoryModal open={storyOpen} onClose={closeModal} user={user}
                    group={studentSettings.loaded ? studentSettings.group : ''}
                    earned={achievements.earned} activePremium={activePremium}/>
                
                {this.state.snackbar}

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage,
    openModal,
    closeModal,
    openPopout,
    closePopout,
    earnAchievement,
    loadStudentSettings,
    loadAchievements,
    loadMemeProgress
};

export default connect(state => ({
    studentSettings: state.studentSettings,
    activePremium: isPremium(state),
    premiumChecking: state.premium.checking,
    achievements: state.achievements,
    memes: state.memes,
    storyOpen: state.router.activeStory === 'profile' && state.router.activeView === 'profile'
        && state.router.activeModals.profile === 'MODAL_PAGE_PROFILE_STORY',
}), mapDispatchToProps)(Profile);
