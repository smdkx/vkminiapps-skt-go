import {SET_FORM_DATA} from './actionTypes';

const initialState = {
    forms: []
};

export const formDataReducer = (state = initialState, action) => {
    if (action.type === 'account/CLEARED') return initialState;

    switch (action.type) {

        case SET_FORM_DATA: {
            return {
                ...state,
                forms: {
                    ...state.forms,
                    [action.payload.form]: action.payload.data
                }
            };
        }

        default: {
            return state;
        }

    }

};
