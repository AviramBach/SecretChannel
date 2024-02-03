export const utilService = {
    getCurrentTime,
    getGreeting,
    makeId,
    makeLorem,
    getRandomIntInclusive,
    loadFromStorage,
    saveToStorage,
    animateCSS,
    debounce,
    getAssetSrc,
    makeLabel,
    getTimeFromStamp,
    randomTrueFalse,
    makeImage,
    getEmptyMsg,
    getEmptyReview
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

// function makeLorem(size = 100) {
//     var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
//     var txt = ''
//     while (size > 0) {
//         size--
//         txt += words[Math.floor(Math.random() * words.length)] + ' '
//     }
//     return txt
// }

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}



function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}



// In our utilService
function animateCSS(el, animation) {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`

        el.classList.add(`${prefix}animated`, animationName)

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }
        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}

function getAssetSrc(name) {
    const path = `/src/assets/img/${name}`
    const modules = import.meta.globEager('/src/assets/img/*')
    const mod = modules[path]
    return mod.default
}

function getTimeFromStamp(timestamp) {
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const date = new Date(timestamp)
    const time =
        timeFormat(date.getHours()) + ':' + timeFormat(date.getMinutes())
    const currTimestamp = Date.now()
    const currDate = new Date(currTimestamp)
    const day = 1000 * 60 * 60 * 24
    if (currTimestamp - timestamp < day) return 'Today ' + time
    if (currTimestamp - timestamp < day * 2) return 'Yesterday ' + time
    if (currTimestamp - timestamp < day * 7) return days[date.getDay()]
    if (currDate.getUTCFullYear() !== date.getUTCFullYear())
        return months[date.getMonth()].slice(0, 3) + ' ' + date.getUTCFullYear()
    return date.getDate() + ' ' + months[date.getMonth()].slice(0, 3)
}

function timeFormat(time) {
    return time < 10 ? '0' + time : time
}
// function debounce(fn, wait) {
//     let timer
//     return function (...args) {
//         if (timer) {
//             clearTimeout(timer) // clear any pre-existing timer
//         }
//         const context = this // get the current context
//         timer = setTimeout(() => {
//             fn.apply(context, args) // call the function if time expires
//         }, wait)
//     }
// }
function makeLorem(size = 1) {
    var words = [
        "Superman", "Batman", "Wonder Woman", "Spider-Man", "Iron Man",
        "Captain America", "Thor", "Hulk", "Black Widow", "Wolverine",
        "The Flash", "Green Lantern", "Aquaman", "Black Panther", "Doctor Strange",
        "Deadpool", "Ant-Man", "Daredevil", "Green Arrow", "The Punisher",
        "Captain Marvel (Shazam)", "Jean Grey", "Cyclops", "Storm", "Nightcrawler",
        "Rogue", "Gambit", "Luke Cage", "Iron Fist", "Jessica Jones",
        "Hawkeye", "Scarlet Witch", "Quicksilver", "Vision", "Hawkman",
        "Hawkgirl", "Martian Manhunter", "The Atom", "Zatanna", "The Spectre",
        "Green Hornet", "The Shadow", "The Phantom", "The Spirit", "The Tick",
        "Spawn", "Hellboy", "Witchblade", "Invincible", "The Rocketeer",
        "The Crow", "The Tick", "Savage Dragon", "The Maxx", "V for Vendetta",
        "Rorschach", "Doctor Manhattan", "Nite Owl", "Silk Spectre", "Ozymandias",
        "Swamp Thing", "Constantine", "Blue Beetle", "Booster Gold", "Plastic Man",
        "The Question", "Red Tornado", "Firestorm", "Martian Manhunter", "Batwoman",
        "Batgirl", "Batwing", "Catwoman", "Huntress", "Oracle", "Supergirl",
        "Superboy", "Power Girl", "Hawkwoman", "Starfire", "Raven", "Cyborg",
        "Beast Boy", "Static Shock", "Blue Beetle", "Atom Smasher", "Sandman",
        "Death", "Dream (Morpheus)", "Lucifer", "Starman", "Jonah Hex",
        "Green Lantern (Alan Scott)", "Green Lantern (Jessica Cruz)", "Blue Devil", "Captain Atom",
        "Doctor Fate", "Etrigan the Demon", "The Creeper", "Plastic Man", "Ragman",
        "The Question (Renee Montoya)", "Black Canary", "Mr. Miracle", "Big Barda", "The Ray",
        "Elongated Man", "Fire", "Ice", "Animal Man"
    ]
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ''
    }
    return txt
}
function makeLabel(size = 3) {
    var words = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']
    var word = ''
    let labels = []
    while (size > 0) {
        size--
        word = words[Math.floor(Math.random() * words.length)] + ''
        labels.push(word)
    }
    return labels
}
function makeImage(size = 1) {
    const toyIcons = ["🧸", "🚗", "🎨", "🎆", "🌞", "☔", "⚡", "🎌", "🗼", "🗽", "🛴", "🛵", "🚍", "🚋", "🦼", "🚖", "🚜", "🦽", "🕋", "🚲", "⛑", "🏈", "🎱", "⛳", "💎", "👑", "⚽", "👓", "🏏", "🤿", "🎣", "🏐", "🏀", "🥎", "🏉", "🎲", "🎮", "🎯", /* Add more toy icons here */]
    var icon = ''
    while (size > 0) {
        size--
        icon = toyIcons[Math.floor(Math.random() * toyIcons.length)] + ''
    }
    return icon
}
function makePhoneNumber(length = 8) {
    var txt = ''
    var possible = '0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}
function randomTrueFalse() {
    return Math.random() < 0.5;

}
function getEmptyMsg() {
    return {
        txt: '',
    }
}
function getEmptyReview() {
    return {
        txt: '',
    }
}


function getCurrentTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0'); // Ensure two digits for hour
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Ensure two digits for minutes

    return `${hour}:${minutes}`;
}

function getGreeting() {
    const currentTime = new Date()
    const currentHour = currentTime.getHours()

    let greeting;

    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good morning "
    } else if (currentHour >= 12 && currentHour < 17) {
        greeting = "Good afternoon "
    } else if (currentHour >= 17 && currentHour < 21) {
        greeting = "Good evening "
    } else {
        greeting = "Good night "
    }

    return greeting 
}