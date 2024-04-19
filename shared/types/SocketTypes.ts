import { GameViewModel, Score } from './Models';
export { };

// Events emitted by the server to the client
export interface ServerToClientEvents {
	startingGame: (position: number, game: GameViewModel, delay: number) => void;
	sendGame: (game: GameViewModel) => void;
	stopTimer: (playerId: string) => void;
	newRound: (position: number, delay: number, score: Score) => void;
	endGame: (score: Score) => void;
}

// Events emitted by the client to the server
export interface ClientToServerEvents {
    startGameRequest: (username: string, userId: string) => void;
	playerClicked: (gameId: string, userId: string, clickTime: string) => void;
	acceptRematch: (game: GameViewModel) => void;
	startRematch: (gameId: string) => void;
}

