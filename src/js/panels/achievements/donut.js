import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";
import {loadAchievements, earnAchievement} from '../../store/achievements';

import {getDonutErrorMessage} from '../../services/donut';
import {checkPremiumSubscription} from '../../store/premium';
import {hapticNotification} from '../../services/bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Placeholder,
    MiniInfoCell,
    Avatar,
    Snackbar,
    Button,
    Div
} from "@vkontakte/vkui";

import {
    Icon16ErrorCircleOutline,
    Icon16CheckCircleOutline,
    Icon16InfoCircle,
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
            if (this.mounted) this.setState({snackbar: <Snackbar onClose={() => {
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
        const ResultIcon = failed ? Icon16ErrorCircleOutline : status === 'subscribed' ? Icon16CheckCircleOutline : Icon16InfoCircle;
        this.setState({
            status,
            snackbar: <Snackbar
                layout="vertical"
                onClose={() => { if (this.mounted) this.setState({snackbar: null}); }}
                before={<ResultIcon fill={failed ? 'var(--destructive)' : status === 'subscribed' ? 'var(--dynamic_green)' : 'var(--icon_secondary)'}/>}
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
                    icon={<Avatar size={160} mode='image' src={Donut} alt="Пончик" className={earnedAt ? '' : 'Achievements__filter'} />}
                    header="Пончик"
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

                    {!earnedAt && <Div>
                        <Button onClick={this.checkSubscription} loading={status === 'loading'} disabled={status === 'loading'} size="m">{status === 'loading' ? 'Проверяем…' : 'Проверить подписку'}</Button>
                    </Div>}

                    {!earnedAt && status === 'not_subscribed' && <Div>
                        <Button href="https://vk.com/donut/teamskt" target="_blank" rel="noopener noreferrer" mode="secondary" size="m">Оформить подписку</Button>
                    </Div>}

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
