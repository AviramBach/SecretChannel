import { userService } from "../../services/user.service.js";

export const SET_USER = 'SET_USER'
export const SET_USERS = 'SET_USERS'
export const SET_WATCHED_USER = 'SET_WATCHED_USER'

export const SET_SCORE = 'SET_SCORE'
export const SET_USER_SCORE = 'SET_USER_SCORE'

const initialState = {
    loggedinUser: userService.getLoggedinUser(),
    users: [],
    watchedUser: null
}

export function userReducer(state = initialState, action = {}) {
    switch (action.type) {

       

        // User
        case SET_USER:
            return { ...state, loggedinUser: action.user }
        case SET_USERS:
            newState = { ...state, users: action.users }
            break
        case SET_WATCHED_USER:
            newState = { ...state, watchedUser: action.user }
            break
        case SET_SCORE:
            newState = { ...state, user: { ...state.user, score: action.score } }
            break
        case SET_USER_SCORE:
            const user = { ...state.loggedinUser, score: action.score }
            return { ...state, loggedinUser: user }

        default:
            return state;
    }
}