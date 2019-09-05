# Murder-of-the-Universe

<h2>This is the repository of my first Ironhack Web Dev bootcamp project: Coding a game.</h2>

<h3>Concept and inspiration:</h3>
<p><b> Murder of The Universe </b> was inspired by the classic Arcade Game Puzzle Bubble and King Gizzard album with the same name.</p>
<p> In the moment of choosing a game to code, I decided to go for something similar to Puzzle Bubble, since it was one my personal favorites. 
I thought about something that could replace the original "bubbles" and thought about another round shaped objects that would make sense to explode somehow. Eventually, I came out with the idea 
of an evil entity who would explode planets to destroy the World, and that set up the motto for Murder of The Universe.</p>

<h3>Rules:</h3>
<p>The main goal of this puzzle game is to clean up the board. The board is pre-filled with randomly placed planets of different 
types that can be removed by shooting on them. The user controls a cannon that is automatically recharged periodically with a random 
planet to shoot. If the planet shot collides with two or more planets of the same type, they disappear from the board. Otherwise, the planet
shot remains in the board, stick in the place it collided.<p>
<p>From time to time, new planets are added to the board ceiling, pushing the older ones to the bottom of the board.</p>
<p>User looses if one planet reaches the bottom of the board.</p>

<h3>Feature: The Sun </h3>
<p>The Sun is a special type of planet. A Sun collision can be induced just for like any othe rplanet, however, every other Sun 
in board will be removed with it as well, independently of its position </p>

<h3>Game Controls:</h3>
<ul>
<li>Right and Left Arrow keys to move the cannon</li>
<li>Space key to shoot</li>
</ul>

<h3>Game Modes:</h3>
<p>Before starting the game, the user is asked about the difficulty level, in terms of speed and coverage.</p>
<p>There's three levels of speed for new planets appear in the ceiling: "As fast as I can" is the fastest option and "Slowly, so I can enjoy every second" is the slowest.</p>
<p>Additionaly, the user needs to choose between the number of planet types that appear in the board. If he picks the option "DESTROY EVERYTHING" he will have a board filled with nine types of planets,
what reduces considerabily the number of proability of provoking a collision, compared to the option "just a cute little destruction of the basics" that includes only three planet types </p>
<p>This way, the game will be harder as fast is the speed and as high is the number of different planet types.</p>

<h3>Technologies Used:</h3>
<p>HTML5, CSS3 and Javascript</p>

<h3>Improvements to do, bugs and limitations:</h3>
<p>The collision detection was the most complicated part to implement and for sure would need some improvement in order to 
accurately computed where the planet should stay sticked and the detection of the planet borders</p>
<p>The first and the second screen are not responsive and not dimensioned in the same size of the canvas used for the game board </p>

<h3>Future work:</h3>
<p>A new type of special planet - the black hole - that would clean a complete row of planets in the board.</p>
<p>Add a database to store the player's scores, allowing to implement a feature of a ranking display</p>
