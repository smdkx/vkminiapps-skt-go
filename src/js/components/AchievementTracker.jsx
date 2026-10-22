import React from 'react';
import {connect} from 'react-redux';
import bridge from '@vkontakte/vk-bridge';

import Snackbar from './AppSnackbar';
import {loadAchievements, recordUsageTime, NEWBIE_TIME_REQUIRED, awardProgressAchievements,
    getEligibleProgressAchievements} from '../store/achievements';

class AchievementTracker extends React.Component {
    state = {snackbar: null};
    mounted = false;
    hostVisible = true;
    activeSince = null;
    unsavedTime = 0;
    pending = false;
    generation = 0;
    retryAfter = 0;
    progressPending = false;

    componentDidMount() {
        if (!bridge.isEmbedded()) return;
        this.mounted = true;
        document.addEventListener('visibilitychange', this.updateActivity);
        bridge.subscribe(this.onBridgeEvent);
        this.timer = setInterval(this.tick, 1000);
        this.props.loadAchievements().catch(() => this.showError('Не удалось загрузить достижения.'));
        this.updateActivity();
        this.syncProgress();
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
        // A reset should finish without immediately restoring awards from retained progress.
        if (previous.resetting && !this.props.resetting) return;
        if (previous.progressIds !== this.props.progressIds || previous.group !== this.props.group ||
            previous.groupLoaded !== this.props.groupLoaded || previous.groupSaving !== this.props.groupSaving ||
            previous.confirmedMemes !== this.props.confirmedMemes || previous.loaded !== this.props.loaded) {
            this.syncProgress();
        }
    }

    componentWillUnmount() {
        this.sample();
        this.flush();
        this.mounted = false;
        clearInterval(this.timer);
        document.removeEventListener('visibilitychange', this.updateActivity);
        bridge.unsubscribe(this.onBridgeEvent);
    }

    showError = (message, retry) => {
        if (this.mounted) this.setState({snackbar: <Snackbar action={retry ? 'Повторить' : undefined} onActionClick={retry} onClosed={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    syncProgress = async () => {
        if (!this.mounted || !this.props.loaded || this.props.resetting || !this.props.progressIds || this.progressPending) return;
        const ids = this.props.progressIds;
        this.progressPending = true;
        try {
            await this.props.awardProgressAchievements();
        } catch {
            if (!this.props.resetting) this.showError('Не удалось сохранить достижение.', this.syncProgress);
        } finally {
            this.progressPending = false;
            if (this.mounted && ids !== this.props.progressIds) this.syncProgress();
        }
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

export default connect(state => ({
    loaded: state.achievements.loaded,
    earnedAt: state.achievements.earned.newbie,
    newbieTime: state.achievements.newbieTime,
    resetting: state.achievements.resetting || state.account.resetting,
    progressIds: getEligibleProgressAchievements(state).join(','),
    group: state.studentSettings.group,
    groupLoaded: state.studentSettings.loaded,
    groupSaving: state.studentSettings.saving,
    confirmedMemes: state.memes.confirmedSeen,
}), {loadAchievements, recordUsageTime, awardProgressAchievements})(AchievementTracker);
