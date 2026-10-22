import React from 'react';
import ActionAchievement from '../../components/ActionAchievement';
import {shareApplication} from '../../services/appActions';

const StatisticsAchievement = props => <ActionAchievement {...props} achievement="static" title="Статистика"
    description="Поделиться приложением с друзьями"
    buttonText="Поделиться приложением" action={shareApplication}/>;

export default StatisticsAchievement;
