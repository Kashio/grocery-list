import types from '../actions/groceries';

export default function reducer(state, action) {
    switch (action.type) {
        case types.LOAD:
            return {
                ...state,
                items: action.payload.items
            };
        case types.ADD:
            return {
                ...state,
                items: [
                    ...state.items,
                    action.payload.grocery
                ]
            };
        case types.DELETE:
            return {
                ...state,
                items: state.items.filter(grocery => grocery._id !== action.payload.id)
            };
        case types.FILTER:
            return {
                ...state,
                filter: action.payload.filter
            };
        default:
            return state;
    }
};