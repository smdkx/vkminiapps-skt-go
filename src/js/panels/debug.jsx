import React from 'react';
import {connect} from 'react-redux';
import {Alert, Button, Box, Flex, Group, Header, Panel, PanelHeaderBack, SimpleCell, Switch} from '@vkontakte/vkui';
import Snackbar from '../components/AppSnackbar';
import PanelHeader from '../components/AppPanelHeader';
import {Icon28BlockOutline, Icon28CrownOutline, Icon28CupOutline, Icon28GlobeCrossOutline, Icon28PictureOutline, Icon28UserCircleOutline} from '@vkontakte/icons';
import {goBack, openPopout, closePopout, setPage} from '../store/router/actions';
import {resetAchievements, loadAchievements, earnAchievement} from '../store/achievements';
import {resetMemeProgress} from '../store/memes';
import {resetAccountData} from '../store/account';
import NoticeBanner from '../components/NoticeBanner';
import {isPremium, setForcedPremium} from '../store/premium';

const Debug = ({id, goBack, setPage}) => <Panel id={id}>
    <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>Дебаг-меню</PanelHeader>
    <Group header={<Header size="s">Проверка возможностей</Header>}>
        <SimpleCell before={<Icon28CrownOutline style={{color: 'var(--vkui--color_icon_accent)'}}/>} chevron="always" multiline
            onClick={() => setPage('profile', 'debug_premium')} subtitle="Принудительное включение и достижение">
            Premium
        </SimpleCell>
        <SimpleCell before={<Icon28GlobeCrossOutline style={{color: 'var(--vkui--color_icon_accent)'}}/>} chevron="always" multiline
            onClick={() => setPage('profile', 'debug_region')} subtitle="Предпросмотр экрана недоступности">
            Региональное ограничение
        </SimpleCell>
        <SimpleCell before={<Icon28BlockOutline style={{color: 'var(--vkui--color_icon_accent)'}}/>} chevron="always" multiline
            onClick={() => setPage('profile', 'debug_blocked')} subtitle="Предпросмотр экрана блокировки">
            Блокировка пользователя
        </SimpleCell>
    </Group>
    <Group header={<Header size="s">Сброс данных</Header>}>
        <SimpleCell before={<Icon28CupOutline style={{color: 'var(--vkui--color_icon_accent)'}}/>} chevron="always" multiline
            onClick={() => setPage('profile', 'debug_achievements')} subtitle="Сброс полученных достижений">
            Достижения
        </SimpleCell>
        <SimpleCell before={<Icon28PictureOutline style={{color: 'var(--vkui--color_icon_accent)'}}/>} chevron="always" multiline
            onClick={() => setPage('profile', 'debug_memes')} subtitle="Сброс истории просмотров">
            Мемы
        </SimpleCell>
        <SimpleCell before={<Icon28UserCircleOutline style={{color: 'var(--vkui--color_icon_accent)'}}/>} chevron="always" multiline
            onClick={() => setPage('profile', 'debug_account')} subtitle="Удаление данных и полный сброс">
            Данные аккаунта
        </SimpleCell>
    </Group>
</Panel>;

class Premium extends React.Component {
    state = {snackbar: null, awarding: false};
    mounted = false;
    pending = false;

