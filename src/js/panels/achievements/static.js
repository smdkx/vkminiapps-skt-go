import React from 'react';
import ActionAchievement from '../../components/ActionAchievement';
import {shareApplication} from '../../services/appActions';
import Static from '../../../img/achievements/static.svg';

export default props => <ActionAchievement {...props} achievement="static" title="Статистика"
    description="Поделиться приложением с друзьями" image={Static}
    buttonText="Поделиться приложением" action={shareApplication}/>;
