import { v4 as uuid} from 'uuid'
import { parseJSON as parseDate, isToday, format as formatDate } from 'date-fns';
import {wordlist} from "./main";

export default class AccountController {
    constructor() {
        this.user = localStorage.getItem('user')
        if (this.user === null) {
            let id = uuid()
            let winCount = 0
            let playedCount = 0
            let lastPlayed = new Date()
            let hardMode = true
            let animations = true
            let accurateList = false
            this.assignNextWord(true)
            this.user = {
                id: id,
                winCount: winCount,
                playedCount: playedCount,
                lastPlayed: lastPlayed,
                hardMode: hardMode,
                animations: animations,
                accurateList: accurateList
            }
        }else {
            this.user = JSON.parse(this.user)
            this.user.lastPlayed = parseDate(this.user.lastPlayed)
            this.assignNextWord()
        }
        this.updateStoredUser()
    }

    updateStoredUser() {
        localStorage.setItem('user', JSON.stringify(this.user))
    }

    addPlayCount() {
        this.user.playedCount++
        this.updateStoredUser()
    }

    addWinCount() {
        this.user.winCount++
        this.updateStoredUser()
    }

    assignNextWord(firstTimePlayer = false) {
        if (firstTimePlayer || !isToday(this.user.lastPlayed)){
            let dateToFormat;
            if (firstTimePlayer){
                dateToFormat = new Date()
            }else{
                dateToFormat = this.user.lastPlayed
            }
            let dateString = formatDate(dateToFormat, 'EEEE d MMMM yyyy')
            let hash = this.stringToNumber(dateString)
            hash = wordlist.length % hash
            this.nextWord = wordlist[hash]
        }else{
            let random = Math.floor(Math.random() * (wordlist.length - 1));
            this.nextWord = wordlist[random]
        }
    }

    stringToNumber(string) {
        let hashCode = 0;
        for (let i = 0; i < string.length; i++) {
            hashCode += string.charCodeAt(i);
        }

        return hashCode;
    }

    setHardMode(value){
        this.user.hardMode = value
        this.updateStoredUser()
    }

    setAnimations(value){
        this.user.animations = value
        this.updateStoredUser()
    }

    setAccurateWordlist(value){
        this.user.accurateList = value
        this.updateStoredUser()
    }

    clearUserData(){
        localStorage.clear()
        location.reload()
    }
}