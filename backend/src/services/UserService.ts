
import { Game } from "@prisma/client";
import { User } from "../../../shared/types/Models";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import Debug from "debug";

const debug = Debug("userService");

// export const getUsersInGame = (gameId: string) => {
// 	return prisma.user.findMany({
// 		where: {
// 			gameId,
// 		},
// 	});
// }

export const getUser = (userId: string) => {
	return prisma.user.findUnique({
		where: {
			id: userId,
		},
	});
}


// export const createUser = (data: User) => {
// 	return prisma.user.create({
// 		data,
// 	});
// }

export async function createUser(data: User) {
	try {
		const newUser = await prisma.user.create({
			data
		});
		debug("New user created:", newUser);
		return newUser;
		
	} catch (error) {
		console.log("Creating new user: Error message:", error)
		throw error;
	}
}

// export async function createGame(data: Game) {
// 	try {
// 		const newGame = await prisma.game.create({
// 			data
// 		})
// 		debug("New game created:", newGame)
// 		return newGame;
// 	} catch (error) {
// 		console.log("Creating new game: Error message:", error)
// 		throw error;
// 	}
	
// }


