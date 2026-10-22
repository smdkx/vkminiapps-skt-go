import React from 'react';
import {connect} from 'react-redux';
import {Button} from '@vkontakte/vkui';
import Snackbar from './AppSnackbar';
import AchievementDetails from './AchievementDetails';
import {goBack} from '../store/router/actions';
import {loadAchievements, earnAchievement} from '../store/achievements';
import {getAppActionErrorMessage} from '../services/appActions';

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
        const {id, goBack, title, description, achievement, buttonText, earnedAt, achievementsLoaded} = this.props;
        const {loading, confirmed} = this.state;
        return <AchievementDetails id={id} goBack={goBack} title={title} description={description} achievement={achievement}
            earnedAt={earnedAt} loaded={achievementsLoaded} snackbar={this.state.snackbar}
            actions={<Button size="l" stretched loading={loading} disabled={loading} onClick={this.complete}>
                {loading ? 'Ожидаем подтверждение…' : confirmed ? 'Сохранить достижение' : buttonText}
            </Button>}/>;
    }
}

export default connect(({achievements}, props) => ({
    earnedAt: achievements.earned[props.achievement],
    achievementsLoaded: achievements.loaded,
}), {goBack, loadAchievements, earnAchievement})(ActionAchievement);
