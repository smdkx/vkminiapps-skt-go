import React from 'react';
import {connect} from 'react-redux';
import {Alert, Button, Div, Group, Header, Panel, PanelHeader, PanelHeaderBack, Snackbar, Text, SimpleCell, Switch} from '@vkontakte/vkui';
import {Icon24Chevron, Icon28FolderOutline} from '@vkontakte/icons';
import {goBack, openPopout, closePopout, setPage} from '../store/router/actions';
import {resetAchievements, loadAchievements, earnAchievement} from '../store/achievements';
import {isPremium, setForcedPremium} from '../store/premium';
import {hapticNotification} from '../services/bridge';

const Debug = ({id, goBack, setPage}) => <Panel id={id}>
    <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Дебаг-меню</PanelHeader>
    <Group header={<Header mode="secondary">Разделы</Header>}>
        <SimpleCell before={<Icon28FolderOutline fill="var(--accent)"/>} after={<Icon24Chevron/>} multiline
            onClick={() => setPage('profile', 'debug_premium')} subtitle="Принудительное включение и достижение">
            Premium
        </SimpleCell>
        <SimpleCell before={<Icon28FolderOutline fill="var(--accent)"/>} after={<Icon24Chevron/>} multiline
            onClick={() => setPage('profile', 'debug_achievements')} subtitle="Сброс полученных достижений">
            Достижения
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

    showMessage = message => {
        if (this.mounted) this.setState({snackbar: <Snackbar onClose={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    award = async () => {
        if (this.pending || !this.props.forced || this.props.resetting || this.props.earnedAt) return;
        this.pending = true;
        this.setState({awarding: true, snackbar: null});
        try {
            await this.props.earnAchievement('donut');
            this.showMessage('Достижение «Пончик» получено!');
            if (this.mounted) hapticNotification('success');
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
            <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Premium</PanelHeader>
            <Group header={<Header mode="secondary">Служебный режим</Header>}>
                <SimpleCell Component="label" multiline disabled={awarding || resetting}
                    after={<Switch aria-label="Форс Premium" checked={forced} onChange={this.changeForced}
                        disabled={awarding || resetting}/>}
                    subtitle="До закрытия приложения. Включает Premium и выдаёт «Пончик».">
                    Форс Premium
                </SimpleCell>
                <Div><Text>Реальную подписку VK Donut этот режим не меняет. Полученное достижение останется после отключения.</Text></Div>
                <SimpleCell disabled indicator={activePremium ? 'Активен' : 'Не активен'}>Статус Premium</SimpleCell>
            </Group>
            <Group header={<Header mode="secondary">Достижение «Пончик»</Header>}>
                <SimpleCell disabled>{earnedAt ? 'Достижение получено' : 'Достижение не получено'}</SimpleCell>
                {forced && !earnedAt && <Div><Button size="l" stretched onClick={this.award}
                    loading={awarding} disabled={awarding || resetting}>Получить достижение</Button></Div>}
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
            header="Сбросить достижения?"
            text="Полученные достижения текущего аккаунта будут сброшены."
            actionsLayout="horizontal"
            actions={[
                {title: 'Отмена', mode: 'cancel', autoclose: true},
                {title: 'Сбросить', mode: 'destructive', autoclose: true, action: this.reset},
            ]}
            onClose={this.props.closePopout}
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
        hapticNotification(success ? 'success' : 'error');
        this.setState({snackbar: <Snackbar layout="vertical" onClose={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    render() {
        const {id, goBack, resetting} = this.props;
        return <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Достижения</PanelHeader>
            <Group header={<Header mode="secondary">Служебные действия</Header>}>
                <Div>
                    <Text>Сброс удалит достижения текущего аккаунта. Их можно будет получить заново.</Text>
                </Div>
                <Div>
                    <Button size="l" stretched appearance="negative" onClick={this.confirmReset}
                        loading={resetting} disabled={resetting}>
                        {resetting ? 'Сбрасываем…' : 'Сбросить достижения'}
                    </Button>
                </Div>
            </Group>
            {this.state.snackbar}
        </Panel>;
    }
}

export const DebugAchievements = connect(({achievements}) => ({resetting: achievements.resetting}), {
    goBack, openPopout, closePopout, resetAchievements,
})(Achievements);

export const DebugPremium = connect(state => ({
    forced: state.premium.forced,
    activePremium: isPremium(state),
    earnedAt: state.achievements.earned.donut,
    resetting: state.achievements.resetting,
}), {goBack, setForcedPremium, loadAchievements, earnAchievement})(Premium);

export default connect(null, {goBack, setPage})(Debug);
