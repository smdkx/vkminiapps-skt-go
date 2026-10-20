import {resetAchievements} from './achievements';
import {resetMemeProgress} from './memes';
import {resetStudentSettings} from './studentSettings';
import {resetPremiumSettings} from './premium';
import {setAccessToken} from './vk/actions';

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
    ]).then(results => {
        if (results.some(result => result.status === 'rejected')) throw new Error('Не удалось удалить все данные.');
        dispatch(setAccessToken(null));
        dispatch({type: ACCOUNT_CLEARED});
    }).finally(() => {
        resetRequest = null;
        dispatch({type: RESETTING, value: false});
    });
    return resetRequest;
};
