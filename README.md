### Virus game  

  
You are to create a simple 2-player real-time game where the objective is to quickly click on a virus to eradicate it, with points awarded to the player who reacts the fastest.  

The technologies to be used are Node.js, TypeScript, Socket.io, Prisma, and MongoDB.  

--------------------------------------------------------------------  

### Requirements Specification  

Users should be able to input their username/nickname.  

All calculations regarding the virus's position, determining who receives points, current score, etc., should occur on the server-side.  

In a game round, the virus should appear at the same position simultaneously for both players.  

Display a timer as well as the latest reaction time and the opponent's latest reaction time.  

Multiple games should be able to run simultaneously. When a player connects, a message such as "Waiting for another player..." or similar should be displayed. As soon as two players are connected, a round starts.  
  
--------------------------------------------------------------------  

### Gameplay

Start the game – waiting for an opponent.  

When a player joins, start the game.  

Let the server randomly choose an x/y position with a random delay (1.5-10 seconds) before it appears.  

Measure reaction time. If neither player clicks within 30 seconds, record a click and a reaction time of 30 seconds.  

Post the result to the server, which determines who receives points.  

If fewer than 10 rounds have been played, return to step 3.  

If 10 rounds have been played, proceed to step 8.  

Display the points and the winner. Handle tie results as well.  

--------------------------------------------------------------------  

### Hygiene Requirements  

All source code must be written by yourselves (although it's okay to use the boilerplate provided when accepting the assignment in GitHub Classroom).  

Utilize Node.js, TypeScript, Socket.io, Prisma, and MongoDB.  

Ensure proper version control using git (with meaningful commits and work conducted in feature branches).  

Ensure all source code is correctly indented.  

Backend deployment to Heroku.  

Frontend served through the backend on Heroku.  

Adapt to the browser's width (avoid hard-coded values in the layout).
