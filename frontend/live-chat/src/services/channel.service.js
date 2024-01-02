import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'

const BASE_URL = 'channel/'
const STORAGE_KEY = 'channelDB'


export const channelService = {
    query,
    getById,
    save,
    remove,
    getEmptyChannel,
    getDefaultFilter,
    addMsg,
    removeMsg
}

_createChannels()

function query(filterBy = {txt: ''}) {
    return httpService.get(BASE_URL, filterBy)
    // .then(channels => {
    //     return channels.filter(toy =>
    //         regExp.test(toy.vendor) &&
    //         toy.price <= filterBy.maxPrice
    //     )
    // })
}

// function query(filterBy = {}) {
//     return storageService.query(STORAGE_KEY).then(channels => {
//         let toyToDisplay = [...channels]
//         // console.log('toyToDisplay', toyToDisplay)
//         if (filterBy.txt) {
//             const regExp = new RegExp(filterBy.txt, 'i')
//             toyToDisplay = toyToDisplay.filter(toy => regExp.test(toy.name))
//             // console.log('toyToDisplay txt', toyToDisplay)
//         }
//         if (filterBy.inStock !== undefined) {
//             if (filterBy.inStock === true) {
//                 toyToDisplay = toyToDisplay.filter(toy => toy.inStock === true)
//             } else if (filterBy.inStock === false) {
//                 toyToDisplay = toyToDisplay.filter(toy => toy.inStock === false)
//             }
//         }
//         if (filterBy.labels && filterBy.labels.length > 0) {
//             toyToDisplay = toyToDisplay.filter(toy => {
//                 return toy.labels.some(label => filterBy.labels.includes(label))
//             })
//         }
//         // return axios.get(BASE_URL).then(res => res.data)
//         // return toyToDisplay
//     })
// }

function getById(channelId) {
    return httpService.get(BASE_URL + channelId)
}

// function getById(channelId) {
//     return storageService.get(STORAGE_KEY, channelId)
// }

function remove(channelId) {
    // return Promise.reject('Oh no!')
    return httpService.delete(BASE_URL + channelId)
}

// function remove(channelId) {
//     // return Promise.reject('Not now!')
//     return storageService.remove(STORAGE_KEY, channelId)
// }

function save(toy) {
    if (toy._id) {
        return httpService.put(BASE_URL, toy)
    } else {
        return httpService.post(BASE_URL, toy)
    }
}
async function addMsg(channelId, txt) {
    // console.log('channelId',channelId , txt)
    const savedMsg = await httpService.post(`toy/${channelId}/msg`, { txt })
    return savedMsg
}

async function removeMsg(channelId, msgId) {
    const removedId = await httpService.delete(`toy/${channelId}/msg/${msgId}`)
    return removedId
}

// function save(toy) {
//     if (toy._id) {
//         return storageService.put(STORAGE_KEY, toy)
//     } else {
//         // when switching to backend - remove the next line
//         return storageService.post(STORAGE_KEY, toy)
//     }
// }

function getEmptyChannel() {
    return {
        name: utilService.makeLorem(),
        createdAt: utilService.getTimeFromStamp(Date.now()),
    }
}

function getDefaultFilter() {
    return { txt: '', pageIdx: 0 }
}

function _createChannels() {
    let channels = storageService.loadFromStorage(STORAGE_KEY)
    if (!channels || !channels.length) {
        channels = [
            {
                _id: utilService.makeId(),
                name: utilService.makeLorem(),
                createdAt: utilService.getTimeFromStamp(Date.now()),
            },
            {
                _id: utilService.makeId(),
                name: utilService.makeLorem(),
                createdAt: utilService.getTimeFromStamp(Date.now()),
            },
            {
                _id: utilService.makeId(),
                name: utilService.makeLorem(),
                createdAt: utilService.getTimeFromStamp(Date.now()),
            },
        ]
        storageService.saveToStorage(STORAGE_KEY, channels)
    }
}
