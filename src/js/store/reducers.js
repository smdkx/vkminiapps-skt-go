import {combineReducers} from "@reduxjs/toolkit";
import {routerReducer} from './router/reducers';
import {vkuiReducer} from './vk/reducers';
import {achievementsReducer} from './achievements';
import {memesReducer} from './memes';
import {studentSettingsReducer} from './studentSettings';
import {premiumReducer} from './premium';
import {accountReducer} from './account';
import {appPreferencesReducer} from './appPreferences';
import {homeHighlightsReducer} from './homeHighlights';

export default combineReducers({
    vkui: vkuiReducer,
    router: routerReducer,
    achievements: achievementsReducer,
    memes: memesReducer,
    studentSettings: studentSettingsReducer,
    premium: premiumReducer,
    account: accountReducer,
    appPreferences: appPreferencesReducer,
    homeHighlights: homeHighlightsReducer
});
