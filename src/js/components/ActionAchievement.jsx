import React from 'react';
import {connect} from 'react-redux';
import {Image, Panel, PanelHeaderBack, Group, Placeholder, MiniInfoCell, Button, Box, } from '@vkontakte/vkui';
import Snackbar from './AppSnackbar';
import PanelHeader from './AppPanelHeader';
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

    showMessage = (message, status = 'error') => {
        if (this.mounted) this.setState({snackbar: <Snackbar status={status} layout="vertical" onClosed={() => {
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
            this.showMessage('Достижение получено!', 'success');
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
                <Placeholder stretched title={title} icon={<Image noBorder withTransparentBackground size={160} src={image} alt={title} className={earnedAt ? '' : 'Achievements__filter'}/>}>
                    <MiniInfoCell before={<Icon20ArticleOutline/>} textWrap="full">{description}</MiniInfoCell>
                    <MiniInfoCell before={<Icon20QuestionOutline/>} textWrap="full">
                        <span role="status" aria-live="polite">
                            {earnedAt ? 'Достижение получено' : achievementsLoaded ? 'Достижение не получено' : 'Статус неизвестен'}
                        </span>
                    </MiniInfoCell>
                    {!earnedAt && <Box padding="system"><Button size="m" loading={loading} disabled={loading} onClick={this.complete}>
                        {loading ? 'Ожидаем подтверждение…' : confirmed ? 'Сохранить достижение' : buttonText}
                    </Button></Box>}
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
