import { GameViewModel, Score } from '@shared/types/Models';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/SocketTypes';
import { Socket, io } from 'socket.io-client';
import { getCurrentGame, removeVirus, setCurrentGame, setRoundDefaultValues, 
  showVirus, startGameTimer, startNewRound, startPlayerTimers, stopPlayerOneTimer, 
  stopPlayerTwoTimer, stopTimer, updateRoundScores } from '../public/game';
import './assets/scss/style.scss';

const SOCKET_HOST = import.meta.env.VITE_SOCKET_HOST;
const startGameForm = document.querySelector('#startGameForm') as HTMLFormElement;
const gameButton = document.querySelector('#gamebutton') as HTMLButtonElement;
const playerNameInput = document.querySelector('#user') as HTMLInputElement;
let userId: string | undefined;

console.log('Connecting to Socket.IO Server at:', SOCKET_HOST); // Connect to Socket.IO Server
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_HOST);

socket.on('connect', () => {
  console.log('💥 Connected to the server', SOCKET_HOST);
  console.log('🔗 Socket ID:', socket.id);
});

const mainGameElement = document.getElementById('maingame');
if (mainGameElement) {
  mainGameElement.style.display = 'none';
}

startGameForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  userId = socket.id;
  const usernameFromForm = playerNameInput.value;
  
  if (!usernameFromForm || !userId) {
    return;
  } else {
    // Present waiting for opponent
    gameButton.innerText = 'Waiting for opponent...';
    gameButton.classList.toggle('animate-text', true);
    gameButton.disabled = true;
    socket.emit("startGameRequest", usernameFromForm, userId);
    if (mainGameElement) {
      mainGameElement.style.display = "block";
    }
  }
});

socket.on('startingGame', (position: number, game: GameViewModel, delay: number): void => {
  const usernamePlayerOne = document.getElementById('usernameplayer1') as HTMLFormElement;
  usernamePlayerOne.innerHTML = `${game.playerOneInfo?.username}`

  if (game.playerTwo) {
    const usernamePlayerTwo = document.getElementById('usernameplayer2') as HTMLFormElement;
    usernamePlayerTwo.innerHTML = `${game.playerTwoInfo?.username}`
  }

  const modal = document.getElementById('modal');
  if (modal) {
    const waiting = document.getElementById('waiting');
    if (waiting) {
      waiting.style.display = 'none';
    }
    modal.style.display = 'none';
  }

  setRoundDefaultValues();
  gameButton.innerHTML = 'Ongoing game';

  setTimeout(() => {
    setCurrentGame(game);
    showVirus(position);
    startPlayerTimers();
    startGameTimer();
    if (mainGameElement) {
      mainGameElement.style.display = 'block';
    }
  }, delay)
});

socket.on('stopTimer', (playerId): void => {
  const currentGame = getCurrentGame();
  if (playerId === currentGame.playerOne) {
    stopPlayerOneTimer();
  } else {
    stopPlayerTwoTimer();
  }
})

socket.on('newRound', (position: number, delay: number, score: Score) => {
  updateRoundScores(score);
  startNewRound(position, delay);
})

socket.on('disconnect', () => {
  // Listen for when server got tired of us
  console.log('💀 Disconnected from the server:', SOCKET_HOST);
});

socket.io.on('reconnect', () => {
  // Listen for when we're reconnected (either due to our or the servers connection)
  console.log('🍽️ Reconnected to the server:', SOCKET_HOST);
  console.log('🔗 Socket ID:', socket.id);
});

socket.on('endGame', (score: Score) => {
  updateRoundScores(score);
  const modal = document.getElementById('modal');
  if (modal) {
    modal.style.display = 'block';
    const endScore = document.getElementById('score');
    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');

    if (yesButton) {
      yesButton.onclick = rematch;
    }

    if (noButton) {
      noButton.onclick = reloadPage;
    }

    if (score.playerOneScore === score.playerTwoScore) {
      (endScore as HTMLElement).innerHTML = `😱 It's a draw!!!!! 😱`;
    } else {
      const winner = getWinner(score);
      (endScore as HTMLElement).innerHTML = `The winner is ${winner}!`;
    }
  }
})

function reloadPage() {
  location.reload();
}

function rematch() {
  const waiting = document.getElementById('waiting');
  if (waiting) {
    waiting.style.display = 'block';
  }
  socket.emit('acceptRematch', getCurrentGame());
}

function getWinner(score: Score) {
  const game = getCurrentGame();

  if (score.playerOneScore > score.playerTwoScore) {
    return game['playerOneInfo']?.username;
  } else {
    return game['playerTwoInfo']?.username;
  }
  
}

export function onPlayerClick() {
  onVirusClick();
}

export function onVirusClick(): void {
  const currentGame = getCurrentGame();
	if(socket.id){
		const userId = socket.id;
		const clickTime = stopTimer();
    removeVirus();
		socket.emit("playerClicked", currentGame.id, userId, clickTime);
	}
}
