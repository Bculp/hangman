import React, { Component } from 'react';
import { Button, Modal, Visibility, Input } from 'semantic-ui-react';

const initialState = {categories: [], category: '', lives: 5, word: '', guess: [], status: '', mode: ''};
const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
const staticCategories = ['Activity 1', 'Activity 2', 'Activity 3'];
const answers = ['art', 'fruity deliciousness', 'seasonal dinner'];
let disabledBtns = [];

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleClick = this.handleClick.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.enableBtns = this.enableBtns.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    this.setState({
      categories: staticCategories
    });
    this.refs.start_game.handleOpen();
  }

  startGame() {
    this.refs.start_game.handleClose();
    return this.setState({
      mode: 'Single Player'
    });
  }

  handleClick(e) {
    const text = e.textContent;
    let answer;
    let guess;
    function createPlaceholder() {
      const spaceIndex = answer.indexOf(' ');
      guess = '_'.repeat(answer.length).split('');
      guess[spaceIndex] = ' ';
    }

    if (text === 'Activity 1') {
      answer = answers[0];
      createPlaceholder();
    } else if (text === 'Activity 2') {
      answer = answers[1];
      createPlaceholder();
    } else {
      answer = answers[2];
      createPlaceholder();
    }
    this.setState({
      lives: 5,
      word: answer,
      category: text,
      guess,
      status: ''
    });
    this.enableBtns();
    this.refs.start_game.handleClose();
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
    this.refs.start_game.handleOpen();
    this.enableBtns();
    this.setState(initialState);
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
            <h3 className="center">Welcome to Hangman! </h3>
            <h5 className="center">Select an activity</h5>
            <div className="center">
              <Button
                className="center"
                onClick={e => this.handleClick(e.target)}
              >Activity 1
              </Button>
              <Button
                className="center"
                onClick={e => this.handleClick(e.target)}
              >Activity 2
              </Button>
              <Button
                className="center"
                onClick={e => this.handleClick(e.target)}
              >Activity 3
              </Button>
            </div>
          </Modal.Content>
        </Modal>
        <Modal ref="play_again" size="tiny">
          <Modal.Content>
            <h3 className="center">{`${this.state.status} The answer is: ${this.state.word}`}</h3>
            <h5 className="center">Play Again?</h5>
            <div className="center">
              <Button onClick={this.playAgain}>Yes</Button>
              <Button onClick={() => this.refs.play_again.handleClose()}>No</Button>
            </div>
          </Modal.Content>
        </Modal>
        <ul className="center categories">
          {staticCategories.map((category, index) => {
            return (
              <Button
                color="olive"
                key={index}
                compact
                onClick={(e) => this.handleClick(e.target)}
              >{category}
              </Button>
            );
          })
        }
        </ul>
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
        <div className="center">
          <div className="btm lives" ref="lives">Lives: { this.state.lives }</div>
          {this.state.status === 'You Won!' || this.state.status === 'You Lost!' ? this.refs.play_again.handleOpen() : ''}
        </div>
      </div>
    );
  }
}
