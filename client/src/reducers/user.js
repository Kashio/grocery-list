import types from '../actions/user';

export default function reducer(state, action) {
    switch (action.type) {
        case types.SET_USERNAME:
            return {
                ...state,
                username: action.payload.username
            };
        case types.SET_PASSWORD:
            return {
                ...state,
                password: action.payload.password
            };
        default:
            return state;
    }
};