
import { storageService } from './async-storage.service.js'
import { showErrorMsg } from './event-bus.service.js'
import { httpService } from './http.service.js'


const BASE_URL = 'auth/'
const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN = 'loggedinUser'



export const userService = {
    login,
    logout,
    signup,
    getById,
    getLoggedinUser,
    getUsers,


}

window.us = userService

function getUsers() {
    // return storageService.query('user')
    return httpService.get(`user`)
}

function getById(userId) {
    return storageService.get(BASE_URL, userId)
}

async function signup({ username, password, fullname }) {
    const user = { username, password, fullname }

    const registeredUser = await httpService.post(BASE_URL + 'signup', user)
    
    if (registeredUser) {
        return _setLoggedinUser(registeredUser)
    }


    // try {
    //     const registeredUser = await httpService.post(BASE_URL + 'signup', user)

    //     if (registeredUser) {
    //         return _setLoggedinUser(registeredUser)
    //     }
    // } catch (err) {
    //     console.log('Had issues in signup', err)
    //     // showErrorMsg('Cannot sign up')
    // }
}

async function login({ username, password }) {
    try {
        const user = await httpService.post(BASE_URL + 'login', { username, password })
        if (user) {
            return _setLoggedinUser(user)
        }
    } catch (err) {
        console.log('Had issues in login', err)
        showErrorMsg('Cannot login')
    }
}

async function logout() {
    try {
        await httpService.post(BASE_URL + 'logout')
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    } catch (err) {
        console.log('Had issues in logout', err)
    }
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

// Test Data
// userService.signup({username: 'muki222222', password: 'muki1', fullname: 'Muki Ja'})
// userService.login({username: 'muki', password: 'muki1'})



