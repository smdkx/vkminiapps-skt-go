import {SET_COLOR_SCHEME, SET_SAFE_AREA_INSETS, SET_HOST_ADAPTIVITY} from './actionTypes';

const initialState = {
    colorScheme: undefined,
    safeAreaInsets: undefined,
    hostAdaptivity: undefined,
};

export const vkuiReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_HOST_ADAPTIVITY:
            return {...state, hostAdaptivity: action.payload};
        case SET_SAFE_AREA_INSETS:
            return {...state, safeAreaInsets: action.payload};
        case SET_COLOR_SCHEME:
            return {...state, colorScheme: action.payload};
        default:
            return state;
    }
};
