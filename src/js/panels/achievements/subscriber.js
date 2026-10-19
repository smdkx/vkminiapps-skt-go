import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";
import {loadAchievements, earnAchievement} from '../../store/achievements';

import {subscribeToCommunity, getCommunityErrorMessage} from '../../services/community';
import {hapticNotification} from '../../services/bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Placeholder,
    MiniInfoCell,
    Avatar,
    Button,
    Div,
    Snackbar
} from "@vkontakte/vkui";

import {
    Icon20ArticleOutline,
    Icon20QuestionOutline
} from "@vkontakte/icons";

import Subscriber from "../../../img/achievements/subscriber.svg";

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
            if (this.mounted) this.setState({snackbar: <Snackbar onClose={() => {
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
        if (status === 'subscribed' && !failed) hapticNotification('success');
        this.setState({status, snackbar: <Snackbar layout="vertical"
            onClose={() => { if (this.mounted) this.setState({snackbar: null}); }}
        >{message}</Snackbar>});
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
                    icon={<Avatar size={160} mode='image' src={Subscriber} alt="Подписчик" className={earnedAt ? '' : 'Achievements__filter'} />}
                    header="Подписчик"
                >
                    <MiniInfoCell
                    before={<Icon20ArticleOutline />}
                    textWrap="full"
                    >
                        Подписаться на сообщество приложения
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
                        <Button onClick={this.subscribe} loading={status === 'loading'} disabled={status === 'loading'} size="m">
                            {status === 'loading' ? 'Проверяем…' : status === 'subscribed' ? 'Проверить подписку' : 'Подписаться на сообщество'}
                        </Button>
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
    earnAchievement
};

export default connect(({achievements}) => ({
    earnedAt: achievements.earned.subscriber,
    achievementsLoaded: achievements.loaded,
}), mapDispatchToProps)(Achievement);
