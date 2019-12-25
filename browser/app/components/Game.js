import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import './style.css';

const initialState = {categories: [], category: '', lives: 6, word: '', guess: [], status: '', mode: 'Single Player'};
const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
const answers = {
  Mom: 'Kitchen', 
  Todd: 'Basement',
  Juliens: 'Laundry'
};
let disabledBtns = [];

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.determinePlayer = this.determinePlayer.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.createPlaceholder = this.createPlaceholder.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.enableBtns = this.enableBtns.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    const player = this.determinePlayer()
    this.createPlaceholder(player);
    this.refs.start_game.handleOpen();
  }

  determinePlayer() {
    // Pull query string and call createPlaceholder
    const qs = window.location.search;
    const player = qs.split('=')[1];

    this.setState({player})
    return player;
  }

  startGame() {
    this.refs.start_game.handleClose();
    this.enableBtns();
  }

  createPlaceholder(player) {
    // Pull answer based on player
    const answer = answers[player];
    let guess;

    const spaceIndex = answer.indexOf(' ');
    guess = '_'.repeat(answer.length).split('');
    guess[spaceIndex] = ' ';

    this.setState({
      word: answer,
      guess
    });
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

  playAgain() {
    this.refs.play_again.handleClose();
    this.setState(initialState);
    const player = this.determinePlayer()
    this.createPlaceholder(player);
    this.startGame();
  }

  enableBtns() {
    disabledBtns.forEach(btn => {
      btn.disabled = false;
    });
    disabledBtns = [];
  }

  render() {
    return (
      <div className="container">
        <Modal ref="start_game" size="tiny" dimmer="blurring">
          <Modal.Content>
            <h3 className="center">{`Welcome to Christmas Hangman, ${this.state.player}!`}</h3>
            <h5 className="center">Solve the puzzle to find your present!</h5>
            <div className="center">
              <Button
                className="center start-game"
                onClick={e => this.startGame()}
              >Begin!
              </Button>
            </div>
          </Modal.Content>
        </Modal>
        <Modal ref="play_again" size="tiny">
          <Modal.Content>
            <h3 className="center">{`${this.state.status}`}</h3>
            {
              this.state.status === 'You Won!' ?
                <h4 className="center">{`Your present is in the ${this.state.word}!`}</h4>
              :
              <div className="center">
                <Button onClick={this.playAgain}>Try Again</Button>
              </div>
            }
          </Modal.Content>
        </Modal>
        <div className="center character">
          <div className={`head${this.state.lives < 6 ? ' visible' : ' hidden'}`}></div>
          <div className={`body${this.state.lives < 5 ? ' visible' : ' hidden'}`}></div>
          <div className={`left-arm${this.state.lives < 4 ? ' visible' : ' hidden'}`}></div>
          <div className={`right-arm${this.state.lives < 3 ? ' visible' : ' hidden'}`}></div>
          <div className={`left-leg${this.state.lives < 2 ? ' visible' : ' hidden'}`}></div>
          <div className={`right-leg${this.state.lives < 1 ? ' visible' : ' hidden'}`}></div>
        </div>
        <div className="center placeholder-container">
          {this.state.guess.map((letter, index) => {
            return <div key={index} className="placeholder">{letter}</div>;
          })
          }
        </div>
        <div className="center guesses">
          {
            alpha.map((letter, index) => {
              return (
                <Button
                  circular
                  key={index}
                  onClick={(e) => this.handleGuess(e.target)}
                >{letter}
                </Button>
              );
            })
          }
        </div>
        <div className="center hidden">
          {
            this.state.status === 'You Won!' || this.state.status === 'You Lost!' ?
              window.setTimeout(() => this.refs.play_again.handleOpen(),400)
              : 
              ''
          }
        </div>
      </div>
    );
  }
}
