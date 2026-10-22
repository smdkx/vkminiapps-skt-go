import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";
import {loadAchievements, earnAchievement} from '../../store/achievements';

import {subscribeToCommunity, getCommunityErrorMessage} from '../../services/community';

import {Button} from '@vkontakte/vkui';
import Snackbar from '../../components/AppSnackbar';
import AchievementDetails from '../../components/AchievementDetails';



class Achievement extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            status: 'unknown',
        };
        this.mounted = false;
        this.pending = false;
        this.subscribe = this.subscribe.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.props.loadAchievements().catch(() => {
            if (this.mounted) this.setState({snackbar: <Snackbar onClosed={() => {
                if (this.mounted) this.setState({snackbar: null});
            }}>Не удалось загрузить достижение.</Snackbar>});
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    async subscribe() {
        if (this.pending || this.props.earnedAt) return;
        this.pending = true;
        this.setState({status: 'loading', snackbar: null});

        let status, message, failed = false;
        try {
            const result = await subscribeToCommunity();
            status = result === 'pending' ? 'unknown' : 'subscribed';
            if (status === 'subscribed') await this.props.earnAchievement('subscriber');
            message = status === 'subscribed' ? 'Достижение получено!' : 'Подписка пока не подтверждена.';
        } catch (error) {
            failed = true;
            if (status === 'subscribed') {
                message = 'Не удалось сохранить достижение.';
            } else {
                status = 'error';
                message = getCommunityErrorMessage(error);
            }
        } finally {
            this.pending = false;
        }
        if (!this.mounted) return;
        this.setState({status, snackbar: <Snackbar status={failed ? 'error' : status === 'subscribed' ? 'success' : 'info'} layout="vertical"
            onClosed={() => { if (this.mounted) this.setState({snackbar: null}); }}
        >{message}</Snackbar>});
    }

    render() {
        const {id, goBack, earnedAt, achievementsLoaded} = this.props;
        const {status} = this.state;

        return <AchievementDetails id={id} goBack={goBack} title="Подписчик" description="Подписаться на сообщество приложения."
            earnedAt={earnedAt} loaded={achievementsLoaded} snackbar={this.state.snackbar}
            actions={<Button onClick={this.subscribe} loading={status === 'loading'} disabled={status === 'loading'} size="l" stretched>
                {status === 'loading' ? 'Проверяем...' : status === 'subscribed' ? 'Проверить подписку' : 'Подписаться на сообщество'}
            </Button>}/>;
    }

}

const mapDispatchToProps = {
    goBack,
    loadAchievements,
    earnAchievement
};

export default connect(({achievements}) => ({
    earnedAt: achievements.earned.subscriber,
    achievementsLoaded: achievements.loaded,
}), mapDispatchToProps)(Achievement);
