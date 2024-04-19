import { GameViewModel, Score } from "@shared/types/Models";
import Timer from "./timerService";
import { onPlayerClick } from "../src/main";
let player1Timer = new Timer('virustimeboard1', 30); // Time for player 1
let player2Timer = new Timer('virustimeboard2', 30);
let gameTimer = new Timer('gametimer', 30);
let currentGame: GameViewModel;


export function startPlayerTimers(): void {	
	player1Timer.start();
  player2Timer.start();
}

export function startGameTimer(): void {
	gameTimer.start();
}

export function stopTimer(): string {
	return gameTimer.elapsedTime.toString();
}

export function stopPlayerOneTimer(): void {
  player1Timer.stop();
}

export function stopPlayerTwoTimer(): void {
  player2Timer.stop();
}

export function setCurrentGame(game: GameViewModel): void {
  currentGame = game;
}

export function getCurrentGame(): GameViewModel {
  return currentGame;
}

export function startNewRound(position: number, delay: number ) {
  setTimeout(() => {
    resetAllTimers();
    showVirus(position);
    startPlayerTimers();
    startGameTimer();
  }, delay)
}

export function setRoundDefaultValues() {
  const player1Score = document.querySelector('#player1Score') as HTMLFormElement;
  const player2Score = document.querySelector('#player2Score') as HTMLFormElement;
  const roundCounter = document.querySelector('#roundcounter') as HTMLFormElement;
  player1Score.innerHTML = '0';
  player2Score.innerHTML = '0';
  roundCounter.innerHTML = '1/10';
}

export function updateRoundScores(score: Score) {
  const player1Score = document.querySelector('#player1Score') as HTMLFormElement;
  const player2Score = document.querySelector('#player2Score') as HTMLFormElement;
  const roundCounter = document.querySelector('#roundcounter') as HTMLFormElement;
  console.log(score);
  console.log(score.playerOneScore);
  console.log(score.playerTwoScore);

  player1Score.innerHTML = score.playerOneScore.toString();
  player2Score.innerHTML = score.playerTwoScore.toString();
  roundCounter.innerHTML = (score.playerOneClick.length+1).toString() + '/10';
}

export function showVirus(squareNumber: number) {
  const squares = document.querySelectorAll<HTMLElement>(".square");
  const randomSquare = squares[squareNumber] as HTMLElement;

  randomSquare.classList.add('virus');
  randomSquare.addEventListener('click', onPlayerClick);
}

export function removeVirus() {
  const squares = document.querySelectorAll<HTMLElement>(".square");
  squares.forEach(square => {
      square.classList.remove('virus');
      square.removeEventListener('click', onPlayerClick);
  });
}

function resetAllTimers() {
  player1Timer = new Timer('virustimeboard1', 30);
  player2Timer = new Timer('virustimeboard2', 30);
  gameTimer = new Timer('gametimer', 30);
}










    // scoreDisplay.textContent = `Score: ${score}`;
