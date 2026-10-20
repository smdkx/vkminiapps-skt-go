import React from 'react';
import {connect} from 'react-redux';
import bridge from '@vkontakte/vk-bridge';

import Snackbar from './AppSnackbar';
import {loadAchievements, recordUsageTime, NEWBIE_TIME_REQUIRED} from '../store/achievements';

class AchievementTracker extends React.Component {
    state = {snackbar: null};
    mounted = false;
    hostVisible = true;
    activeSince = null;
    unsavedTime = 0;
    pending = false;
    generation = 0;
    retryAfter = 0;

    componentDidMount() {
        if (!bridge.isEmbedded()) return;
        this.mounted = true;
        document.addEventListener('visibilitychange', this.updateActivity);
        bridge.subscribe(this.onBridgeEvent);
        this.timer = setInterval(this.tick, 1000);
        this.props.loadAchievements().catch(() => this.showError('Не удалось загрузить достижения.'));
        this.updateActivity();
    }

    componentDidUpdate(previous) {
        if (!this.mounted) return;
        if (!previous.resetting && this.props.resetting) {
            this.generation += 1;
            this.unsavedTime = 0;
            this.activeSince = null;
            this.retryAfter = 0;
            this.setState({snackbar: null});
        }
        if (previous.loaded !== this.props.loaded || previous.resetting !== this.props.resetting ||
            previous.earnedAt !== this.props.earnedAt) this.updateActivity();
    }

    componentWillUnmount() {
        this.sample();
        this.flush();
        this.mounted = false;
        clearInterval(this.timer);
        document.removeEventListener('visibilitychange', this.updateActivity);
        bridge.unsubscribe(this.onBridgeEvent);
    }

    showError = message => {
        if (this.mounted) this.setState({snackbar: <Snackbar onClosed={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    sample = () => {
        if (this.activeSince === null) return;
        const now = performance.now();
        this.unsavedTime += Math.max(0, now - this.activeSince);
        this.activeSince = now;
    };

    updateActivity = () => {
        this.sample();
        const {loaded, earnedAt, resetting} = this.props;
        if (earnedAt) this.unsavedTime = 0;
        const active = loaded && !earnedAt && !resetting && this.hostVisible && !document.hidden;
        this.activeSince = active ? performance.now() : null;
        if (!active) this.flush();
    };

    onBridgeEvent = event => {
        if (event.detail.type === 'VKWebAppViewHide') this.hostVisible = false;
        else if (event.detail.type === 'VKWebAppViewRestore') this.hostVisible = true;
        else return;
        this.updateActivity();
        if (this.hostVisible && !this.props.loaded) {
            this.props.loadAchievements().catch(() => this.showError('Не удалось загрузить достижения.'));
        }
    };

    tick = () => {
        this.sample();
        if (this.unsavedTime >= 30000 || this.props.newbieTime + this.unsavedTime >= NEWBIE_TIME_REQUIRED) {
            this.flush();
        }
    };

    flush = async () => {
        const {loaded, earnedAt, resetting, newbieTime} = this.props;
        if (!loaded || earnedAt || resetting || this.pending || performance.now() < this.retryAfter) return;
        const elapsed = Math.floor(this.unsavedTime);
        if (elapsed === 0 && newbieTime < NEWBIE_TIME_REQUIRED) return;
        const generation = this.generation;
        this.unsavedTime -= elapsed;
        this.pending = true;
        try {
            await this.props.recordUsageTime(elapsed);
            this.retryAfter = 0;
        } catch (error) {
            if (generation === this.generation) {
                this.unsavedTime += elapsed;
                this.retryAfter = performance.now() + 30000;
                this.showError('Не удалось сохранить прогресс.');
            }
        } finally {
            this.pending = false;
        }
    };

    render() {
        return this.state.snackbar;
    }
}

export default connect(({achievements, account}) => ({
    loaded: achievements.loaded,
    earnedAt: achievements.earned.newbie,
    newbieTime: achievements.newbieTime,
    resetting: achievements.resetting || account.resetting,
}), {loadAchievements, recordUsageTime})(AchievementTracker);
