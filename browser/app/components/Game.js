import React, { Component } from 'react';
import { Button, Modal, Visibility, Input } from 'semantic-ui-react';

const initialState = {difficulty: '', categories: [], category: '', lives: 0, score: 0, word: '', guess: [], status: '', pastWords: [], mode: ''};
const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
const staticCategories = [{title: 'Activity 1', items: ['Testing activity item']}, {title: 'Activity 2', items: ['Football', 'Soccer']}]
let disabledBtns = [], activeCategory = {};

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleClick = this.handleClick.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.generateWord = this.generateWord.bind(this);
    this.enableBtns = this.enableBtns.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.determineLives = this.determineLives.bind(this);
  }

  componentDidMount() {
    this.setState({
      categories: staticCategories
    })
    this.refs.start_game.handleOpen()
  }

  startGame(numPlayers) {
    if (numPlayers === 'One') {
      this.refs.start_game.handleClose()
      return this.setState({
        mode: 'Single Player'
      })
    }
    // 2 Players
    this.refs.input.handleOpen()
  }

  generateWord(categoryName) {
    let pastWords = this.state.pastWords
    if (this.state.word.length > 0) pastWords.push(this.state.word)

    // Search through category titles to get list of possible words
    let arrayOfWords = [];
    this.state.categories.map(category => {
      if (category.title === categoryName) {
        arrayOfWords = category.items
      }
    })

    let generateRandomNum = () => Math.floor(Math.random() * arrayOfWords.length)
    let newWord = arrayOfWords[generateRandomNum()]
    let count = 0;
    while (pastWords.includes(newWord) && count < 15) {
      newWord = arrayOfWords[generateRandomNum()]
      count += 1
    }

    if (pastWords.includes(newWord) && count >= 15) {
      alert('ran out of words')
    }

    let guess = '_'.repeat(newWord.length).split('')

    return [newWord, pastWords, guess]
  }

  determineLives(difficulty) {
    // let lives = 0;
    // switch(difficulty) {
    //   case 'Easy':
    //     lives = 5;
    //     break;
    //   case 'Medium':
    //     lives = 3;
    //     break;
    //   case 'Hard':
    //     lives = 1;
    //     break;
    // }
    return 5;
  }

  handleClick(e, typeOfElement) {
    let text = e.textContent;
    if (typeOfElement === 'difficulty') {
      let lives = this.determineLives(text);
      this.setState({
        difficulty: text,
        lives: lives
      })
    } else if (typeOfElement === 'category') {

      // Categories no longer highlight when selected
      let wordPastWordsGuess = this.generateWord(text)
      let lives = this.determineLives(this.state.difficulty)
      this.enableBtns()
      this.setState({
        category: text,
        word: wordPastWordsGuess[0],
        pastWords: wordPastWordsGuess[1],
        guess: wordPastWordsGuess[2],
        lives: lives
      })
    }
  }

  handleGuess(e) {
    disabledBtns.push(e);
    e.disabled = true;
    let guess = e.textContent;
    let wordArray = this.state.word.split('');
    let lettersFound = [];

    wordArray.map((letter, index) => {
      if (guess === letter || guess.toLowerCase() === letter) {
        lettersFound.push(index);
      }
    })

    if (lettersFound.length === 0) {
      let lifeCount = this.state.lives-= 1;
      if (lifeCount === 0) {
        return this.setState({
          lives: lifeCount,
          status: 'You Lost!'
        })
      }
      return this.setState({
        lives: lifeCount
      })
    }

    // replace dashes with letters when guessed Correctly
    let newGuess = this.state.guess;
    lettersFound.map(index => {
      newGuess[index] = guess.toLowerCase();
    })

    // check to see if player has won
    let gameStatus = this.state.guess.indexOf('_') === -1 ? 'You Won!' : ''

    return this.setState({
      guess: newGuess,
      status: gameStatus
    })
  }

  playAgain(yes) {
    if (this.state.mode === 'Multiplayer') {
      this.refs.input.handleOpen()
      let lives = this.determineLives(this.state.difficulty)
      let newState = Object.assign({}, this.state, { lives: lives, status: '', mode: 'Multiplayer'})
      this.enableBtns()
      this.refs.play_again.handleClose()
      return this.setState(newState)
    }
    // Single player play again
    let wordPastWordsGuess = this.generateWord(this.state.category)
    let newState = Object.assign({}, this.state, { lives: 3, word: wordPastWordsGuess[0], guess: wordPastWordsGuess[2], status: '', pastWords: wordPastWordsGuess[1] })
    this.enableBtns()
    this.refs.play_again.handleClose()
    this.setState(newState)
  }

  enableBtns() {
    disabledBtns.forEach(btn => {
      btn.disabled = false
    })
    disabledBtns = [];
  }

  handleSubmit() {
    let word = this.refs.word.inputRef.value
    let category = this.refs.category.inputRef.value
    let guess = '_'.repeat(word.length).split('')

    this.setState({
      word: word,
      category: category,
      mode: 'Multiplayer',
      guess: guess
    })
    this.refs.input.handleClose()
    this.refs.start_game.handleClose()
  }

  render() {
    return (
      <div className="container">
        <Modal ref="start_game" size="tiny" dimmer="blurring">
          <Modal.Content>
            <h3 className="center">Welcome to Hangman! </h3>
            <h5 className="center">Select a difficulty</h5>
            <div className="center">
              <Button className="center" onClick={(e) => this.handleClick(e.target, 'difficulty')}>Easy</Button>
              <Button className="center" onClick={(e) => this.handleClick(e.target, 'difficulty')}>Medium</Button>
              <Button className="center" onClick={(e) => this.handleClick(e.target, 'difficulty')}>Hard</Button>
            </div>
            <h5 className="center">Select the number of players</h5>
            <div className="center">
              <Button className="center" onClick={(e) => this.startGame(e.target.textContent)}>One</Button>
              {/* <Button className="center" onClick={(e) => this.startGame(e.target.textContent)}>Two</Button> */}
            </div>
          </Modal.Content>
        </Modal>
        <Modal ref="input" size="tiny">
          <Modal.Content>
          <div className="center">
            <div>
              <h3 className="center">Enter a word</h3>
              <Input className="center" ref="word" placeholder="e.g. FC Cincy" />
            </div>
            <div className="input">
              <h3 className="center">Enter a category</h3>
              <Input className="center" ref="category" placeholder="e.g. Soccer team" />
            </div>
            <Button ref="playBtn" size="tiny" className="playBtn" circular={true} onClick={this.handleSubmit}>Play</Button>
          </div>
          </Modal.Content>
        </Modal>
        <Modal ref="play_again" size="tiny">
          <Modal.Content>
          <h3 className="center">{this.state.status}</h3>
          <h5 className="center">Play Again?</h5>
          <div className="center">
            <Button onClick={this.playAgain}>Yes</Button>
            <Button onClick={() => this.refs.play_again.handleClose()}>No</Button>
          </div>
          </Modal.Content>
        </Modal>
        <ul className="center difficulty">
          <Button color="teal" onClick={(e) => this.handleClick(e.target, 'difficulty')} active={this.state.difficulty === 'Easy' ? true : false}>Easy</Button>
          <Button color="teal" onClick={(e) => this.handleClick(e.target, 'difficulty')} active={this.state.difficulty === 'Medium' ? true : false}>Medium</Button>
          <Button color="teal" onClick={(e) => this.handleClick(e.target, 'difficulty')} active={this.state.difficulty === 'Hard' ? true : false}>Hard</Button>
        </ul>
        <ul className="center categories">
        {this.state.mode === 'Multiplayer' ?
          <Button color="olive" compact>{this.state.category}</Button>
         : staticCategories.map((category, index) => {
            return <Button color="olive" key={index} compact onClick={(e) => this.handleClick(e.target, 'category')}>{category.title}</Button>
          })
        }
        </ul>
        <div className="center placeholder-container">
          {this.state.guess.map((letter, index) => {
            return <div key={index} className="placeholder">{letter}</div>
            })
          }
        </div>
        <div className="center guesses">
          {
            alpha.map((letter, index) => {
              return <Button circular key={index} onClick={(e) => this.handleGuess(e.target)}>{letter}</Button>
            })
          }
        </div>
        <div className="center">
          <div className="btm lives" ref="lives">Lives: { this.state.lives }</div>
          <div className="btm score">Score: { this.state.score }</div>
          {this.state.status === 'You Won!' || this.state.status === 'You Lost!' ? this.refs.play_again.handleOpen() : ''}
        </div>
      </div>
    )
  }
}
