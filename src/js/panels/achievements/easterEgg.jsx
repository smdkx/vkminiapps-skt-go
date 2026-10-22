import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";
import {loadAchievements} from '../../store/achievements';

import Snackbar from '../../components/AppSnackbar';
import AchievementDetails from '../../components/AchievementDetails';



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

        return <AchievementDetails id={id} goBack={goBack} title="Пасхалка"
            description="Найти пасхалку в приложении."
            earnedAt={earnedAt} loaded={achievementsLoaded} snackbar={this.state.snackbar}/>;
    }

}

const mapDispatchToProps = {
    goBack,
    loadAchievements
};

export default connect(({achievements}) => ({
    earnedAt: achievements.earned.easteregg,
    achievementsLoaded: achievements.loaded,
}), mapDispatchToProps)(Achievement);
