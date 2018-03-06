import React from 'react';
import Game from './Game';

export default class MainComponent extends React.Component {
	render() {
		return (
			<div>
				<h1 className="center title">Hangman</h1>
				<Game></Game>
			</div>
		)
	}
};
