import React from 'react';
import ActionAchievement from '../../components/ActionAchievement';
import {addAppToFavorites} from '../../services/appActions';

const StarAchievement = props => <ActionAchievement {...props} achievement="star" title="Избранный"
    description="Добавить приложение в избранные"
    buttonText="Добавить в избранное" action={addAppToFavorites}/>;

export default StarAchievement;
