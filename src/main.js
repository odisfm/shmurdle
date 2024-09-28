import resetcss from './reset.css'
import stylesheet from './styles.css'
import animations from './animations.css'
import wordlistRaw from './words.json'
import wordlistFake from './allowed-words.json'
import GameController from './GameController'
import DisplayController from "./DisplayController";
import AccountController from "./AccountController";

export const wordlist = wordlistRaw.words
export const fakeWordlist = wordlistFake.words

export const account = new AccountController()

let firstWord = account.nextWord

export const gameController = new GameController(firstWord)

export const displayController = new DisplayController()

console.log('What on earth are you doing here?')




