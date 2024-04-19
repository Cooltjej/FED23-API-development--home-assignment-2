export {}

export interface User {
	id: string
	username: string
	gameId: string
}

export interface Game {
	id: string
	playerOne: string | null
	playerTwo: string | null
	available: boolean
	scoreId?:  string | null
}

export interface GameViewModel extends Game {
	playerOneInfo?: User
	playerTwoInfo?: User
}

export interface Score {
	id: string
	playerOneClick: string[]
	playerTwoClick: string[]
	playerOneScore: number
	playerTwoScore: number
	gameId: string | null
}

export interface Rematch {
	id: string
	gameId: string
	rematch: boolean
}