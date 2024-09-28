import {wordlist} from "./main";

export default class GameController {
    constructor(firstWord) {
        this.setWord(firstWord)
    }

    setWord(newWord) {
        this.word = newWord
        //this.word = 'eeede'
        console.log(`the word is ${this.word}`)
        console.log([...this.word])
    }

    evaluateGuess(guess) {
        console.log(`You guessed "${guess}"`)
        if (guess.length !== this.word.length) {
            console.log('Invalid guess length!')
            return;
        }
        if (!wordlist.includes(guess)) {
            console.log(`"${guess}" is not in word list!`)
            return
        }
        if (guess === this.word) {
            console.log('correct!!!')
            return
        }
        let guessArray = [...guess]
        let correctArray = [false, false, false, false, false]
        console.log(guessArray)

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


        console.log(correctArray)

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
        console.log(`${correctCount}/${this.word.length} correct!`)
        console.log(correctArray)
        return correctArray;
    }
}