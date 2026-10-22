import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";
import {loadAchievements, earnAchievement} from '../../store/achievements';

import {getDonutErrorMessage} from '../../services/donut';
import {checkPremiumSubscription} from '../../store/premium';

import {Button} from '@vkontakte/vkui';
import Snackbar from '../../components/AppSnackbar';
import AchievementDetails from '../../components/AchievementDetails';
import {DONUT_SUBSCRIPTION_URL} from '../../components/data/community.data';



class Achievement extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            status: 'unknown',
        };

        this.checkSubscription = this.checkSubscription.bind(this);
        this.mounted = false;
        this.checkPending = false;
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

    async checkSubscription() {
        if (this.checkPending || this.props.earnedAt) return;
        this.checkPending = true;
        this.setState({status: 'loading', snackbar: null});

        let status, message, failed = false;
        try {
            const subscribed = this.props.forcedPremium || await this.props.checkPremiumSubscription();
            status = subscribed ? 'subscribed' : 'not_subscribed';
            if (subscribed) await this.props.earnAchievement('donut');
            message = subscribed ? 'Достижение получено!' : 'Подписка VK Donut не найдена.';
        } catch (error) {
            failed = true;
            if (status === 'subscribed') {
                message = 'Не удалось сохранить достижение.';
            } else {
                status = 'error';
                message = getDonutErrorMessage(error);
            }
        } finally {
            this.checkPending = false;
        }

        if (!this.mounted) return;
        this.setState({
            status,
            snackbar: <Snackbar status={failed ? 'error' : status === 'subscribed' ? 'success' : 'info'}
                layout="vertical"
                onClosed={() => { if (this.mounted) this.setState({snackbar: null}); }}
            >{message}</Snackbar>,
        });
    }

    render() {
        const {id, goBack, earnedAt, achievementsLoaded} = this.props;
        const {status} = this.state;

        return <AchievementDetails id={id} goBack={goBack} title="Пончик" description="Оформить подписку VK Donut."
            earnedAt={earnedAt} loaded={achievementsLoaded} snackbar={this.state.snackbar}
            actions={<>
                <Button onClick={this.checkSubscription} loading={status === 'loading'} disabled={status === 'loading'} size="l" stretched>
                    {status === 'loading' ? 'Проверяем...' : 'Проверить подписку'}
                </Button>
                {status === 'not_subscribed' && <Button href={DONUT_SUBSCRIPTION_URL} target="_blank"
                    rel="noopener noreferrer" mode="secondary" size="l" stretched>Оформить подписку</Button>}
            </>}/>;
    }

}

const mapDispatchToProps = {
    goBack,
    loadAchievements,
    earnAchievement,
    checkPremiumSubscription
};

export default connect(({achievements, premium}) => ({
    earnedAt: achievements.earned.donut,
    achievementsLoaded: achievements.loaded,
    forcedPremium: premium.forced,
}), mapDispatchToProps)(Achievement);
