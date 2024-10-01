import {gameController} from "./main";
import {account} from "./main";

export default class DisplayController {
    constructor() {
        this.gameDiv = document.querySelector('#game')
        this.lettersInWord = 5
        this.guessesAllowed = 6
        document.addEventListener('keydown', (e) => this.processKeypress(e))
        this.resetGame()
        document.querySelectorAll('.keyboard-key').forEach((button) => {
            button.addEventListener('click', () => {
                if (button.classList.contains('enter')){
                    this.processKeypress({key: 'Enter'})
                }else if (button.classList.contains('delete')){
                    this.processKeypress({key: 'Backspace'})
                }else{
                    this.processKeypress({key: button.textContent})
                }
            })
        })
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 20) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        document.querySelector('#play-again').addEventListener('click', () => {
            gameController.resetGame()
            this.resetGame()
        })
        document.querySelector('#overflow-button').addEventListener('click', () => {
            const overflowMenu = document.querySelector('#overflow-menu')
            if (overflowMenu.classList.contains('hidden')){
                overflowMenu.classList.remove('hidden')
            }else{
                overflowMenu.classList.add('hidden')
            }
        })
        document.querySelector('#content').addEventListener('click', () => {
            document.querySelector('#overflow-menu').classList.add('hidden')
        })
        let hardModeToggle = document.querySelector('#hard-mode-checkbox')
        hardModeToggle.addEventListener('change', () => {
            account.setHardMode(hardModeToggle.checked)
            document.querySelector('#overflow-menu').classList.add('hidden')
            this.printError('Setting will apply from your next game')
        })
        if (account.user.hardMode) {
            hardModeToggle.checked = true
        }
        let animationsToggle = document.querySelector('#animations-checkbox')
        animationsToggle.addEventListener('change', () => {
            account.setAnimations(!animationsToggle.checked)
            document.querySelector('#overflow-menu').classList.add('hidden')
        })
        if (account.user.animations) {
            animationsToggle.checked = false
        }
        let accurateListToggle = document.querySelector('#accurate-list-checkbox')
        accurateListToggle.addEventListener('change', () => {
            account.setAccurateWordlist(accurateListToggle.checked)
            document.querySelector('#overflow-menu').classList.add('hidden')
            if (accurateListToggle.checked === false){
                this.printError('Schmurdle will let you guess real words that will never be the correct word')
            }else{
                this.printError('Schmurdle will not allow real words that will never be the correct word')
            }
        })
        if (account.user.accurateList) {
            accurateListToggle.checked = true
        }
        const clearUserData = document.querySelector('#clear-user-data')
        clearUserData.addEventListener('click', () => {
            if (window.confirm('Clear all user data and forfeit game?')){
                account.clearUserData()
            }
        })
        const forfeitGame = document.querySelector('#forfeit-game')
        forfeitGame.addEventListener('click', () => {
            if (gameController.guessCount === 0){
                this.printError('You haven\'t made a guess yet!')
                document.querySelector('#overflow-menu').classList.add('hidden')
                return
            }
            if (window.confirm('Forfeit the current game?')){
                this.gameOver()
                account.registerDefeat('forfeit')
                document.querySelector('#overflow-menu').classList.add('hidden')
            }
        })
        document.querySelector('#open-stats').addEventListener('click', () => this.openStats())
        document.querySelector('#open-stats-2').addEventListener('click', () => this.openStats())
        const closeStatsButton = document.querySelector('#stats-close-button')
        closeStatsButton.addEventListener('click', () => {
            document.querySelector('#stats-display').classList.add('hidden')
        })


    }

    resetGame() {
        document.querySelector('body').classList.remove('game-over')
        document.querySelectorAll('.letter-box').forEach((letter) => {
            letter.remove()
        })
        this.drawLetterDivs(this.lettersInWord * this.guessesAllowed)
        this.selectNextRow()
        this.currentAttempt = ''
        this.initialiseKeyboard()
        if (account.isWordOfDay()){
            this.displayWordOfTheDayIcon(true)
        }else{
            this.displayWordOfTheDayIcon(false)
        }

    }

    selectNextRow() {
        let guessCount = gameController.guessCount
        let allLetterDivs = document.querySelectorAll('.letter-box')
        let firstIndex = (this.lettersInWord * guessCount)
        if (firstIndex <= 0){
            firstIndex = 0
        }

        this.currentRow = [...allLetterDivs].splice(firstIndex, this.guessesAllowed - 1)
    }

    processKeypress(e) {
        if (gameController.gameOver) {
            return;
        }
        let keyValue = e.key

        if (keyValue === 'Enter'){
            this.processAttempt()
        }else if (keyValue === 'Backspace') {
            if (this.currentAttempt.length > 0) {

                this.currentAttempt = this.currentAttempt.slice(0, -1)
                this.currentRow[this.currentAttempt.length].textContent = null

            }
        }else if (/^[a-zA-Z]$/.test(keyValue)) {
            if (this.currentAttempt.length >= this.lettersInWord) {
                return;
            }
            keyValue = keyValue.toLowerCase()
            this.currentAttempt += keyValue
            let letterIndex = this.currentAttempt.length - 1
            this.currentRow[letterIndex].textContent = keyValue
        }else if (keyValue === 'Escape') {
            if (!document.querySelector('#overflow-menu').classList.contains('hidden')){
                document.querySelector('#overflow-menu').classList.add('hidden')
            }else if (!document.querySelector('#stats-display').classList.contains('hidden')) {
                document.querySelector('#stats-display').classList.add('hidden')
            }
        }else{
            return;
        }
    }

    drawLetterDivs(totalLetters) {
        for (let i = 0, j = 0; i < totalLetters; j++, i++) {
            let letterDiv = document.createElement('div')
            letterDiv.classList.add('letter-box', 'unchecked')
            // let animationDelay = 100 * j
            // letterDiv.setAttribute('style', `animation-delay: ${animationDelay}ms`)
            this.gameDiv.append(letterDiv)
            // if (j === 4){
            //     j = 0
            // }
        }
    }

    processAttempt() {
        let guessResult = gameController.evaluateGuess(this.currentAttempt)

        if (guessResult === 'invalidHard' || guessResult === 'notInList' || guessResult === 'otherInvalid'){
            if (guessResult === 'invalidHard') {
                this.printError('You must try letters you know are correct!\nDisable hard mode in the menu')
            }
            else if (guessResult === 'notInList'){
                this.printError('Not in word list!')
            }
            if (account.user.animations) {
                this.currentRow.forEach((button) => {
                    button.classList.add('wiggle')
                })
                setTimeout(() => {
                    this.currentRow.forEach((button) => {
                        button.classList.remove('wiggle')
                    })
                }, 1000)
            }
            return;
        }

        let correctArray = guessResult.correctArray
        let animatedDivs = [...this.currentRow]
        if (account.user.animations) {
            animatedDivs.forEach((button) => {
                button.classList.add('flip')
            })
        }
        if (guessResult.winningRound) {

        }
        if (account.user.animations) {
            setTimeout(() => {
                animatedDivs.forEach((button) => {
                    button.classList.remove('flip')
                })
            }, 1000)
        }

        for (let i = 0; i < this.lettersInWord; i++) {
            this.currentRow[i].classList.remove('unchecked')
            switch (correctArray[i]){
                case true:
                    this.currentRow[i].classList.add('correct')
                    break
                case false:
                    this.currentRow[i].classList.add('wrong')
                    break
                case 'appears':
                    this.currentRow[i].classList.add('appears')
                    break
            }
        }
        this.updateKeyboardHints(guessResult)
        this.currentAttempt = ''

        if (!gameController.gameOver) {
            this.selectNextRow()
        }

        if (guessResult.losingRound){
            this.gameOver()
        }else if (guessResult.winningRound){
            this.gameOver(true)
        }

    }

    initialiseKeyboard() {
        document.querySelectorAll('.keyboard-key').forEach((button) => {
            button.classList.remove('correct', 'wrong', 'appears')
        })
    }

    updateKeyboardHints(guessResult) {
        let keyboardButtons = document.querySelectorAll('.keyboard-key')
        function updateLetter(letter, result){
            letter = letter.toUpperCase()
            for (let i = 0; i < keyboardButtons.length; i++) {
                let button = keyboardButtons[i]
                if (button.textContent !== letter){
                    continue
                }
                if (result === 'wrong') {
                    button.classList.add('wrong')
                } else if (result === 'appears') {
                    button.classList.add('appears')
                } else if (result === 'correct') {
                    button.classList.add('correct')
                }
                break
            }
        }
        for (let i = 0; i < guessResult.wrongLetters.length; i++){
            let letter = guessResult.wrongLetters[i]
            updateLetter(letter, 'wrong')
        }
        for (let i = 0; i < guessResult.appearingLetters.length; i++){
            let letter = guessResult.appearingLetters[i]
            updateLetter(letter, 'appears')
        }
        for (let i = 0; i < guessResult.correctLetters.length; i++){
            let letter = guessResult.correctLetters[i]
            updateLetter(letter, 'correct')
        }
    }

    printError(errorMessage) {
        const errorBox = document.querySelector('#error-message')
        if (errorBox.classList.contains('fade-in') || errorBox.classList.contains('fade-out')){
            return
        }
        errorBox.textContent = errorMessage
        errorBox.classList.add('fade-in')
        setTimeout(() => {
            errorBox.classList.add('fade-out')
            setTimeout(() => {
                errorBox.classList.remove('fade-in', 'fade-out')

            }, 1000)
        }, 3000)
    }

    playVictoryAnimation() {
        if (!account.user.animations){
             return
        }
        const explosionContainer = document.querySelector('#explosion-container')
        explosionContainer.classList.add('explosion')
        let letterDivs = [...document.querySelectorAll('.letter-box')]
        let firstCurrentIndex = letterDivs.indexOf(this.currentRow[0])
        letterDivs.splice(firstCurrentIndex, 5)
        this.currentRow.forEach((button) => {
            button.classList.add('animate-winning')
        })
        letterDivs.forEach((button) => {
            button.classList.add('animate-winning-others')
        })
        setTimeout(() => {
            this.currentRow.forEach((button) => {
                button.classList.remove('animate-winning')
            })
            letterDivs.forEach((button) => {
                button.classList.remove('animate-winning-others')
            })
        }, 4000)
        setTimeout(() => {
            explosionContainer.classList.remove('explosion')
        }, 4000)
    }

    gameOver(winningGame = false) {

        if (winningGame && account.user.animations) {
                this.playVictoryAnimation()
        }

        const gameOverModal = document.querySelector('#game-over')
        const gameOverLetters = gameOverModal.querySelectorAll('.winning-letter')
        for (let i = 0; i < gameController.word.length; i++) {
            gameOverLetters[i].textContent = gameController.word[i].toUpperCase()
        }
        gameOverModal.classList.remove('win', 'lose')
        if (winningGame) {
            gameOverModal.classList.add('win')
            document.querySelector('#victory-message').textContent = this.generateVictoryMessage()
            document.querySelector('#game-over-streak').textContent = account.user.winStreak
            if (account.user.animations){
                setTimeout(() => {
                    document.querySelector('body').classList.add('game-over');
                    gameOverModal.classList.add('fade-in')
                    setTimeout(() => {
                        gameOverModal.classList.remove('fade-in')
                    }, 1000)
                }, 4000)
            }else{
                document.querySelector('body').classList.add('game-over');
            }
        }else{
            gameOverModal.classList.add('lose')
            if (account.user.animations){
                document.querySelector('body').classList.add('game-over');
                gameOverModal.classList.add('fade-in')
                setTimeout(() => {
                    gameOverModal.classList.remove('fade-in')
                }, 1000)
            }else{
                document.querySelector('body').classList.add('game-over');
            }
        }
    }

    updateStatDisplay(){
        let statObject = account.reportStats()
        const playedCountSpan = document.querySelector('#games-played-count')
        const winCountSpan = document.querySelector('#games-won-count')
        const winPercentageSpan = document.querySelector('#win-percentage')
        const winStreakSpan = document.querySelector('#win-streak')

        const barElements = document.querySelectorAll('.bar')

        playedCountSpan.textContent = statObject.playedCount
        winCountSpan.textContent = statObject.winCount
        winPercentageSpan.textContent = statObject.winPercentage + '%'
        winStreakSpan.textContent = statObject.winStreak

        for (let i = 0; i < statObject.guessPercents.length; i++){
            let guess = statObject.guessPercents[i]
            let bar = barElements[i]
            bar.setAttribute('style', `height: ${guess}%`)
        }
        barElements[6].setAttribute('style', `height: ${statObject.defeatPercentage}%`)
    }

    openStats(){
        this.updateStatDisplay()
        document.querySelector('#stats-display').classList.remove('hidden')
        document.querySelector('#overflow-menu').classList.add('hidden')
    }

    generateVictoryMessage(){
        let guessCount = gameController.guessCount
        let messageCategory;
        if (guessCount <= 1){
            messageCategory = 0
        }else if (guessCount === 2 || guessCount === 3){
            messageCategory = 1
        }else if (guessCount === 4 || guessCount === 5){
            messageCategory = 2
        }else{
            messageCategory = 3
        }
        let messageSelection = victoryMessages[messageCategory]
        let random = Math.floor(Math.random() * (messageSelection.length - 1));
        return messageSelection[random]
    }

    displayWordOfTheDayIcon(state){
        let icon = document.querySelector(`#wotd-identifier`)
        if (state === true){
            icon.classList.remove('hidden')
            icon.addEventListener('click', () => {
                this.printError('You\'re playing the word of the day!')
            })
        }else{
            icon.classList.add('hidden')
        }
    }
}

const victoryMessages = [
    ['How on earth...', 'Unbelievable...', 'What the heck?!'],
    ['Amazing!', 'Great job!', 'Well done!'],
    ['Nice one!', 'You did it!', 'Nice work!'],
    ['That was close!', 'Phew!', 'Close call!']
]