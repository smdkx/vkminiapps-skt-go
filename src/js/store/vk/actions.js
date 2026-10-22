import {SET_COLOR_SCHEME, SET_SAFE_AREA_INSETS, SET_HOST_ADAPTIVITY} from './actionTypes';

export const setColorScheme = scheme => ({type: SET_COLOR_SCHEME, payload: scheme});
export const setSafeAreaInsets = insets => ({type: SET_SAFE_AREA_INSETS, payload: insets});
export const setHostAdaptivity = adaptivity => ({type: SET_HOST_ADAPTIVITY, payload: adaptivity});
