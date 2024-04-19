/**
 * Socket Controller
 */
import { Score } from "@prisma/client";
import { GameViewModel } from "@shared/types/Models";
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "@shared/types/SocketTypes";
import Debug from "debug";
import { Server, Socket } from "socket.io";
import {
	createRematch,
	createScore,
	getGame,
	getRematchByGameId,
	getScore,
	removeRematch,
	startGameRequest,
	updateScore,
	updateScoreOnGame,
} from "../services/gameService";

const debug = Debug("backend:socket_controller");

// Handle a user connecting
export const handleConnection = (
	socket: Socket<ClientToServerEvents, ServerToClientEvents>,
	io: Server<ClientToServerEvents, ServerToClientEvents>
) => {
	debug("🙋 A user connected", socket.id);

	socket.on("startGameRequest", async (username: string, userId: string) => {
		debug("User %s is requesting to play a game", username, userId);
		const game = await startGameRequest(username, userId);
		if (game?.playerOne && game.playerTwo) {
			if (!game.available && game.playerOne && game.playerTwo) {
				startGame(game);
			}
		}
	});

	socket.on(
		"playerClicked",
		async (gameId: string, userId: string, clickTime: string) => {
			const game = await getGame(gameId);
			if (!game) {
				return;
			}

			const score = await getScore(game.scoreId as string);
			if (!score) {
				return;
			}

			if (game?.playerOne === userId) {
				score?.playerOneClick.push(clickTime);
			} else {
				score?.playerTwoClick.push(clickTime);
			}

			const newScore = await updateScore(score);

			if (game.playerOne && game.playerTwo) {
				io.to([game.playerOne, game.playerTwo]).emit(
					"stopTimer",
					userId
				);
			}

			const playerOneClicks = newScore?.playerOneClick.length as number;
			const playerTwoClicks = newScore?.playerTwoClick.length as number;

			if (playerOneClicks === playerTwoClicks && newScore) {
				const playerOneLastClickTime =
					newScore.playerOneClick[playerOneClicks - 1];
				const playerTwoLastClickTime =
					newScore.playerTwoClick[playerTwoClicks - 1];

				if (
					parseInt(playerOneLastClickTime as string) >
					parseInt(playerTwoLastClickTime as string)
				) {
					newScore.playerTwoScore++;
				} else {
					newScore.playerOneScore++;
				}

				if (playerOneClicks && playerTwoClicks === 10) {
					io.to([
						game.playerOne as string,
						game.playerTwo as string,
					]).emit("endGame", newScore as Score);
				} else {
					const position = generatePosition();
					const delay = generateDelay();
					if (game.playerOne && game.playerTwo) {
						io.to([game.playerOne, game.playerTwo]).emit(
							"newRound",
							position,
							delay * 1000,
							newScore as Score
						);
					}
				}
				await updateScore(newScore);
			}
		}
	);

	async function startRematch(game: GameViewModel) {
		const newScore = await createScore(game.id);
		if (game && newScore) {
			game.scoreId = newScore.id;
			await updateScore(newScore);
			await updateScoreOnGame(game, newScore);
			startGame(game);
		}
	}

	socket.on("acceptRematch", async (game: GameViewModel) => {
		const rematch = await getRematchByGameId(game.id);

		if (rematch?.rematch) {
			removeRematch(rematch.id);
			await startRematch(game);
		} else {
			createRematch(game.id);
		}
	});

	function startGame(game: GameViewModel) {
		const position = generatePosition();
		const delay = generateDelay();
		if (!game.available && game.playerOne && game.playerTwo) {
			io.to([game.playerOne, game.playerTwo]).emit(
				"startingGame",
				position,
				game,
				delay * 1000
			);
		}
	}
};

function generateDelay() {
	return Math.floor(Math.random() * 11);
}

function generatePosition() {
	return Math.floor(Math.random() * 9);
}
