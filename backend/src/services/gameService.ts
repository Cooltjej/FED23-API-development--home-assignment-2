import { Score } from "@prisma/client";
import { Game, GameViewModel, User } from "@shared/types/Models";
import { debug } from "console";
import prisma from "../prisma";
import { createUser } from "./UserService";

export const getGame = (gameId: string) => {
	try {
		return prisma.game.findUnique({
			where: {
				id: gameId,
			},
		});
	} catch (error) {
		debug("Error when fetching game", error);
		throw error;
	}
};

export const createGame = () => {
	try {		
		return prisma.game.create({
			data: {
				playerOne: "",
				playerTwo: "",
				available: true,
			},
		});
	} catch (error) {
		debug("Error when creating game", error);
		throw error;
	}
};

export const getAllAvailableGames = async () => {
	try {
		const games = await prisma.game.findMany();
		const availableGames = games.filter((game) => game.available === true);
		return availableGames;
	} catch (error) {
		debug("Error when getting all games:", error);
		throw error;
	}
};

export const startGameRequest = async (
	usernameFromForm: string,
	userId: string
): Promise<GameViewModel | undefined> => {
	const allGames = await getAllAvailableGames();
	if (!allGames.length) {
		const newGame = await createGame();
		const newScore = await createScore(newGame.id);
		if (newScore) {
			newGame.scoreId = newScore.id;
		}
		const newUser = await createUser({
			username: usernameFromForm,
			id: userId,
			gameId: newGame.id,
		});

		const updatedGame = await joinGame(newUser, newGame);

		return updatedGame;
	} else {
		const newUser = await createUser({
			username: usernameFromForm,
			id: userId,
			gameId: allGames[0].id,
		});

		const updatedGame = await joinGame(newUser, allGames[0]);

		return updatedGame;
	}
};

export const joinGame = async (user: User, game: Game): Promise<GameViewModel | undefined> => {
	try {
		let updatedGame: GameViewModel;
		if (!game.playerOne) {
			updatedGame = await prisma.game.update({
				where: {
					id: game.id,
				},
				data: {
					playerOne: user.id,
					scoreId: game.scoreId
				},
			});

		} else if (!game.playerTwo) {
			updatedGame = await prisma.game.update({
				where: {
					id: game.id,
				},
				data: {
					playerTwo: user.id,
					available: false,
				},
			});
		} else {
			throw new Error('Something went wrong when joining game');
		}
		

		if(updatedGame.playerOne) {
			const playerOne = await prisma.user.findUnique({ 
				where: { 
					id: updatedGame.playerOne
				}
			})
			updatedGame.playerOneInfo = playerOne || undefined;
		}
		
		if (updatedGame.playerTwo) {
			const playerTwo = await prisma.user.findUnique({ 
				where: { 
					id: updatedGame.playerTwo
				}
			})
			updatedGame.playerTwoInfo = playerTwo || undefined;
		}

		return updatedGame;

	} catch (error) {
		debug(
			"Something went wrong when updating db or assigning users",
			error
		);
	}
};

export const createScore = async (gameId: string) => {
	try {		
		return prisma.score.create({
			data: {
				gameId: gameId,
				playerOneScore: 0,
				playerTwoScore: 0,
				playerOneClick: [],
				playerTwoClick: []
			},
		});
	} catch (error) {
		debug(
			"Something went wrong when creating score",
			error
		);
	}
};

export const getScore = async (scoreId: string) => {
	if (!scoreId) {
		return;
	}

	try {
		return prisma.score.findUnique({
			where: {
				id: scoreId
			}
		})
	} catch (error) {
		debug(
			"Something went wrong when fetching score from db",
			error
		);
	}

}
export const updateScore = async (
	score: Score
) => {
	const {id, ...data} = score;
	try {		
		return prisma.score.update({
			where: {
				id: score.id,
			},
			data: {
				...data
			},
		});
	} catch (error) {
		debug(
			"Something went wrong when updating score in db",
			error
		);
	}
};

export const updateScoreOnGame = async (game: Game, score: Score) => {
	try {		
		return prisma.game.update({
			where: {
				id: game.id,
			},
			data: {
				scoreId: score.id
			},
		});
	} catch (error) {
		debug(
			"Something went wrong when updating score in db",
			error
		);
	}
}

export const createRematch = async (gameId: string) => {
	try {		
		return prisma.rematch.create({
			data: {
				gameId: gameId,
				rematch: true
			},
		});
	} catch (error) {
		debug(
			"Something went wrong when accepting rematch",
			error
		);
	}
}

export const getRematchByGameId = async (gameId: string) => {
	try {		
		return prisma.rematch.findFirst({
			where: {
				gameId: gameId
			}
		})
	} catch (error) {
		debug(
			"Something went wrong when fetching rematch by game id",
			error
		);
	}
}

export const removeRematch = async (rematchId: string) => {
	try {		
		return prisma.rematch.delete({
			where: {
				id: rematchId
			}
		})
	} catch (error) {
		debug(
			"Something went wrong when deleting rematch",
			error
		);
	}
}