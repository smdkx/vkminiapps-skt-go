import React from 'react';
import {connect} from 'react-redux';

import {setPage, openModal} from "../store/router/actions";

import { appVersion } from '../components/data/profile.data';

import {sendBridgeRequest, hapticNotification} from '../services/bridge';
import {addAppToFavorites, shareApplication, getAppActionErrorMessage} from '../services/appActions';
import {earnAchievement} from '../store/achievements';
import {loadStudentSettings} from '../store/studentSettings';
import {getDepartmentTitle} from '../components/data/education.data';

import {
    Panel,
    PanelHeader,
    PanelHeaderButton,
    PanelSpinner,
    Group,
    Header,
    SimpleCell,
    Snackbar,
    Gradient,
    Avatar,
    Title,
    Text,
    Button,
    Link,
    Card,
    Div,
    Placeholder
} from "@vkontakte/vkui";

import { 
    Icon28SettingsOutline,
    Icon28EducationOutline,
    Icon28Users3Outline,
    Icon28UsersOutline,
    Icon28FavoriteOutline, 
    Icon28ShareOutline,
    Icon28ServicesOutline, 
    Icon16CheckCircleOutline, 
    Icon16ErrorCircleOutline,
    Icon28EmployeeOutline
} from '@vkontakte/icons';

import AchievementsLogo from "../../img/achievements.png";

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            user: null,
            loading: true,
            error: null,
            addingToFavorites: false,
            sharing: false,
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
        this.loadProfile();
        this.props.loadStudentSettings().catch(() => this.showSnackbar('Не удалось загрузить настройки.'));
    }

    componentWillUnmount() {
        this.isMountedProfile = false;
    }

    async loadProfile() {
        if (this.profilePending) return;
        this.profilePending = true;
        this.setState({loading: true, error: null});

        try {
            const user = await sendBridgeRequest('VKWebAppGetUserInfo');
            if (!user || !user.first_name) throw new Error('Invalid user info');
            if (this.isMountedProfile) this.setState({user});
        } catch (error) {
            const code = error && error.code;
            let message = 'Не удалось загрузить профиль.';
            if (code === 'UNSUPPORTED_ENVIRONMENT' || code === 'UNSUPPORTED_METHOD') {
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
        hapticNotification(success ? 'success' : 'error');
        this.setState({snackbar:
            <Snackbar
                layout='vertical'
                onClose={() => {
                    if (this.isMountedProfile) this.setState({snackbar: null});
                }}
                before={<Avatar size={24} style={{background: success ? 'green' : 'red'}}>
                    {success ? <Icon16CheckCircleOutline fill="#fff" width={14} height={14} /> : <Icon16ErrorCircleOutline fill="#fff" width={14} height={14} />}
                </Avatar>}
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

    render() {
        const {id, setPage, studentSettings} = this.props;
        const {user, loading, error} = this.state;
        const settingsStatus = studentSettings.loading ? 'Загружаем…' : 'Не загружено';

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

                <Group>
                    {loading ? <PanelSpinner aria-label="Загрузка профиля"/> : error ? <Placeholder
                        header="Профиль недоступен"
                        action={<Button onClick={this.loadProfile}>Повторить</Button>}
                    >
                        <span role="alert">{error}</span>
                    </Placeholder> : user && <Gradient style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: 15,
                    }}>
                        <Avatar size={96} src={user.photo_200} alt="Фото профиля" />
                        <Title style={{ marginBottom: 8, marginTop: 15 }} level="2" weight="3">{user.first_name} {user.last_name}</Title>
                        <Text style={{ marginBottom: 20, color: 'var(--text_secondary)' }}>{user.sex === 1 ? "Студентка" : user.sex === 2 ? "Студент" : "Профиль ВКонтакте"}</Text>
                        <Button size="m" mode="secondary" onClick={() => setPage('profile', 'donate')}>Подробнее о VK Donut</Button>
                    </Gradient> }

                    <Group header={<Header mode='secondary' aside={<Link Component="button" type="button" onClick={() => setPage('profile', 'achievements')}>Подробнее</Link>}>Достижения</Header>}>
                        <Div>
                            <Card size="l" mode="shadow">
                                <img width="330" height="96" src={AchievementsLogo} alt="Достижения" className="Achievements_logo" />
                            </Card>
                        </Div>
                    </Group>
                </Group>

                <Group header={<Header mode='secondary'>Общая информация</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            disabled
                            before={<Icon28EducationOutline/>} 
                            subtitle='СКТ (ф) СПбГУТ'
                            >
                                Место учебы
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28Users3Outline/>} 
                            subtitle={studentSettings.loaded ? getDepartmentTitle(studentSettings.department) : settingsStatus}
                            expandable multiline onClick={() => setPage('profile', 'settings')}
                            >
                                Отделение
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            subtitle={studentSettings.loaded ? studentSettings.group || 'Не выбрана' : settingsStatus}
                            expandable multiline onClick={() => setPage('profile', 'settings')}
                            >
                                Группа
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode='secondary'>Дополнительно</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            before={<Icon28FavoriteOutline/>} 
                            subtitle={this.state.addingToFavorites ? 'Ожидаем подтверждение ВКонтакте…' : 'Добавляет сервис в избранные приложения'}
                            disabled={this.state.addingToFavorites}
                            onClick={this.AddToFavorites}
                            >
                                Добавить в избранное
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28ShareOutline/>} 
                            subtitle={this.state.sharing ? 'Ожидаем ответ ВКонтакте…' : 'Поделитесь с друзьями нашим приложением'}
                            disabled={this.state.sharing}
                            onClick={this.shareApp}
                            >
                                Поделиться с друзьями
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode='secondary'>Информация</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            before={<Icon28EmployeeOutline/>} 
                            subtitle='Показать всех разработчиков'
                            onClick={() => this.props.openModal('MODAL_PAGE_DEV_INFO')}
                            >
                                Разработчики
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28ServicesOutline/>} 
                            subtitle={appVersion}
                            onClick={this.onVersionTap}
                            >
                                Версия приложения
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>
                
                {this.state.snackbar}

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage,
    openModal,
    earnAchievement,
    loadStudentSettings
};

export default connect(({studentSettings}) => ({studentSettings}), mapDispatchToProps)(Profile);
