import { channelService } from "../../services/channel.service"

export const SET_CHANNELS = 'SET_CHANNELS'
export const REMOVE_TOY = 'REMOVE_TOY'
export const ADD_TOY = 'ADD_TOY'
export const UPDATE_TOY = 'UPDATE_TOY'

export const SET_FILTER = 'SET_FILTER'
export const SET_PAGE_IDX = 'SET_PAGE_IDX'

const initialState = {
    channels: [],
    filterBy: channelService.getDefaultFilter()
}



export function channelReducer(state = initialState, action = {}) {
    let channels
    let lastChannels
    switch (action.type) {
        //Toys
        case SET_CHANNELS:
            lastChannels = [...action.channels]
            return { ...state, channels: action.channels, lastChannels }

        // case REMOVE_TOY:
        //     lastToys = [...state.toys]
        //     toys = state.toys.filter(toy => toy._id !== action.toyId)
        //     return { ...state, toys, lastToys }

        // case ADD_TOY:
        //     toys = [...state.toys, action.toy]
        //     return { ...state, toys }

        // case UPDATE_TOY:
        //     toys = state.toys.map(toy => toy._id === action.toy._id ? action.toy : toy)
        //     return { ...state, toys }

        // //Filter
        // case SET_FILTER:
        //     return { ...state, filterBy: action.filterBy }
        // case SET_PAGE_IDX:
        //     return { ...state, filterBy: { ...state.filterBy, pageIdx: action.pageIdx } }

        default:
            return state
    }
}