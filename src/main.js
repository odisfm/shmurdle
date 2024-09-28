import resetcss from './reset.css'
import stylesheet from './styles.css'
import wordlistRaw from './words.json'
import GameController from './GameController'
import DisplayController from "./DisplayController";
import AccountController from "./AccountController";

export const wordlist = wordlistRaw.words

export const account = new AccountController()

let firstWord = account.nextWord

export const gameController = new GameController(firstWord)

export const displayController = new DisplayController()




