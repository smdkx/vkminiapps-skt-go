import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../store/router/actions";
import {earnAchievement} from '../store/achievements';
import {hapticNotification} from '../services/bridge';
import {isPremium, loadBannerSettings, saveBannerSettings} from '../store/premium';

import {loadStudentSettings, saveStudentSettings} from '../store/studentSettings';
import {studentGroups, collegeDepartments, normalizeStudentGroup, isValidStudentGroup} from '../components/data/education.data';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Div,
    Group,
    Button,
    FormItem,
    NativeSelect,
    PanelSpinner,
    Snackbar,
    Avatar,
    Header,
    SimpleCell,
    Switch,
    Card
} from "@vkontakte/vkui";

import {
    Icon28HideOutline
} from "@vkontakte/icons";

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            group: '',
            department: '',
            ready: false,
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
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    async earnEasterEgg() {
        if (this.easterEggPending || this.props.easterEggEarnedAt) return;
        this.easterEggPending = true;
        let message;
        try {
            await this.props.earnAchievement('easteregg');
            message = 'Достижение «Пасхалка» получено!';
            if (this.mounted) hapticNotification('success');
        } catch (error) {
            message = 'Не удалось сохранить достижение.';
        } finally {
            this.easterEggPending = false;
        }
        if (this.mounted) this.setState({snackbar: <Snackbar layout="vertical" onClose={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    }

    showMessage = message => {
        if (this.mounted) this.setState({snackbar: <Snackbar layout="vertical" onClose={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    loadBannerSettings = () => this.props.loadBannerSettings().catch(() => {
        this.showMessage('Не удалось загрузить настройку баннеров.');
    });

    changeBanners = async event => {
        if (!this.props.activePremium) {
            this.showPremiumRequired(event);
            return;
        }
        const showBanners = event.target.checked;
        try {
            await this.props.saveBannerSettings(showBanners);
            this.showMessage('Настройка сохранена.');
        } catch (error) {
            this.showMessage('Не удалось сохранить настройку.');
        }
    };

    showPremiumRequired = event => {
        if (event) event.preventDefault();
        const {checking, subscribed} = this.props.premium;
        this.showMessage(checking ? 'Проверяем Premium…' : subscribed === null
            ? 'Не удалось проверить Premium.' : 'Доступно с Premium.');
    };

    loadSettings = async () => {
        try {
            const {group, department} = await this.props.loadStudentSettings();
            if (this.mounted) this.setState({group, department, ready: true});
        } catch (error) {
            this.showMessage('Не удалось загрузить настройки.');
        }
    };

    changeGroup = event => {
        this.setState({group: event.target.value});
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
            this.showMessage('Настройки сохранены.');
            if (this.mounted) hapticNotification('success');
        } catch (error) {
            this.showMessage('Не удалось сохранить настройки.');
        } finally {
            this.settingsPending = false;
        }
    };

    render() {
        const {id, goBack, studentSettings, premium, activePremium} = this.props;
        const {group, department, ready} = this.state;
        const {loading, saving} = studentSettings;
        const disabled = !ready || loading || saving;
        const legacyGroup = group !== '' && !studentGroups.includes(group);
        const changed = normalizeStudentGroup(group) !== studentSettings.group || department !== studentSettings.department;

        return (
            <Panel id={id}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Настройки
                </PanelHeader>

                <Div>
                    <Card size="l" mode="shadow">
                        <div className="CustomBanner">
                        <div className="CustomBanner__aside">
                            <Avatar size={28} style={{ backgroundImage: 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)' }}>
                                <span style={{ color: '#fff' }}>!</span>
                            </Avatar>
                            </div>
                            <div className="CustomBanner__main">
                                <div className="CustomBanner__header">Профиль студента</div>
                                <div className="CustomBanner__subheader">Выберите группу и отделение, чтобы они отображались в профиле.</div>
                                <Button mode="tertiary" target="_blank" rel="noopener noreferrer" onClick={this.earnEasterEgg} style={{paddingbefore: 4, paddingRight: 4}} href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Перезагрузить сервер</Button>
                            </div>
                        </div>
                    </Card>
                </Div>

                <Group header={<Header mode='secondary'>Внешний вид</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell Component={activePremium ? 'label' : 'div'} multiline
                            onClick={activePremium ? undefined : this.showPremiumRequired}
                            disabled={activePremium && (!premium.preferencesLoaded || premium.saving)}
                            after={<Switch aria-label="Отображение баннеров" checked={!activePremium || premium.showBanners}
                                onChange={this.changeBanners}
                                style={!activePremium ? {pointerEvents: 'none'} : undefined}
                                disabled={!activePremium || !premium.preferencesLoaded || premium.saving}/>}
                            before={<Icon28HideOutline />}
                            subtitle={premium.saving ? 'Сохраняем…' : activePremium
                                ? 'Обновления, предложения и объявления' : 'Доступно с Premium'}
                            >
                                Отображение баннеров
                            </SimpleCell>
                            {activePremium && !premium.preferencesLoaded && <Div><Button mode="secondary" onClick={this.loadBannerSettings}>
                                Загрузить настройку баннеров
                            </Button></Div>}
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode='secondary'>Основные настройки</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <FormItem top="Место учебы">
                                <NativeSelect disabled>
                                <option>СКТ (ф) СПбГУТ</option>
                                </NativeSelect>
                            </FormItem>

                            {loading && <PanelSpinner aria-label="Загрузка настроек"/>}
                            <FormItem top={<label htmlFor="settings-department">Отделение</label>}>
                                <NativeSelect id="settings-department" aria-label="Отделение" value={department}
                                    disabled={disabled} onChange={event => this.setState({department: event.target.value})}>
                                    <option value="">Не выбрано</option>
                                    {collegeDepartments.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
                                </NativeSelect>
                            </FormItem>

                            <FormItem top={<label htmlFor="settings-group">Группа</label>}
                                bottom={legacyGroup ? 'Для сохранённой группы нет расписания. Выберите группу из архива или «Не выбрана».'
                                    : 'Группы из архива расписаний за 2021/2022 учебный год.'}>
                                <NativeSelect id="settings-group" aria-label="Группа" value={group}
                                    disabled={disabled} onChange={this.changeGroup}>
                                    <option value="">Не выбрана</option>
                                    {legacyGroup && <option value={group} disabled>{group} — сохранена ранее</option>}
                                    {studentGroups.map(item => <option key={item} value={item}>{item}</option>)}
                                </NativeSelect>
                            </FormItem>
                        </Card>
                    </Div>
                </Group>

                <Div>
                    {!ready && !loading ? <Button onClick={this.loadSettings} size="l" stretched>Повторить загрузку</Button> :
                        <Button onClick={this.saveSettings} size="l" stretched loading={saving}
                            disabled={disabled || !changed || legacyGroup}>{saving ? 'Сохраняем…' : 'Сохранить настройки'}</Button>}
                </Div>

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
    saveBannerSettings
};

export default connect(state => ({
    easterEggEarnedAt: state.achievements.earned.easteregg,
    studentSettings: state.studentSettings,
    premium: state.premium,
    activePremium: isPremium(state),
}), mapDispatchToProps)(Settings);
