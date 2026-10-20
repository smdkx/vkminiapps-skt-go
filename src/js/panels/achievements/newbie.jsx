import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";
import {loadAchievements} from '../../store/achievements';

import {
    Image,
    Panel,
    PanelHeaderBack,
    Group,
    Placeholder,
    MiniInfoCell,
} from '@vkontakte/vkui';
import Snackbar from '../../components/AppSnackbar';
import PanelHeader from '../../components/AppPanelHeader';

import {
    Icon20ArticleOutline,
    Icon20QuestionOutline
} from "@vkontakte/icons";

import AchievementImage from "../../../img/achievements/newbie.svg";

class Achievement extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
        };
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

    render() {
        const {id, goBack, earnedAt, achievementsLoaded} = this.props;

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
                    icon={<Image noBorder withTransparentBackground size={160} src={AchievementImage} alt="Новичок" className={earnedAt ? '' : 'Achievements__filter'} />}
                    title="Новичок"
                >
                    <MiniInfoCell
                    before={<Icon20ArticleOutline />}
                    textWrap="full"
                    >
                        Пользоваться приложением 5 минут. Время суммируется за все посещения.
                    </MiniInfoCell>

                    <MiniInfoCell
                    before={<Icon20QuestionOutline />}
                    textWrap="full"
                    >
                        <span role="status" aria-live="polite">
                            {earnedAt ? 'Достижение получено' : achievementsLoaded ? 'Достижение не получено' : 'Статус неизвестен'}
                        </span>
                    </MiniInfoCell>

                    </Placeholder>
                </Group>

                {this.state.snackbar}
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack,
    loadAchievements
};

export default connect(({achievements}) => ({
    earnedAt: achievements.earned.newbie,
    achievementsLoaded: achievements.loaded,
}), mapDispatchToProps)(Achievement);
