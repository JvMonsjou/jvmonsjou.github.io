# jvmonsjou.github.io
# wurmsapp

This project attempts to take the amazing dice-rolling game of 'Regenwormen'  a.k.a 'Rainwurms' online. 
The game is a multiplayer, turnbased dice rolling game with the objective to have earned the most wurm tiles when the pile of wurm-tiles is finished.
Each turn a player rolls the 8 dice, in order to obtain the highest cumulative score. Each die with a face value of: wurm, 5, 4, 3, 2, 1.

*In your turn*;
1. Throw  a hand of dice, pick a number to keep, all dice with the face-value 5 are placed to the side.
e.g. you throw three 5's, one 4, two 2's, one 1, and one wurm.  You pick the 5's, and place all three to the side, earning a total of 15 points. 
2. Throw the remaining dice, repeating the previous step. However all dice now having face-value 5 cannot be chosen anymore.
This continues until, either; 
    * you cannot throw anymore - you are out of dice to throw, or 
    * you are dead - the remaining dice are thrown to all face-values that have been chosen allready.
    3. Make sure one of your die on the side is a wurm in order to collect a wurm-tile. 
4. Collect your wurm-tile corresponding to total points of your throw (e.g. you have one wurm (5 points), three 5's (15 points), two 4's (8 points), and two 3's (6 points) = total 29 points). 
When the tile with your points total is allready taken, AND it is on top of an opponents wurm-tile stack, you may take their tile. 
Otherwise take the first available tile (e.g. tile 29 is taken, and not on top of an opponents stack, take the 28 tile).
