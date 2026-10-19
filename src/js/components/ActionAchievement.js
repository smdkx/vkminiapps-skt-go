import React from 'react';
import {connect} from 'react-redux';
import {Panel, PanelHeader, PanelHeaderBack, Group, Placeholder, MiniInfoCell, Avatar, Button, Div, Snackbar} from '@vkontakte/vkui';
import {Icon20ArticleOutline, Icon20QuestionOutline} from '@vkontakte/icons';
import {goBack} from '../store/router/actions';
import {loadAchievements, earnAchievement} from '../store/achievements';
import {getAppActionErrorMessage} from '../services/appActions';
import {hapticNotification} from '../services/bridge';

class ActionAchievement extends React.Component {
    state = {snackbar: null, loading: false, confirmed: false};
    mounted = false;
    pending = false;

    componentDidMount() {
        this.mounted = true;
        this.props.loadAchievements().catch(() => this.showMessage('Не удалось загрузить достижение.'));
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    showMessage = message => {
        if (this.mounted) this.setState({snackbar: <Snackbar layout="vertical" onClose={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    complete = async () => {
        if (this.pending || this.props.earnedAt) return;
        this.pending = true;
        this.setState({loading: true, snackbar: null});
        let confirmed = this.state.confirmed;
        try {
            if (!confirmed) await this.props.action();
            confirmed = true;
            await this.props.earnAchievement(this.props.achievement);
            this.showMessage('Достижение получено!');
            if (this.mounted) hapticNotification('success');
        } catch (error) {
            this.showMessage(confirmed
                ? 'Не удалось сохранить достижение.'
                : getAppActionErrorMessage(error, this.props.achievement));
        } finally {
            this.pending = false;
            if (this.mounted) this.setState({loading: false, confirmed});
        }
    };

    render() {
        const {id, goBack, title, description, image, buttonText, earnedAt, achievementsLoaded} = this.props;
        const {loading, confirmed} = this.state;
        return <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => goBack()}/>}>Достижение</PanelHeader>
            <Group>
                <Placeholder stretched header={title} icon={<Avatar size={160} mode="image" src={image} alt={title} className={earnedAt ? '' : 'Achievements__filter'}/>}>
                    <MiniInfoCell before={<Icon20ArticleOutline/>} textWrap="full">{description}</MiniInfoCell>
                    <MiniInfoCell before={<Icon20QuestionOutline/>} textWrap="full">
                        <span role="status" aria-live="polite">
                            {earnedAt ? 'Достижение получено' : achievementsLoaded ? 'Достижение не получено' : 'Статус неизвестен'}
                        </span>
                    </MiniInfoCell>
                    {!earnedAt && <Div><Button size="m" loading={loading} disabled={loading} onClick={this.complete}>
                        {loading ? 'Ожидаем подтверждение…' : confirmed ? 'Сохранить достижение' : buttonText}
                    </Button></Div>}
                </Placeholder>
            </Group>
            {this.state.snackbar}
        </Panel>;
    }
}

export default connect(({achievements}, props) => ({
    earnedAt: achievements.earned[props.achievement],
    achievementsLoaded: achievements.loaded,
}), {goBack, loadAchievements, earnAchievement})(ActionAchievement);
