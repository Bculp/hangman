import React, { Component } from 'react';
import Game from './Game';

export default class MainComponent extends Component {
	render() {
		return (
			<div>
				<h1 className="center title">Merry Christmas Hangman!</h1>
				<Game></Game>
			</div>
		)
	}
};
