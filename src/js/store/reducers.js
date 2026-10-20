import {combineReducers} from "@reduxjs/toolkit";
import {routerReducer} from './router/reducers';
import {vkuiReducer} from './vk/reducers';
import {formDataReducer} from "./formData/reducers";
import {achievementsReducer} from './achievements';
import {memesReducer} from './memes';
import {studentSettingsReducer} from './studentSettings';
import {premiumReducer} from './premium';
import {accountReducer} from './account';

export default combineReducers({
    vkui: vkuiReducer,
    router: routerReducer,
    formData: formDataReducer,
    achievements: achievementsReducer,
    memes: memesReducer,
    studentSettings: studentSettingsReducer,
    premium: premiumReducer,
    account: accountReducer
});
