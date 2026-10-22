import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../store/router/actions";
import {earnAchievement} from '../store/achievements';
import {isPremium, loadBannerSettings, saveBannerSettings} from '../store/premium';
import {loadAppPreferences, saveAppPreferences, loadNotificationPermission, saveNotificationPermission} from '../store/appPreferences';

import {loadStudentSettings, saveStudentSettings} from '../store/studentSettings';
import {studentGroups, collegeDepartments, normalizeStudentGroup, isValidStudentGroup} from '../components/data/education.data';

import {
    Panel,
    PanelHeaderBack,
    Box,
    Group,
    Button,
    FormItem,
    NativeSelect,
    PanelSpinner,
    Header,
    SimpleCell,
    Switch,
    Title,
    Text,
    Spinner
} from '@vkontakte/vkui';
import Snackbar from '../components/AppSnackbar';
import NoticeBanner from '../components/NoticeBanner';
import PanelHeader from '../components/AppPanelHeader';

import {
    Icon28HideOutline,
    Icon28SettingsOutline,
    Icon28EducationOutline,
    Icon28RefreshOutline,
    Icon28Notifications,
    Icon28SmartphoneOutline,
    Icon20InfoCircleOutline
} from "@vkontakte/icons";

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            group: '',
            department: '',
            ready: false,
            loadingBanners: true,
        };

        this.earnEasterEgg = this.earnEasterEgg.bind(this);
        this.mounted = false;
        this.easterEggPending = false;
        this.settingsPending = false;
    }

    componentDidMount() {
        this.mounted = true;
        this.loadSettings();
        this.loadBannerSettings();
        this.loadPreferences();
        this.loadNotifications();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    async earnEasterEgg() {
        if (this.easterEggPending || this.props.easterEggEarnedAt) return;
        this.easterEggPending = true;
        let message, success = false;
        try {
            await this.props.earnAchievement('easteregg');
            success = true;
            message = 'Достижение «Пасхалка» получено!';
        } catch (error) {
            message = 'Не удалось сохранить достижение.';
        } finally {
            this.easterEggPending = false;
        }
        if (this.mounted) this.setState({snackbar: <Snackbar status={success ? 'success' : 'error'} layout="vertical" onClosed={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    }

    showMessage = (message, status = 'error') => {
        if (this.mounted) this.setState({snackbar: <Snackbar status={status} layout="vertical" onClosed={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    loadPreferences = async () => {
        try { await this.props.loadAppPreferences(); }
        catch { this.showMessage('Не удалось загрузить настройки приложения.'); }
    };

    loadNotifications = async () => {
        try { await this.props.loadNotificationPermission(); }
        catch { this.showMessage('Не удалось получить статус уведомлений.'); }
    };

    changePreference = async update => {
        this.setState({snackbar: null});
        try {
            await this.props.saveAppPreferences(update);
            this.showMessage(update.theme ? 'Тема сохранена.' : update.haptics ? 'Виброотклик включен.' : 'Виброотклик отключен.', 'success');
        } catch { this.showMessage('Не удалось сохранить настройку.'); }
    };

    changeNotifications = async event => {
        const enabled = event.target.checked;
        this.setState({snackbar: null});
        try {
            await this.props.saveNotificationPermission(enabled);
            this.showMessage(enabled ? 'Уведомления разрешены.' : 'Уведомления отключены.', 'success');
        } catch (error) {
            const code = error?.error_data?.error_code ?? error?.code;
            const action = enabled ? 'включить' : 'отключить';
            let message = `Не удалось ${action} уведомления.`;
            if (code === 'BRIDGE_TIMEOUT') message = 'VK не ответил. Повторите попытку.';
            else if (code === 'NOTIFICATIONS_UNTRUSTED_APP') message = 'Уведомления временно недоступны.';
            else if (code === 'UNSUPPORTED_ENVIRONMENT') message = 'Откройте приложение внутри ВКонтакте.';
            else if (code === 'UNSUPPORTED_METHOD') message = 'Уведомления недоступны в этом клиенте.';
            else if (code === 'NOTIFICATIONS_UNCONFIRMED') message = 'VK не подтвердил изменение уведомлений.';
            else if (Number.isSafeInteger(code)) message = `Не удалось ${action} уведомления (код VK: ${code}).`;
            this.showMessage(message);
        }
    };

    loadBannerSettings = async () => {
        if (this.mounted) this.setState({loadingBanners: true, snackbar: null});
        try {
            await this.props.loadBannerSettings();
        } catch (error) {
            this.showMessage('Не удалось загрузить настройку баннеров.');
        } finally {
            if (this.mounted) this.setState({loadingBanners: false});
        }
    };

    changeBanners = async event => {
        if (!this.props.activePremium) {
            this.showPremiumRequired(event);
            return;
        }
        const showBanners = event.target.checked;
        this.setState({snackbar: null});
        try {
            await this.props.saveBannerSettings(showBanners);
            this.showMessage(showBanners ? 'Баннеры включены.' : 'Баннеры скрыты.', 'success');
        } catch (error) {
            this.showMessage('Не удалось сохранить настройку.');
        }
    };

    showPremiumRequired = event => {
        if (event) event.preventDefault();
        const {checking, subscribed} = this.props.premium;
        this.showMessage(checking ? 'Проверяем Premium…' : subscribed === null
            ? 'Не удалось проверить Premium.' : 'Доступно с Premium.', !checking && subscribed === null ? 'error' : 'info');
    };

    loadSettings = async () => {
        if (this.mounted) this.setState({snackbar: null});
        try {
            const {group, department} = await this.props.loadStudentSettings();
            if (this.mounted) this.setState({group, department, ready: true});
        } catch (error) {
            this.showMessage('Не удалось загрузить настройки.');
        }
    };

    changeGroup = (event, value) => {
        this.setState({group: value || ''});
    };

    saveSettings = async () => {
        if (this.settingsPending || !this.state.ready || this.props.studentSettings.saving) return;
        const group = normalizeStudentGroup(this.state.group);
        if (!isValidStudentGroup(group) || (group && !studentGroups.includes(group))) {
            this.showMessage('Выберите группу из архива расписаний.');
            return;
        }
        this.settingsPending = true;
        if (this.mounted) this.setState({snackbar: null});
        try {
            const saved = await this.props.saveStudentSettings({group, department: this.state.department});
            if (this.mounted) this.setState({group: saved.group});
            this.showMessage('Настройки сохранены.', 'success');
        } catch (error) {
            this.showMessage('Не удалось сохранить настройки.');
        } finally {
            this.settingsPending = false;
        }
    };

    render() {
        const {id, goBack, studentSettings, premium, activePremium, preferences, accountResetting} = this.props;
        const {group, department, ready, loadingBanners} = this.state;
        const {loading, saving} = studentSettings;
        const disabled = !ready || loading || saving;
        const legacyGroup = group !== '' && !studentGroups.includes(group);
        const changed = normalizeStudentGroup(group) !== studentSettings.group || department !== studentSettings.department;
        const preferencesDisabled = !preferences.loaded || preferences.loading || preferences.saving || accountResetting;
        const notificationsBusy = preferences.notificationsLoading || preferences.notificationsSaving;

        return (
            <Panel id={id} mode="card">
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Настройки
                </PanelHeader>

                <div className="SettingsLayout">
                    <Group mode="card" separator="hide" className="SettingsSection SettingsIntro">
                        <div className="SettingsIntro__content">
                            <span className="SettingsIntro__icon"><Icon28SettingsOutline width={32} height={32} aria-hidden="true"/></span>
                            <div>
                                <Title level="2" weight="2" className="SettingsIntro__title">Настройте под себя</Title>
                                <Text className="SettingsIntro__description">Ваша группа, отделение и внешний вид приложения.</Text>
                            </div>
                        </div>
                    </Group>

                    <Group mode="card" separator="hide" className="SettingsSection"
                        header={<Header>Учеба</Header>}>
                        <SimpleCell Component="div" before={<span className="SettingsSection__icon">
                            <Icon28EducationOutline aria-hidden="true"/>
                        </span>} subtitle="Место учебы">СКТ (ф) СПбГУТ</SimpleCell>

                        {loading && <PanelSpinner aria-label="Загрузка настроек"/>}
                        <div className="SettingsFields">
                            <FormItem top="Отделение" htmlFor="settings-department">
                                <NativeSelect slotProps={{select: {"id": "settings-department", "aria-label": "Отделение"}}}
                                    value={department || null} placeholder="Не выбрано" disabled={disabled}
                                    onChange={(event, value) => this.setState({department: value || ''})}>
                                    {collegeDepartments.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
                                </NativeSelect>
                            </FormItem>

                            <FormItem top="Группа" htmlFor="settings-group">
                                <NativeSelect slotProps={{select: {"id": "settings-group", "aria-label": "Группа"}}}
                                    value={group || null} placeholder="Не выбрана" disabled={disabled} onChange={this.changeGroup}>
                                    {legacyGroup && <option value={group} disabled>{group} (сохранена ранее)</option>}
                                    {studentGroups.map(item => <option key={item} value={item}>{item}</option>)}
                                </NativeSelect>
                            </FormItem>
                        </div>

                        <Box padding="system" className="SettingsStudy__footer">
                            {legacyGroup ? <NoticeBanner appearance="warning" title="Выберите группу из архива"
                                subtitle="Для сохраненной группы нет расписания. Выберите другую группу или вариант «Не выбрана»."/>
                                : <div className="SettingsStudy__hint"><Icon20InfoCircleOutline aria-hidden="true"/>
                                    <Text>В списке только группы с расписанием за 2021/2022 учебный год.</Text>
                                </div>}
                            {!ready && !loading ? <Button onClick={this.loadSettings} size="l" stretched>
                                Повторить загрузку
                            </Button> : <Button onClick={this.saveSettings} size="l" stretched loading={saving}
                                disabled={disabled || !changed || legacyGroup}>Сохранить изменения</Button>}
                            <Text className="SettingsStudy__saveHint">{!ready
                                ? loading ? 'Дождитесь загрузки, чтобы изменить профиль.' : 'Повторите загрузку, чтобы изменить профиль.'
                                : changed ? 'Есть несохраненные изменения.' : 'Группа и отделение отображаются в профиле.'}</Text>
                        </Box>
                    </Group>

                    <Group mode="card" separator="hide" className="SettingsSection"
                        header={<Header>Внешний вид</Header>}>
                        <FormItem top="Тема оформления" htmlFor="settings-theme">
                            <NativeSelect slotProps={{select: {id: 'settings-theme', 'aria-label': 'Тема оформления'}}}
                                value={preferences.theme} disabled={preferencesDisabled}
                                onChange={(event, value) => this.changePreference({theme: value})}>
                                <option value="auto">Системная</option>
                                <option value="light">Светлая</option>
                                <option value="dark">Темная</option>
                            </NativeSelect>
                        </FormItem>
                        {preferences.saving && <Spinner size="s" aria-label="Сохранение настроек"/>}
                        {!preferences.loaded && !preferences.loading && <Box padding="system">
                            <Button size="l" stretched mode="secondary" onClick={this.loadPreferences}>Повторить загрузку настроек</Button>
                        </Box>}
                        <SimpleCell Component="div" multiline className="SettingsBanners__cell"
                            role={activePremium ? undefined : 'button'} tabIndex={activePremium ? undefined : 0}
                            onClick={activePremium ? undefined : this.showPremiumRequired}
                            disabled={activePremium && (!premium.preferencesLoaded || premium.saving)}
                            after={<Switch slotProps={{input: {"aria-label": "Отображение баннеров"}}}
                                checked={!activePremium || premium.showBanners} onChange={this.changeBanners}
                                style={!activePremium ? {pointerEvents: 'none'} : undefined}
                                disabled={!activePremium || !premium.preferencesLoaded || premium.saving}/>}
                            before={<span className="SettingsSection__icon SettingsSection__icon--banners"><Icon28HideOutline aria-hidden="true"/></span>}
                            subtitle={activePremium ? 'Обновления, предложения и объявления' : 'Настройка доступна с Premium'}>
                            Показывать баннеры
                        </SimpleCell>
                        {activePremium && !premium.preferencesLoaded && !loadingBanners && <Box padding="system">
                            <Button size="l" stretched mode="secondary" onClick={this.loadBannerSettings}>Повторить загрузку баннеров</Button>
                        </Box>}
                    </Group>

                    <Group mode="card" separator="hide" className="SettingsSection" header={<Header>Уведомления и отклик</Header>}>
                        <SimpleCell Component="div" multiline before={<span className="SettingsSection__icon">
                            <Icon28SmartphoneOutline aria-hidden="true"/>
                        </span>}
                            subtitle="Вибрация при действиях в приложении"
                            after={<Switch checked={preferences.haptics} disabled={preferencesDisabled}
                                slotProps={{input: {'aria-label': 'Виброотклик'}}}
                                onChange={event => this.changePreference({haptics: event.target.checked})}/>}>Виброотклик</SimpleCell>
                        <SimpleCell Component="div" multiline before={<span className="SettingsSection__icon">
                            <Icon28Notifications aria-hidden="true"/>
                        </span>}
                            subtitle={preferences.notificationsUnavailableReason === 'untrusted' ? 'Уведомления временно недоступны'
                                : preferences.notificationsSupported === false ? 'Доступно в поддерживаемых клиентах VK'
                                : preferences.notificationsEnabled === null ? 'Статус разрешения не получен' : 'Разрешение на уведомления от SKT Go'}
                            after={<div className="SettingsNotifications__control">
                                {notificationsBusy && <Spinner size="s" aria-label="Проверка разрешения уведомлений"/>}
                                <Switch checked={preferences.notificationsEnabled === true}
                                    disabled={notificationsBusy || !preferences.notificationsSupported || preferences.notificationsEnabled === null || accountResetting}
                                    slotProps={{input: {'aria-label': 'Уведомления приложения'}}} onChange={this.changeNotifications}/>
                            </div>}>Уведомления приложения</SimpleCell>
                        {!preferences.notificationsChecked && !notificationsBusy && <Box padding="system">
                            <Button size="l" stretched mode="secondary" onClick={this.loadNotifications}>Повторить проверку уведомлений</Button>
                        </Box>}
                    </Group>

                    <Group mode="card" separator="hide" className="SettingsSection"
                        header={<Header>Дополнительно</Header>}>
                        <SimpleCell before={<span className="SettingsSection__icon SettingsSection__icon--extra">
                            <Icon28RefreshOutline aria-hidden="true"/>
                        </span>} href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer"
                            onClick={this.earnEasterEgg}>Перезагрузить сервер</SimpleCell>
                    </Group>
                </div>

                {this.state.snackbar}

            </Panel>
        );
    }

}
const mapDispatchToProps = {
    goBack,
    earnAchievement,
    loadStudentSettings,
    saveStudentSettings,
    loadBannerSettings,
    saveBannerSettings,
    loadAppPreferences,
    saveAppPreferences,
    loadNotificationPermission,
    saveNotificationPermission
};

export default connect(state => ({
    easterEggEarnedAt: state.achievements.earned.easteregg,
    studentSettings: state.studentSettings,
    premium: state.premium,
    activePremium: isPremium(state),
    preferences: state.appPreferences,
    accountResetting: state.account.resetting,
}), mapDispatchToProps)(Settings);
