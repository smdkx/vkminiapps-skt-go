import React from 'react';
import {achievementCatalog} from './data/achievements.data';

export default function AchievementIcon({achievement, earned, large = false}) {
    const {Icon} = achievementCatalog.find(item => item.id === achievement);
    return <span aria-hidden="true" className={`AchievementIcon${earned ? ' AchievementIcon--earned' : ''}${large ? ' AchievementIcon--large' : ''}`}>
        <Icon width={large ? 56 : 28} height={large ? 56 : 28}/>
    </span>;
}
