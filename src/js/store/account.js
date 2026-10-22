import {resetAchievements} from './achievements';
import {resetMemeProgress} from './memes';
import {resetStudentSettings} from './studentSettings';
import {resetPremiumSettings} from './premium';
import {resetAppPreferences} from './appPreferences';
import {resetHomeHighlights} from './homeHighlights';

const RESETTING = 'account/RESETTING';
export const ACCOUNT_CLEARED = 'account/CLEARED';
let resetRequest = null;

export const accountReducer = (state = {resetting: false}, action) =>
    action.type === RESETTING ? {resetting: action.value} : state;

export const resetAccountData = () => dispatch => {
    if (resetRequest) return resetRequest;
    dispatch({type: RESETTING, value: true});
    resetRequest = Promise.allSettled([
        dispatch(resetAchievements()),
        dispatch(resetMemeProgress({all: true})),
        dispatch(resetStudentSettings()),
        dispatch(resetPremiumSettings()),
        dispatch(resetAppPreferences()),
        dispatch(resetHomeHighlights()),
    ]).then(results => {
        if (results.some(result => result.status === 'rejected')) throw new Error('Не удалось удалить все данные.');
        dispatch({type: ACCOUNT_CLEARED});
    }).finally(() => {
        resetRequest = null;
        dispatch({type: RESETTING, value: false});
    });
    return resetRequest;
};