    componentDidMount() {
        this.mounted = true;
        this.props.loadAchievements().catch(() => this.showMessage('Не удалось загрузить достижения.'));
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(previous) {
        if (!previous.forced && this.props.forced) this.award();
    }

    showMessage = (message, status = 'error') => {
        if (this.mounted) this.setState({snackbar: <Snackbar status={status} onClosed={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    award = async () => {
        if (this.pending || !this.props.forced || this.props.resetting || this.props.earnedAt) return;
        this.pending = true;
        this.setState({awarding: true, snackbar: null});
        try {
            await this.props.earnAchievement('donut');
            this.showMessage('Достижение «Пончик» получено!', 'success');
        } catch (error) {
            this.showMessage('Не удалось сохранить достижение.');
        } finally {
            this.pending = false;
            if (this.mounted) this.setState({awarding: false});
        }
    };

    changeForced = event => {
        if (this.pending || this.props.resetting) return;
        const enabled = event.target.checked;
        this.props.setForcedPremium(enabled);
    };

    render() {
        const {id, goBack, forced, activePremium, earnedAt, resetting} = this.props;
        const {awarding} = this.state;
        return <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>Premium</PanelHeader>
            <Box padding="system"><NoticeBanner title="О режиме"
                subtitle="Реальную подписку VK Donut этот режим не меняет. Полученное достижение останется после отключения."/></Box>
            <Group header={<Header size="s">Служебный режим</Header>}>
                <SimpleCell Component="div" multiline disabled={awarding || resetting}
                    after={<Switch slotProps={{input: {"aria-label": "Форс Premium"}}} checked={forced} onChange={this.changeForced}
                        disabled={awarding || resetting}/>}
                    subtitle="До закрытия приложения. Включает Premium и выдаёт «Пончик».">
                    Форс Premium
                </SimpleCell>
                <SimpleCell disabled indicator={activePremium ? 'Активен' : 'Не активен'}>Статус Premium</SimpleCell>
            </Group>
            <Group header={<Header size="s">Достижение «Пончик»</Header>}>
                <SimpleCell disabled>{earnedAt ? 'Достижение получено' : 'Достижение не получено'}</SimpleCell>
                {forced && !earnedAt && <Box padding="system"><Button size="l" stretched onClick={this.award}
                    loading={awarding} disabled={awarding || resetting}>Получить достижение</Button></Box>}
            </Group>
            {this.state.snackbar}
        </Panel>;
    }
}

class Achievements extends React.Component {
    state = {snackbar: null};
    mounted = false;
    resetPending = false;

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    confirmReset = () => {
        if (this.resetPending || this.props.resetting) return;
        this.props.openPopout(<Alert
            title="Сбросить достижения?"
            description="Полученные достижения текущего аккаунта будут сброшены."
            actionsLayout="horizontal"
            actions={[
                {title: 'Отмена', mode: 'cancel'},
                {title: 'Сбросить', mode: 'destructive', action: this.reset},
            ]}
            onClosed={this.props.closePopout}
        />);
    };

    reset = async () => {
        if (this.resetPending || this.props.resetting) return;
        this.resetPending = true;
        this.setState({snackbar: null});
        let message, success = false;
        try {
            await this.props.resetAchievements();
            success = true;
            message = 'Достижения сброшены.';
        } catch (error) {
            message = 'Не удалось сбросить все достижения.';
        } finally {
            this.resetPending = false;
        }
        if (!this.mounted) return;
        this.setState({snackbar: <Snackbar status={success ? 'success' : 'error'} layout="vertical" onClosed={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    render() {
        const {id, goBack, resetting} = this.props;
        return <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>Достижения</PanelHeader>
            <Box padding="system"><NoticeBanner appearance="warning" title="Сброс достижений"
                subtitle="Сброс удалит достижения. Группа и просмотры мемов сохранятся, поэтому достижения за них можно получить снова. Для старта с нуля используйте полный сброс."/></Box>
            <Group header={<Header size="s">Служебные действия</Header>}>
                <Box padding="system">
                    <Button size="l" stretched appearance="negative" onClick={this.confirmReset}
                        loading={resetting} disabled={resetting}>
                        {resetting ? 'Сбрасываем…' : 'Сбросить достижения'}
                    </Button>
                </Box>
            </Group>
            {this.state.snackbar}
        </Panel>;
    }
}

class Memes extends React.Component {
    state = {snackbar: null};
    mounted = false;
    resetPending = false;

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    confirmReset = () => {
        if (this.resetPending || this.props.resetting) return;
        this.props.openPopout(<Alert
            title="Сбросить просмотры мемов?"
            description="Все мемы снова будут считаться непросмотренными."
            actionsLayout="horizontal"
            actions={[
                {title: 'Отмена', mode: 'cancel'},
                {title: 'Сбросить', mode: 'destructive', action: this.reset},
            ]}
            onClosed={this.props.closePopout}
        />);
    };

    reset = async () => {
        if (this.resetPending || this.props.resetting) return;
        this.resetPending = true;
        this.setState({snackbar: null});
        let message, success = false;
        try {
            await this.props.resetMemeProgress();
            success = true;
            message = 'История мемов сброшена.';
        } catch (error) {
            message = 'Не удалось сбросить все просмотры.';
        } finally {
            this.resetPending = false;
        }
        if (!this.mounted) return;
        this.setState({snackbar: <Snackbar status={success ? 'success' : 'error'} layout="vertical" onClosed={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    render() {
        const {id, goBack, resetting} = this.props;
        return <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>Мемы</PanelHeader>
            <Box padding="system"><NoticeBanner appearance="warning" title="Сброс просмотров"
                subtitle="Сброс удалит историю просмотров текущего аккаунта. Все мемы можно будет посмотреть заново."/></Box>
            <Group header={<Header size="s">Служебные действия</Header>}>
                <Box padding="system">
                    <Button size="l" stretched appearance="negative" onClick={this.confirmReset}
                        loading={resetting} disabled={resetting}>
                        {resetting ? 'Сбрасываем…' : 'Сбросить просмотры мемов'}
                    </Button>
                </Box>
            </Group>
            {this.state.snackbar}
        </Panel>;
    }
}

export const DebugAchievements = connect(({achievements, account}) => ({resetting: achievements.resetting || account.resetting}), {
    goBack, openPopout, closePopout, resetAchievements,
})(Achievements);

export const DebugMemes = connect(({memes, account}) => ({resetting: memes.resetting || account.resetting}), {
    goBack, openPopout, closePopout, resetMemeProgress,
})(Memes);

function Account({id, goBack, openPopout, closePopout, resetAccountData, resetting}) {
    const [snackbar, setSnackbar] = React.useState(null);
    const [completed, setCompleted] = React.useState(false);
    const mounted = React.useRef(false);
    const pending = React.useRef(false);
    React.useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    const reset = async () => {
        if (pending.current || resetting) return;
        pending.current = true;
        setSnackbar(null);
        let message, success = false;
        try {
            await resetAccountData();
            success = true;
            message = 'Данные приложения удалены.';
            if (mounted.current) setCompleted(true);
        } catch {
            message = 'Не удалось удалить все данные.';
        } finally {
            pending.current = false;
        }
        if (mounted.current) setSnackbar(<Snackbar status={success ? 'success' : 'error'} onClosed={() => {
            if (mounted.current) setSnackbar(null);
        }}>{message}</Snackbar>);
    };

    const confirm = () => {
        if (pending.current || resetting) return;
        openPopout(<Alert title="Удалить все данные приложения?"
            description="Достижения, прогресс, просмотры мемов и настройки текущего аккаунта будут удалены без возможности восстановления."
            actionsLayout="vertical" actions={[
                {title: 'Отмена', mode: 'cancel'},
                {title: 'Удалить данные', mode: 'destructive', action: reset},
            ]} onClosed={closePopout}/>);
    };

    return <Panel id={id}>
        <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>Данные аккаунта</PanelHeader>
        <Flex padding="system" margin="none" direction="column" gap={12}>
            <NoticeBanner appearance="warning" title="Полный сброс"
                subtitle="Удаляются достижения, прогресс, просмотры мемов и разделов, группа, отделение, тема, виброотклик и настройки баннеров. Форс Premium отключается."/>
            <NoticeBanner title="Данные ВКонтакте сохраняются"
                subtitle="Аккаунт ВКонтакте, разрешение уведомлений и реальная подписка VK Donut сохраняются."/>
        </Flex>
        <Group header={<Header size="s">Удаление данных приложения</Header>}>
            <Box padding="system">
                {completed ? <Button size="l" stretched onClick={() => window.location.reload()}>Начать заново</Button>
                    : <Button size="l" stretched appearance="negative" onClick={confirm} loading={resetting} disabled={resetting}>
                        {resetting ? 'Удаляем данные…' : 'Удалить все данные'}
                    </Button>}
            </Box>
        </Group>
        {snackbar}
    </Panel>;
}

export const DebugAccount = connect(({account}) => ({resetting: account.resetting}), {
    goBack, openPopout, closePopout, resetAccountData,
})(Account);

export const DebugPremium = connect(state => ({
    forced: state.premium.forced,
    activePremium: isPremium(state),
    earnedAt: state.achievements.earned.donut,
    resetting: state.achievements.resetting || state.account.resetting,
}), {goBack, setForcedPremium, loadAchievements, earnAchievement})(Premium);

export default connect(null, {goBack, setPage})(Debug);
