import {wordlist, fakeWordlist} from "./main";
import {account} from "./main";

export default class GameController {
    constructor(firstWord) {
        this.setWord(firstWord)
        this.newGame()
        if (account.user.hardMode === true){
            this.hardMode = true
        }

    }

    setWord(newWord) {
        this.word = newWord
        //this.word = 'alive'
        this.gameOver = false;

    }

    newGame() {
        this.lastGuess = [false, false, false, false, false]
        this.guessCount = 0
        if (account.user.hardMode === true){
            this.hardMode = true
        }
        account.addPlayCount()
    }

    resetGame() {
        account.assignNextWord()
        this.setWord(account.nextWord)
        this.newGame()
    }

    evaluateGuess(guess) {
        if (guess.length !== this.word.length) {
            return;
        }
        let guessArray = [...guess]
        let correctArray = [false, false, false, false, false]
        let correctCount = 0
        let remainingLetters = []
        for (let i = 0; i < guessArray.length; i++) {
            if (guessArray[i] === this.word[i]) {
                correctArray[i] = true
                guessArray[i] = null
                correctCount++
            }else{
                remainingLetters.push(this.word[i])
            }
        }

        for (let i = 0; i < correctArray.length; i++) {
            if (correctArray[i] === true) {
                continue
            }
            for (let j = 0; j < remainingLetters.length; j++) {
                if (guessArray[i] === remainingLetters[j]) {
                    correctArray[i] = 'appears'
                    remainingLetters.splice(j, 1)
                    break
                }
            }
        }
        if (correctCount === 5){
            this.gameOver = true
        }

        let correctLetters = []
        let appearingLetters = []
        let wrongLetters = []
        for (let i = 0; i < this.word.length; i++){
            if (correctArray[i] === true){
                correctLetters.push(guess[i])
            }else if(correctArray[i] === false){
                wrongLetters.push(guess[i])
            }else{
                appearingLetters.push(guess[i])
            }
        }

        if (this.hardMode === true)
            for (let i = 0; i < guessArray.length; i++){
                if (correctArray[i] === true){
                    continue
                }
                if (this.lastGuess[i] === true && this.hardMode === true){
                    return 'invalid'
                }
        }

        this.guessCount++;
        this.lastGuess = correctArray

        let winningRound = false;
        let losingRound = false;
        let word = this.word;
        if (this.gameOver) {
            winningRound = true
            account.addWinCount()
        }else{
            if (this.guessCount === 6){
                this.gameOver = true
                losingRound = true
            }
        }

        return {correctArray, correctLetters, appearingLetters, wrongLetters, winningRound, losingRound, word};
    }

    isInWordList(word) {
        if (!wordlist.includes(word)){
            if (account.user.accurateList){
                return false
            }else{
                if (fakeWordlist.includes(word)){
                    return true
                }else{
                    return false
                }
            }
        }else{
            return true
        }
    }
}