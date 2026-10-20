import React from 'react';
import ActionAchievement from '../../components/ActionAchievement';
import {addAppToFavorites} from '../../services/appActions';
import Star from '../../../img/achievements/star.svg';

const StarAchievement = props => <ActionAchievement {...props} achievement="star" title="Избранный"
    description="Добавить приложение в избранные" image={Star}
    buttonText="Добавить в избранное" action={addAppToFavorites}/>;

export default StarAchievement;
