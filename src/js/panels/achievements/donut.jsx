import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";
import {loadAchievements, earnAchievement} from '../../store/achievements';

import {getDonutErrorMessage} from '../../services/donut';
import {checkPremiumSubscription} from '../../store/premium';
import {hapticNotification} from '../../services/bridge';

import {
    Image,
    Panel,
    PanelHeaderBack,
    Group,
    Placeholder,
    MiniInfoCell,
    Button,
    Box
} from '@vkontakte/vkui';
import Snackbar from '../../components/AppSnackbar';
import PanelHeader from '../../components/AppPanelHeader';

import {
    Icon20ArticleOutline,
    Icon20QuestionOutline
} from "@vkontakte/icons";

import Donut from "../../../img/achievements/donut.svg";

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
        if (status !== 'not_subscribed') hapticNotification(failed ? 'error' : 'success');
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

        return (
            <Panel id={id}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Достижение
                </PanelHeader>

                <Group>
                    <Placeholder
                    stretched
                    icon={<Image noBorder withTransparentBackground size={160} src={Donut} alt="Пончик" className={earnedAt ? '' : 'Achievements__filter'} />}
                    title="Пончик"
                >
                    <MiniInfoCell
                    before={<Icon20ArticleOutline />}
                    textWrap="full"
                    >
                        Оформить подписку VK Donut
                    </MiniInfoCell>

                    <MiniInfoCell
                    before={<Icon20QuestionOutline />}
                    textWrap="full"
                    >
                        <span role="status" aria-live="polite">
                            {earnedAt ? 'Достижение получено' : achievementsLoaded ? 'Достижение не получено' : 'Статус неизвестен'}
                        </span>
                    </MiniInfoCell>

                    {!earnedAt && <Box padding="system">
                        <Button onClick={this.checkSubscription} loading={status === 'loading'} disabled={status === 'loading'} size="m">{status === 'loading' ? 'Проверяем…' : 'Проверить подписку'}</Button>
                    </Box>}

                    {!earnedAt && status === 'not_subscribed' && <Box padding="system">
                        <Button href="https://vk.com/donut/teamskt" target="_blank" rel="noopener noreferrer" mode="secondary" size="m">Оформить подписку</Button>
                    </Box>}

                    </Placeholder>
                </Group>

                {this.state.snackbar}

            </Panel>
        );
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
