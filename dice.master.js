//GameStates
// mobile version has no enter-button to enter the game
// has no p or r buttons to redo
// mobile version screen is out of bounds


var oldTimeStamp = 0, secondsPassed = 0 , fps = 0;

var StateStack = function () {
    var states = new StateList();
    states.push(new EmptyState());
    this.update = function (){
            var state = states.top();
            if (state){
                    state.update();
            }
    };
    this.render = function (){
            var state = states.top();
            if (state){
                    state.render();
            }
    };
    this.push = function (state) {
            console.log("pushing new state: " + state.name);
            states.push(state);
            console.log("statesList : " + states.print());
            state.onEnter();
    };
    this.pop = function () {
            var state = states.top();
            console.log("statesList : " + states.print());
            console.log("popping state: " + state.name);
            state.onExit();
            return states.pop();

    };

    this.pause = function (){
            var state = states.top();
            if (state.onPause){
            		console.log("pausing state");
                    state.onPause();
            }
    };

    this.resume = function (){
            var state = states.top();
            if (state.onResume){
            	console.log("resuming state");
                    state.onResume();
            }
    };
    this.peek = function (){
    	return states.print();
    }
};

var StateList = function (){
	var states = [];
	this.pop = function(){return states.pop()};
	this.push = function(state) {states.push(state)};
	this.top = function() {return states[states.length-1]};
	this.print = function(){
		var str = "";
    	for (var i = 0; i < states.length; i++){
        	str += states[i].name + " ";
    	}
    	return str;
	};

};

var EmptyState = function() {
		this.name = "EmptyState";
		this.update = function(){}; //gameUpdate
		this.render = function(){}; // gameDraw
		this.onEnter = function(){}; //startGame
		this.onExit = function(){}; // ?
		this.onPause = function(){}; //togglePaused
		this.onResume = function(){}; //togglePaused
	};


var Game = {

	//canvas to draw on
	canvas_width: 0,
	canvas_height: 0,
	canvasElement: null,
	canvas: null,
	rect: null,
	border: 20,

	//the game loop
	timer: null,
	timerID: null, //interval
	FPS: 30,

	timeStamp: 0,
	secondsPassed: 0,
	oldTimeStamp: 0,
	fps: 0,

	paused : false,

	//
	gameMode: new StateStack(),
	gameObjects : null, //1 player, 8 dice

	update: function (timeStamp) {
		//calculate number of seconds passed since last frame
		secondsPassed = (timeStamp - oldTimeStamp)/1000;
		secondsPassed = Math.min(secondsPassed, 0.1);
		oldTimeStamp = timeStamp;
		fps = Math.round(1/secondsPassed);

		this.gameMode.update();
		this.gameMode.render();

		window.requestAnimationFrame(this.update.bind(this));
	},

	startGame: function() {

		console.log("starting Game: startGame");

		this.gameMode.push(new MainMenuState("Start"));

		window.requestAnimationFrame(this.update.bind(this));
	},

	pauseGame: function() {
		//pause timer/ gameloop?
		if (!this.paused){
			this.paused = true;
			this.gameMode.push(new MainMenuState("Paused"));
			window.cancelAnimationFrame(this.update.bind(this));
		}

	},

	resumeGame: function(){
		// resume timer/gameloop
		if (this.paused){
			this.paused = false;
			this.gameMode.pop();
			window.requestAnimationFrame(this.update.bind(this));
		}
	},

	setupCanvas: function(wrapper){
		this.canvasElement = document.getElementById("dice");
		this.canvasElement.width = this.canvas_width = window.innerWidth;
		this.canvasElement.height = this.canvas_height = window.innerHeight;
		this.canvas = this.canvasElement.getContext("2d");
		this.rect = this.canvasElement.getBoundingClientRect();

		//wrapper.appendChild(this.canvasElement);
	},

	init: function(){
		console.log("starting Game: init");

		this.setupCanvas(this.canvasElement);
		//this.timer = 1000/this.FPS;

		img0 = new Image();
		img0.src = "dice.png";
		//img_shadow = new Image();
		//img_shadow.src = "dice_shadow.png";

		img_tile_1 = new Image();
		img_tile_2 = new Image();
		img_tile_3 = new Image();
		img_tile_4 = new Image();
		img_tile_1.src = "1wurms.png";
		img_tile_2.src = "2wurms.png";
		img_tile_3.src = "3wurms.png";
		img_tile_4.src = "4wurms.png";

		//border = 20;
		vecPivot = null;

		rotX = 0;
		rotY = 0;
		rotZ = 0;

		mouseX = 0;
		mouseY = 0;
		mouseDrag = false;

		log = [0];

		var rotSpeed = 22.5;

		//grab all elements by id
	//	for (var i = 0; i < elementIds.length; i++)
			//e[elementIds[i]] = document.getElementById(elementIds[i]);

		//initialize canvas for 2d drawing
		//e.dice.width = window.innerWidth;
		//e.dice.height = 400;
		//canv = e.dice.getContext('2d');
		//rect = e.dice.getBoundingClientRect();
		//canv = Game.canvas;
		//rect = canvas.getBoundingClientRect();
		this.startGame();
	},
};

var State = function() {
		this.name ;
		this.update = function(){}; //updateGame
		this.render = function(){}; // drawGame
		this.onEnter = function(){}; //startGame
		this.onExit = function(){}; // ?
		this.onPause = function(){}; //togglePaused
		this.onResume = function(){}; //togglePaused
	}


// MainMenuState.js
var MainMenuState = function (mainText) {
    this.name = "MainMenuState";

    var canvas = getCanvas(),
        dimensions = getGameDimensions(),
        mylatesttap = 0,
        backgroundColor = "#000",
        textColor = "rgb(0,0,0)", // Starts with black
        colorsArray = [], // our fade values
        colorIndex = 0;

    this.onEnter = function(){
    	console.log(this.name + " : onEnter");

        var i = 1,l=100,values = [];
        for(;i<=l;i++){
            values.push(Math.round(Math.sin(Math.PI*i/100)*255));
        }
        colorsArray = values;

        // When the Enter key is pressed go to the next state
        addEventListener("touchstart",function(e){
			var gameMode = getGameInstance();
		   var now = new Date().getTime();
		   var timesince = now - mylatesttap;
		   if((timesince < 600) && (timesince > 0)){

		    // double tap
		    console.log("double tap : going to next state");
                gameMode.pop();
                gameMode.push(new RegenWormenState());
                canvas.clearRect(0,0,dimensions.width,dimensions.height);

		   }else{
		            // too much time to be a doubletap
		         }

		   mylatesttap = new Date().getTime();

        });
        window.onkeydown = function (e) {
            var keyCode = e.keyCode;
            var gameMode = getGameInstance();
            if (keyCode === 13){
                // Go to next State
                console.log("Pressed Enter : going to next state");
                gameMode.pop();
                gameMode.push(new RegenWormenState());
                canvas.clearRect(0,0,dimensions.width,dimensions.height);

                /** Note that this does not remove the current state
                 *  from the list. it just adds Level1State on top of it.
                 */
            }
            if (keyCode === 80){
            	if (!Game.paused){
            	mainText = "Pause Game - press p to resume" ;
            	gameMode.pause();
            	}
            	else if (Game.paused) {
            		gameMode.pop();
            		Game.paused = false;
            	}
            }

        };
    };

    this.onExit  = function(){
        console.log(this.name + " Exit");
        // clear the keydown event
        window.onkeydown = null;

    };

    this.update = function (){
    	//console.log(this.name + " update");
        // update values
        if (colorIndex == colorsArray.length){
            colorIndex = 0;
        }
        textColor = "rgb("+colorsArray[colorIndex]+","+colorsArray[colorIndex]+","+colorsArray[colorIndex]+")";
        colorIndex++;
    };

    this.render = function (){
    	//console.log(this.name + " render");
        // redraw
        canvas.clearRect(0,0,dimensions.width,dimensions.height);
        canvas.beginPath();
        canvas.fillStyle = backgroundColor;
        canvas.fillColor = backgroundColor;
        canvas.fillRect(0,0,dimensions.width,dimensions.height);
        canvas.fillStyle = textColor;
        canvas.font = "24pt Courier";
        canvas.fillText(mainText, dimensions.width/4, dimensions.height/2);
    };
    this.onResume - function(){

    }
};


var RegenWormenState = function(){
	this.name = "RegenWormenState";
	var gameObjects = getGameObjects(), canvas = getCanvas(), dimensions = getGameDimensions(), rect = getRect();

	this.onEnter = function(){
		console.log(this.name + " : onEnter");

		startRegenWormenGame();
		gameObjects = getGameObjects();
	};
	this.onExit = function(){
		alert("game over");
	};
	this.update = function(){
		//console.log(this.name + " : Update");

		for (let i = 0; i< gameObjects.AllObjects.length; i++){
			gameObjects.AllObjects[i].update(gameObjects);

		}
		// detect collisions
		detectCollisions(gameObjects);
	};
	this.render = function (){
		// clear canvas
		canvas.clearRect(0,0,dimensions.width,dimensions.height);

		// draw all gameObjects
		for (let i = 0; i< gameObjects.AllObjects.length; i++){
			gameObjects.AllObjects[i].draw();
		}
		//draw stack
		gameObjects.Side.draw();
		//gameObjects.TableTiles.draw();
	};
	this.onPause = function(){
		console.log("pause Regenwormen");
		Game.pauseGame();
	};
	this.onResume = function(){
		console.log("resume Regenwormen");
		Game.resumeGame();
	};
};


//window.onload = function () {
    window.getGameInstance = function () {
        return Game.gameMode;
    };

    window.getCanvas = function (){
        return Game.canvas;
    };

    window.getGameDimensions = function() {
        return {
            width: Game.canvas_width,
            height: Game.canvas_height
        };
    };

    window.pauseGame = function (){
    	console.log("pausing game @ window");
        Game.gameMode.pause();
        Game.pauseGame();
    };

    window.resumeGame = function () {
        Game.resumeGame();
        Game.gameMode.resume();
    };

    window.getCanvasElement = function (){
        return Game.canvasElement;
    };

    window.getGameObjects = function(){
    	return Game.gameObjects;
    };

    window.getRect = function(){
    	return Game.rect;
    };

//};

//class of game objects with position (x,y) and velocity (vx,vy)
class GameObject{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.vx = 0;
		this.vy = 0;
		this.mass = 0;
		this.isColliding = false;
	}
}

class Stack extends GameObject {
	constructor(name, startX, startY){
		super();
		this.name = name;
		console.log("new " + this.name + " stack");

		this.x = startX;
		this.y = startY;

		this.items = [];
		this.value = 0;
		this.itemsValues = [];
		this.hasWurm = false;

	}
	//functions
	update(){
		console.log("updating stack");
		if (this.itemsValues.length == 0){
			this.value = 0}
		for (let i = 0; i < this.items.length; i++){
			this.items[i].x = this.x;
			this.items[i].y = this.y + (i+1) * 40;
		}

		if (this.hasWurm){
			gameObjects.TableTiles.items.forEach(element => pickTile(element) );
		}
	}
	draw(){
		// Draw number to the screen
		if (this.name === "side"){
		    Game.canvas.font = '15px Arial';
		    Game.canvas.fillStyle = 'black';
		    Game.canvas.fillText("total: " + this.value, 10, 20);
		    Game.canvas.fillText("FPS: " + fps, 70, 20);

		    if (this.items.length > 0){
		    	//console.log("drawing stack");
		    	for (let i = 0; i < this.items.length; i++){
		    		this.items[i].draw();
		    		}
		    	}
			}
		//create images
		if (this.name === "tableTiles"){

			//Game.canvas.strokeStyle = "black"; //f4f0d2
			//Game.canvas.fillStyle = "rgb(255, 240, 210)";
			for (let i = 0; i < this.items.length; i++){
					this.items[i].draw();
		    }
		}
	}


	// pushes element at top of the stack
	push(element){
		this.items.push(element);
	}
	// return top most element in the stack, and removes it from the stack
	pop(){
	    // Underflow if stack is empty
	    if (this.items.length == 0)
	        return "Underflow";
	    return this.items.pop();
	}
	//return the top most element from the stack but does'nt delete it
	peek(){
		return this.items[this.items.length - 1];
	}
	//make array empty
	isEmpty(){
		return this.items.length == 0;
	}
	printStack(){
		var str = "";
    	for (var i = 0; i < this.items.length; i++){
        	str += this.items[i] + " ";
    	}
    	return str;
	}
}

class Tile extends GameObject {
	constructor(x, y, vx, vy){
		super();
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.width = 30;
		this.height = 50;
		this.mass = 5000;
		this.radius = this.width/2; ///Math.PI;
		this.value = null; // 21 through 36
		this.image = null; // 1wurms.png - 4wurms.png
	}
	update(){
		// move with set velocity
		//this.x += this.vx * secondsPassed * 0.01;
		//this.y += this.vy * secondsPassed * 0.01;

		// border collision
		if (this.x < Game.border)
		{
			this.x = Game.border;
			if (this.vx < 0)
				this.vx = -this.vx*0.5;
		}
		if (this.x > Game.canvas_width-Game.border)
		{
			this.x = Game.canvas_width-Game.border;
			if (this.vx > 0)
				this.vx = -this.vx*0.5;
		}
		if (this.y < Game.border)
		{
			this.y = Game.border;
			if (this.vy < 0)
				this.vy = -this.vy*0.5;
		}
		if (this.y > Game.canvas_height-Game.border)
		{
			this.y = Game.canvas_height-Game.border;
			if (this.vy > 0)
				this.vy = -this.vy*0.5;
		}

	}

	draw(){
		Game.canvas.strokeStyle = "black"; //f4f0d2
		Game.canvas.fillStyle = "rgb(235, 236, 232)";
		roundRect(Game.canvas, this.x-2, this.y-22, this.width, this.height, 5, true);
		Game.canvas.font = '20px Arial';
		Game.canvas.fillStyle = "rgb(120, 40, 66)";
		Game.canvas.fillText(this.value, this.x +2 , this.y -2);
		Game.canvas.drawImage(this.img, this.x  , this.y , 26, 26);

	}
}


//class of dice
class Dice extends GameObject {
	constructor(x, y, vx, vy){
		super(x, y, vx, vy);

		this.name = "die";
		this.value = null; //1 through 6 + 5 (six or wurm counts as 5)
		this.img = new Image();
		this.img.src = "dice (1) (1).png";
		this.img_shadow = new Image();
		this.img_shadow.src = "dice_shadow.png";

		this.x = x;	// x position on the screen at init
		this.y = y;	// y position on the screen at init
		this.z = 0;		// z determines the rotation
		this.vx = vx;	//vx is set at mouse move or random roll
		this.vy = vy;	//vy is set at mouse move or random roll
		this.vz = 0;
		this.va = new Vec(0,0,0); // Angular velocity;

		this.isThrown = false;
		this.isSided = false;
		this.isColliding = false;
		this.width = 46;
		this.height = 46;
		this.radius = this.width/2; ///Math.PI;
		this.mass = 5;

		this.old = {z:0, vz:0, vasize:0};
		this.checkTimer = 0;
		console.log("new die made");

		this.vecX = new Vec(1,0,0);
		this.vecY = new Vec(0,-1,0);
		this.vecZ = new Vec(0,0,1);

	}

	update(gameObjects){

			this.vecZ = this.vecX.cross(this.vecY);
			for (var i = -1; i <= 1; i+=2)
			{
				for (var j = -1; j <= 1; j+=2)
				{
					for (var k = -1; k <= 1; k+=2)
					{
						var point = new Vec(i*this.vecX.x+j*this.vecY.x+k*this.vecZ.x, i*this.vecX.y+j*this.vecY.y+k*this.vecZ.y, i*this.vecX.z+j*this.vecY.z+k*this.vecZ.z);
						if (this.z+point.z < -1)
						{
							var torque = point.cross(new Vec(0,0,1));
							torque.normalize();
							torque = torque.mul((Math.max(0,-this.vz)+Math.max(0, this.va.dot(torque.mul(-1))))*0.5 + 0.1);
							this.va = this.va.add(torque);
							//this.z = -1-point.z;
						}
					}
				}
			}
			this.rotateDice(this.va, this.va.size()/10);

				if (this.z > 10)
					this.z = 10;
				if (this.z > 0)
					this.vz -= 0.16;

				// move with set velocity
				this.x += this.vx * secondsPassed;
				this.y += this.vy * secondsPassed;
				this.z += this.vz ;//secondsPassed;


			// border collision
				if (this.x < Game.border)
				{
					this.x = Game.border;
					if (this.vx < 0)
						this.vx = -this.vx*0.5;
				}
				if (this.x > Game.canvas_width-Game.border)
				{
					this.x = Game.canvas_width-Game.border;
					if (this.vx > 0)
						this.vx = -this.vx*0.5;
				}
				if (this.y < Game.border)
				{
					this.y = Game.border;
					if (this.vy < 0)
						this.vy = -this.vy*0.5;
				}
				if (this.y > Game.canvas_height-Game.border)
				{
					this.y = Game.canvas_height-Game.border;
					if (this.vy > 0)
						this.vy = -this.vy*0.5;
				}

				// z rotation is 0
				if (this.z <= 0)
				{
					this.z = 0;
					if (this.vz < 0)
						this.vz = -this.vz;

					this.vx *= 0.5;
					if (Math.abs(this.vx) < 0.01)
						this.vx = 0;

					this.vy *= 0.5;
					if (Math.abs(this.vy) < 0.01)
						this.vy = 0;

					this.vz *= 0.5;
					if (Math.abs(this.vz) < 0.01)
						this.vz = 0;

					if (this.va.size() < 0.01)
					{
						this.va = new Vec(0,0,0);
						this.stablize;
					}
				}


				if (this.checkTimer == 0)
				{
					if (this.old.z < 0.5 && this.z < 0.5)
						this.z = 0;
					if (Math.abs(this.old.vz) < 0.5 && Math.abs(this.vz) < 0.5)
						this.vz = 0;
					if (this.z == 0 && this.old.vasize < 0.3 && this.va.size() < 0.3)
					{
						this.va = new Vec(0,0,0);
						this.stablize; // stabilize image to come to dice face value

					}
					this.old.z = this.z;
					this.old.vz = this.vz;
					this.old.vasize = this.va.size();
					this.checkTimer = 10;
				}
				else
					this.checkTimer -= 1;
			}

			stabilize (){
			/*
				Since both are projected onto the XY axis or Z axis, the axis direction becomes the same...
				... is like that compared to 0.5
				if (Math.abs(vecX.z) <0.5)
				Shouldn't do this... 1.414 (Math.sqrt(2)) would not know... The best thing is to compare XY and Z projections.
				... still buggy
				If a bug occurs when one axis is projected as it is and the other is projected, it is resolved by projecting it to the other side.
			*/
				this.xy;
				this.xy = new Vec(this.vecX.x, this.vecX.y, 0);
				if (Math.abs(this.vecX.z) <= this.xy.size())
					this.vecX = this.xy.normalize();
				else
					this.vecX = new Vec(0,0,this.vecX.z > 0 ? 1 : -1);

				this.xy = new Vec(this.vecY.x, this.vecY.y, 0);
				if (Math.abs(this.vecY.z) <= this.xy.size() && Math.abs(this.xy.dot(this.vecX)) < 0.01 || this.vecX.z != 0)
					this.vecY = this.xy.normalize();
				else
					this.vecY = new Vec(0,0,this.vecY.z > 0 ? 1 : -1);

			}

	rotateDice(pivot, angle){
		/*
			Move axis with pivot -> Rotate X -> Return axis
			pivot moves in ZXZ rotation
			The axis shift matrix is ​​the Rz2'Ry'Rz1' matrix.
			That is, it is the inverse matrix of the matrix that moves the X-axis as a pivot.
			The rotation angle of Rz1 is a
			The rotation angle of Ry is b
			The rotation angle of Rz2 is called c.
			a comes out when the pivot is projected onto the XY plane.
			b is the angle between the pivot projected on the XY plane and the Z axis and the normal vector of the plane created by the pivot. The normal is obtained from the projected pivot x pivot.
			... This value can be one of three: 90, 0, -90.
			Depending on the Z value of the pivot, the + side is 90, 0 is 0, and-side is -90.
			c is the angle between the pivot projected on the XY plane and the pivot.
		*/

		if (angle == 0)
			return;

		var a, b, c;
		var piv = pivot.clone().normalize();
		var proj = (new Vec(pivot.x, pivot.y, 0)).normalize();
		var normal = proj.cross(piv);

		a = Math.acos(proj.x);
		if (proj.y < 0) a = -a;

		b = piv.z == 0 ? 0 : piv.z > 0 ? Math.PI/2 : -Math.PI/2;

		c = Math.acos(Math.min(Math.max(piv.dot(proj), -1), 1));

		this.vecX = this.vecX.rotateZ(-a).rotateX(-b).rotateZ(-c);
		this.vecX = this.vecX.rotateX(angle);
		this.vecX = this.vecX.rotateZ(c).rotateX(b).rotateZ(a);

		this.vecY = this.vecY.rotateZ(-a).rotateX(-b).rotateZ(-c);
		this.vecY = this.vecY.rotateX(angle);
		this.vecY = this.vecY.rotateZ(c).rotateX(b).rotateZ(a);

		this.vecX.normalize();
		this.vecY.normalize();

	}

	draw(){
		var rot = 0;
		var vecX2, vecY2;
		var s, c;

		/*

	The sprite itself is made to be transformed in the order of Y-axis rotation -> X-axis rotation -> Z-axis rotation.
	On the contrary here, with the object that has already been deformed, rotate the Z axis -> rotate the X axis -> rotate the Y axis to return to the original state.
	Finding the rotation angles of X, Y, and Z If you get this, you can get the sprite that fits it. (Z rotation angle just rotates the sprite itself)
	The range of rotation angle is -180~180, -90~90, -180~180 respectively
	The Z and X rotation angles can be determined through the transformed Y axis.
	If the deformed Y axis is projected onto the XY plane and then normalized, the original Y axis is rotated along the Z axis.
	In addition, the angle between the deformed Y-axis and the XY plane becomes the X-axis rotation angle.
	(When the Y-axis rotates, the Y-axis does not change -> The angle between the Y-axis and the XY plane is created by rotation of the X-axis. The Y-axis is on the ZY plane. Not.)
	Since we found the X, Z rotation angle, Z->X rotation is reversed. Only the Y-axis rotation remains.
	Y-axis rotation can be found immediately with the deformed X-axis. (Because it was initially made with the Y axis rotated)

		*/
		// rotation X axis
		rotX = Math.asin(this.vecY.z)*180/Math.PI;

		vecY2 = new Vec(this.vecY.x, this.vecY.y, 0);

		vecY2.normalize();
		rotZ = Math.acos(vecY2.y)*180/Math.PI;
		if (vecY2.x > 0) rotZ = -rotZ;

		c = vecY2.y;
		s = Math.sin(rotZ*Math.PI/180);
		vecX2 = new Vec(this.vecX.x*c+this.vecX.y*s, -this.vecX.x*s+this.vecX.y*c, this.vecX.z);

		s = this.vecY.z;
		c = Math.sqrt(1-s*s);
		vecX2 = new Vec(vecX2.x, vecX2.y*c+vecX2.z*s, -vecX2.y*s+vecX2.z*c);

		// rotation Y axis
		rotY = Math.acos(vecX2.x)*180/Math.PI;
		if (vecX2.z > 0) rotY = -rotY;

		/*
		if (rotX > 90 || rotX < -90)
		{
			rotX = rotX > 0 ? 180 - rotX : -180 - rotX;
			rotY = (rotY + 180 + 180) % 360 - 180;
			rotZ = (rotZ + 180 + 180) % 360 - 180;
		}
		*/


		 let y = Math.round(rotX / 22.5) + 4;
		 let x = (Math.round(-(rotY-180) / 22.5) + 8) % 16;

		if (y == 0 || y == 8)
			x = 0;
		if (y == 0)
			rot = rotY;
		if (y == 8)
			rot = -rotY;

		// getDiceValue
		this.value = getDiceValue(x, y);

		// Conceptually, the direction of rotation is counterclockwise, but the canvas is rotated clockwise to reverse the direction.
		rot -= rotZ;
		rot = Math.round(rot/22.5)*22.5;

		Game.canvas.drawImage(this.img_shadow, this.x-21 + this.z*4, this.y-18 + this.z*4);

		Game.canvas.save();

		Game.canvas.translate(this.x, this.y);

		Game.canvas.rotate(rot*Math.PI/180);

		Game.canvas.scale(1+this.z/10, 1+this.z/10);

		Game.canvas.translate(-this.x, -this.y);

		//if (this.isColliding == true ){
		//	canvas.drawImage(img0, x*46, y*46, 46, 46, this.x-23, this.y-23, this.width, this.height);
		//}
		//draw dice black when allready in stack
		if (gameObjects.Hand.includes (this) && this.vx == 0 && gameObjects.Side.itemsValues.includes(this.value) && gameObjects.Side.itemsValues.length >= 1 ){
			Game.canvas.drawImage(img0, x*46, y*46, 46, 46, this.x-23, this.y-23, this.width, this.height);
		}
		else {
			Game.canvas.drawImage(this.img, x*46, y*46, 46, 46, this.x-23, this.y-23, this.width, this.height);
			//console.log(this.name, this.value, this.x, this.y, x, y);
		}
		//canvas.font = "10pt Calibri";
        //canvas.fillText(this.name, this.x+25, this.y+25);

/*        // draw circle
        canvas.beginPath();
        canvas.arc(this.x, this.y, this.radius,0, 2*Math.PI);
		if (this.isColliding == true){
			canvas.strokeStyle = "red";
		}
		else {
			canvas.strokeStyle = "blue";
		}
		canvas.stroke();
*/
		Game.canvas.restore();


	}

	Roll(direction){
		if (this.isSided == false){

			var dx, dy, vecDir;

			dx = randomIntFromInterval(0,innerWidth); //Math.random() * innerWidth; // direction.x
			dy = randomIntFromInterval(0,innerHeight); //Math.random() * innerHeight; // direction.y
			vecDir = new Vec(dx, -dy, 0);

			this.vx += dx/10 ;
			this.vy += dy/10 ;

			if (vecDir.size() == 0)
				return;

			vecDir.normalize();
			vecPivot = vecDir.cross(new Vec(0, 0, -1));

			this.rotateDice(vecPivot, vecDir.size()/20);
		}
	}

}


// vector functions, unknown workings tbd
function Vec(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}


Vec.prototype.compare = function(Vec){
		if (this.x != Vec.x || this.y != Vec.y || this.z!= Vec.z){
			return false;
		}
	return true;
};

Vec.prototype.round = function(){
		arr = new Array(2);
		arr[0] = Math.round(this.x); arr[1] = Math.round(this.y); arr[2] = Math.round(this.z);

		for (i in arr){
			if (arr[i]=='-0' ||arr[i]=='+0'  ){
			arr[i] = 0;}
		}
		return vec = new Vec(arr[0], arr[1], arr[2]);
};


Vec.prototype.clone = function(){
	return new Vec(this.x, this.y, this.z);
};

Vec.prototype.size = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
};

Vec.prototype.normalize = function(){
	var size = this.size();

	if (size == 0)
		return this;

	this.x /= size;
	this.y /= size;
	this.z /= size;

	return this;
};

Vec.prototype.add = function(other){
	if (typeof other == "object")
	{
		return new Vec(this.x+other.x, this.y+other.y, this.z+other.z);
	}
	return undefined;
};

Vec.prototype.mul = function(num){
	return new Vec(this.x*num, this.y*num, this.z*num);
};

Vec.prototype.dot = function(other){
	if (typeof other == "object")
	{
		return this.x*other.x + this.y*other.y + this.z*other.z;
	}
	return undefined;
};

Vec.prototype.cross = function(other){
	if (typeof other == "object")
	{
		return new Vec(this.y*other.z - this.z*other.y, this.z*other.x - this.x*other.z, this.x*other.y - this.y*other.x);
	}
	return undefined;
};

Vec.prototype.rotateX = function(angle){
	var sina = Math.sin(angle), cosa = Math.cos(angle);
	return new Vec(this.x, this.y*cosa-this.z*sina, this.y*sina+this.z*cosa);
};

Vec.prototype.rotateY = function(angle){
	var sina = Math.sin(angle), cosa = Math.cos(angle);
	return new Vec(this.x*cosa+this.z*sina, this.y, -this.x*sina+this.z*cosa);
};

Vec.prototype.rotateZ = function(angle){
	var sina = Math.sin(angle), cosa = Math.cos(angle);
	return new Vec(this.x*cosa-this.y*sina, this.x*sina+this.y*cosa, this.z);
};


var rotSpeed = 22.5;


/* Main Function
onLoad get elements from html
define canvas
create gameobjects array (hand of dice, dice that are PuttoSide, stack of tiles, player-tiles, player score)
initiate gameloop
*/

function startRegenWormenGame(){
	console.log("startGame");
	var rect = Game.rect;

	// create dice
	gameObjects = createWorld(1, 8); //1 player, 8 dice
	Game.gameObjects = gameObjects;

	//user interactions (key buttons (space(32) & home(36), mouse up, down, and move )
	addEventListener("keydown", function(e){
		if (e.keyCode == 36) // home
		{
			for (let i = 0; i < gameObjects.Hand.length; i++){
				gameObjects.Hand[i] = new Dice();
			}
		}
		else if (e.keyCode == 32) //spacebar
		{
			//dice.vz = 2;
			for (let i = 0; i < gameObjects.Hand.length; i++){
				gameObjects.Hand[i].vz = 3;
			}
		}
		else if (e.keyCode == 13) // enter
		{
			ThrowHand();
		}
		else if (e.keyCode == 80) // p key
		{
			var gameMode = getGameInstance();
			console.log("pressed p");
			console.log(Game.paused);
			//console.log(gameMode.pause);
			pauseGame();
			console.log(Game.paused);
			//Game.pauseGame(Game.paused);
			//gameMode.push(new MainMenuState("Pause Game - press p to continue"));


		}
		else if (e.keyCode == 73) // r key
		{
			console.log("gameObjects");
			console.log(gameObjects);
			console.log("Hand");
			console.log(gameObjects.Hand);
			console.log("Side.items");
			console.log(gameObjects.Side.items);
			console.log("Side.itemsValues");
			console.log(gameObjects.Side.itemsValues);
		}

		else if (e.keyCode == 82) // r key
		{
			gameObjects.Side.items.forEach(element => {
				element.isSided = false;
				//pop values from itemsValues
				if (element.value == 6){
					gameObjects.Side.value -= 5;
				}
				else {
					gameObjects.Side.value -= element.value;
				}
				//copy dice to hand
				gameObjects.Hand.push(gameObjects.Side.items[gameObjects.Side.items.indexOf(element)]);
			});
			//clear Side and values
			gameObjects.Side.items = [];
			gameObjects.Side.itemsValues = [];
		}


		/*
		switch(e.keyCode)
		{
			case 37: // LEFT
				rotY -= rotSpeed;
				break;
			case 38: // UP
				rotX -= rotSpeed;
				break;
			case 39: // RIGHT
				rotY += rotSpeed;
				break;
			case 40: // DOWN
				rotX += rotSpeed;
				break;

			case 81: // Q
				rotZ += rotSpeed;
				break;
			case 87: // W
				rotZ -= rotSpeed;
				break;
		}
		rotX = Math.max(Math.min(rotX, 90), -90);
		rotY = (rotY + 360 + 180) % 360 - 180;
		rotZ = (rotZ + 360 + 180) % 360 - 180;
		*/
	});

	addEventListener("touchstart",function(e){
	});
	addEventListener("touchend",function(e){
	});
	addEventListener("touchmove",function(e){
		//ThrowHand();
	});
	addEventListener("mousedown", function(e){
		mouseDrag = true;
		var {x, y} = getClickCoordinates(rect, e);
	    var ClickedObject = Clicked(x, y);

	    if (typeof ClickedObject === "object" && ClickedObject !== null){
	    	//alert("Value = " + ClickedObject.value);
	    	if (gameObjects.Hand.includes(ClickedObject)){
	    		if (ClickedObject.isThrown == false){
	    			for (let i = 0;i < gameObjects.Hand.length;i++){
						gameObjects.Hand[i].vz = 3;}
						console.log(ClickedObject.isThrown);
	    		}
	    		else if (ClickedObject.isThrown){
	    			putToSide(ClickedObject);
	    		}
	    	}
			else if(gameObjects.Side.items.includes(ClickedObject)){
				mouseDrag = false;
				putInHand(ClickedObject);
			}
			else if(gameObjects.TableTiles.items.includes(ClickedObject)){
				mouseDrag = false;
				alert(ClickedObject.value)

			}
	    }


/*
			for (let i = 0;i < gameObjects.Hand.length;i++){
				gameObjects.Hand[i].vz = 3;

				//distance dice to mouse
				var dist = distance(gameObjects.Hand[i].x, gameObjects.Hand[i].y, x, y);
				var distX = gameObjects.Hand[i].x - x;
				var distY = gameObjects.Hand[i].y - y;

				gameObjects.Hand[i].x -= distX*0.1;
				gameObjects.Hand[i].y -= distY*0.1;
				}
*/


	});

	addEventListener("mouseup", function(e){
		var {x, y} = getClickCoordinates(rect, e);
	    var ClickedObject = Clicked(x, y);
		mouseDrag = false;
		if (ClickedObject != undefined){
			ClickedObject.isTrown = true;
		}
		//move = false;
	});

	addEventListener("mousemove", function(e){
		if (!mouseDrag)
			return;
		var dx, dy, vecDir;
		var {x, y} = getClickCoordinates(rect, e);

		dx = e.clientX - mouseX;
		dy = e.clientY - mouseY;
		for (let i = 0;i < gameObjects.Hand.length;i++){
			gameObjects.Hand[i].vz = 3;}

		for (let i = 0;i < gameObjects.Hand.length;i++){
			//gameObjects.Hand[i].vz = 3;

			//distance dice to mouse
			//var dist = distance(gameObjects.Hand[i].x, gameObjects.Hand[i].y, x, y);
			var distX = gameObjects.Hand[i].x - x;
			var distY = gameObjects.Hand[i].y - y;
			//console.log(gameObjects.Hand[i].name, gameObjects.Hand[i].x, gameObjects.Hand[i].y,  distX, distY, gameObjects.Hand[i].vx, gameObjects.Hand[i].vy );

			//gameObjects.Hand[i].x -= distX*0.05;
			//gameObjects.Hand[i].y -= distY*0.05;
			vecDir = new Vec((dx * distX) , -(dy * distY) , 0);

			gameObjects.Hand[i].vx -= distX/10;
			gameObjects.Hand[i].vy -= distY/10;

			if (vecDir.size() == 0)
			return;

			vecDir.normalize();
			vecPivot = vecDir.cross(new Vec(0, 0, -1));

			gameObjects.Hand[i].rotateDice(vecPivot, -vecDir.size()/20);
			gameObjects.Hand[i].isThrown = true;
			//gameObjects.Hand[i].x -= distX*0.1;
			//gameObjects.Hand[i].y -= distY*0.1;
		}



		//ThrowHand();

	/*	if (move === true){
		//const {top, left } = rect;
		//const mouse = {x: e.clientX - left, y: e.clientY - top};
			e.preventDefault();
		    var x = e.clientX - rect.left;
		    var y = e.clientY - rect.top;
		    //console.log("x" + x,"y" + y);
		    var ClickedObject = Clicked(x, y);
		    //console.log(ClickedObject);
		    if (typeof ClickedObject === "object" && ClickedObject !== null){
		    	ClickedObject.x = x;
		    	ClickedObject.y = y;
		    }
	    }*/
		//console.log(mouse);
		//for (let i = 0; i < gameObjects.Hand.length; i++){
			//if (distance(mouse.x, mouse.y, gameObjects.Hand[i].x, gameObjects.Hand[i].y) - gameObjects.Hand[i].radius * 2 < 0){
					//gameObjects.Hand[i].isColliding = true;
					//console.log(gameObjects.Hand[i].name + ' has collided');
					//console.log(gameObjects);
			//}
		//}
	});
/*
	addEventListener("mouseover", function(e){
		e.preventDefault();
	    var x = e.clientX - rect.left;
	    var y = e.clientY - rect.top;

	    for (let i = 0; i< Object.keys(gameObjects).length; i++){
			if(x>(gameObjects[i].x-23) && x<(gameObjects[i].x+23) && y>(gameObjects[i].y-23) && y<(gameObjects[i].y+23) ){ //780 = 580+(200) <- image width
	        	alert("Value" + gameObjects[i].value);
		}
	}

	});
*/
}

/*
function drawLog()
{
	var max, min;
	canvas.lineWidth = 1;
	canvas.strokeStyle = "black";
	canvas.beginPath();
	canvas.moveTo(0, 150-log[0]*3);
	max = min = log[0];
	for (var i = 1; i < log.length; i++)
	{
		canvas.lineTo(i*3, 150-log[i]*3);
		if (max < log[i])
			max = log[i];
		if (min > log[i])
			min = log[i];
	}
	canvas.stroke();
	canvas.fillStyle = "black";
	canvas.font = "12px sans-serif";

	canvas.fillText(max, 5, 150-3);
	canvas.fillText(min, 5, 150+15);
}
*/
// create all objects in game
function createWorld(numberofPlayers, numberofDice){
	console.log("create world");
	let players = numberofPlayers;
	let hand = createHandOfDice(numberofDice);
	let side = new Stack("side", 40,30);
	let tableTileStack = createTableTiles();
	let allObjects = tableTileStack.items.concat(hand);

	gameObjects = {Players: players, Hand: hand, Side: side, TableTiles: tableTileStack, AllObjects:allObjects};
	console.log(gameObjects);
	return gameObjects;
}

function createTableTiles(){
	var tableTiles = new Stack("tableTiles", 0,0);

//push new tile to stack.items
	for (let i = 21; i < 36+1; i++){
		var tile = new Tile(150 + (i-21)*40,40,0,0);
		tile.value = i;
		if (i < 25){
			tile.img = img_tile_1;
		}
		else if(i < 29){
			tile.img = img_tile_2;
		}
		else if(i < 33){
			tile.img = img_tile_3;
		}
		else if(i < 37){
			tile.img = img_tile_4;
		}
		tableTiles.items.push(tile);
	}
	//console.log(tableTiles);
return tableTiles;

}


//create hand of dice
function createHandOfDice(n){
	var hand = new Array(n);
	  for (var i = 0; i < n; ++i) {
		hand[i] = new Dice(0,0,0,0);
	    hand[i].name = "die" + (i+1);
		if (i < 4){
	    	hand[i].x = 80;
	    	hand[i].y = (100 + (i*50));
	    	}
	    if (i >= 4){
	    	hand[i].x = 150;
	    	hand[i].y = (100 + ((i-4)*50));
	    	}
		}
  return hand;
}


function ThrowHand(){
	console.log("throwing hand");
	for (let i = 0; i <gameObjects.Hand.length;i++){
		if (gameObjects.Hand[i].isSided == true){
			continue;
		}
		else{
			gameObjects.Hand[i].vz = 3;
			gameObjects.Hand[i].Roll();
			gameObjects.Hand[i].isThrown = true;
		}
	}
}

function getDiceValue(x,y){
	//here the face-value of the dice is ready?
			//6 = x: 8, y: 4
			//5 = x: 12, y:4
			//4 = x: 0, y:0
			//3 = x: 0, y:8
			//2 = x: 4, y:4
			//1 = x: 0, y: 4

		if (x == 0 && y == 4){
			return 1;
		}
		else if (x == 4 && y == 4){
			return 2;
		}
		else if (x == 0 && y == 8){
			return 3;
		}
		else if (x == 0 && y == 0){
			return 4;
		}
		else if (x == 12 && y == 4){
			return 5;
		}
		else if (x == 8 && y == 4){
			return 6; // wurm // in normal game value = 6
		}
}

function pickTile(tile){
if (gameObjects.Side.value == tile.value){
		alert("you can pick a tile, if you want")

	}
}


function putInHand(die){
	if (gameObjects.Side.itemsValues.includes(die.value)){
		countDiceInArray(die, gameObjects.Side.items).forEach((element) => {
			element.isSided = false;
			//pop values from itemsValues
			if (element.value == 6){
				element.value -= 5;
			}
			else {
				gameObjects.Side.value -= element.value;
			}
			//copy dice to hand
			gameObjects.Hand.push(element);
			gameObjects.Side.items.splice(gameObjects.Side.items.indexOf(element), 1);// remove from side
		});
	gameObjects.Side.itemsValues.splice(gameObjects.Side.itemsValues.indexOf(die.value), 1);// remove from itemsValues
	gameObjects.Side.update();
	}
}

function putToSide(die){
	if (die.value == undefined) return;
	// if hand equals 1 and value is already taken
	if (gameObjects.Hand.length == 1 ){
		alert("game over");
	}

	// if value of dice is already taken => do nothing
	if (gameObjects.Side.itemsValues.includes(die.value) || die.isSided === true){
		console.log("you can not pick this dice");
		console.log(gameObjects.Side.itemsValues);
		return;
	}
	else { // if dice is not yet sided => put to side
		//transfer values etc of this dice
		gameObjects.Side.itemsValues.push(die.value);

		countDiceInArray(die, gameObjects.Hand).forEach((element) => {
			//console.log(element);
			element.isSided = true;

			gameObjects.Side.items.push(element); //place in side stack
			if (element.value == 6){
				element.value = 5;
				gameObjects.Side.hasWurm = true;
			}
			gameObjects.Side.value += element.value;
			console.log("adding " + element.value + " to Score" );
			gameObjects.Hand.splice(gameObjects.Hand.indexOf(element), 1);// remove from hand
		});
		gameObjects.Side.update();
	}
}

//loop through array of dice and return array of dice with the same value
function countDiceInArray(die, arr){
	var DiceInArray = [die];
	for (let i = 0; i < arr.length; i++){
		if (die !== arr[i] && die.value == arr[i].value ){ //&& arr[i].isSided == false
				DiceInArray.push(arr[i]);
		}
		if (!arr[i].isThrown){
			arr[i].isThrown = true;
		} else if (arr[i].isThrown){
			arr[i].isThrown = false;
		}
	}
	return  DiceInArray;
}

function timeStamp() {
  return window.performance && window.performance.now ? window.performance.now() : Date.now() / 1000 | 0;
}

function detectCollisions(gameObjects){
	gameObjects.AllObjects = gameObjects.TableTiles.items.concat(gameObjects.Hand);
	var obj1;
	var obj2;

	// reset collision state of all objects
	for (let i = 0; i < gameObjects.AllObjects.length; i++){
		gameObjects.AllObjects[i].isColliding = false;
	}
	// start checking for collisions
	for (let i = 0; i < gameObjects.AllObjects.length; i++){
		obj1 = gameObjects.AllObjects[i];

		for(let j = i+1; j < gameObjects.AllObjects.length; j++){
			obj2 = gameObjects.AllObjects[j];

			//if (distance(this.x, this.y, gameObjects.Hand[i].x, gameObjects.Hand[i].y) - this.radius * 2 < 0){
			if (distance(obj1.x, obj1.y, obj2.x, obj2.y) - obj1.radius * 2 < 0 ){

				obj1.isColliding = true;
				obj2.isColliding = true;

//How to Code implementation
			const xVelocityDiff = obj1.vx - obj2.vx;
			const yVelocityDiff = obj1.vy - obj2.vy;

			const xDist = obj2.x - obj1.x;
			const yDist = obj2.y - obj1.y;

			const obj1Velocity = {x: obj1.vx, y: obj1.vy};
			const obj2Velocity = {x: obj2.vx, y: obj2.vy};

			// prevent accidental overlap of objects
			if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0){
				//console.log("bounce")

				//grab angle between two colliding objects
				const angle = -Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
				//store mass in var for better readability in collision equation
				const m1 = obj1.mass;
				const m2 = obj2.mass;
				//angular velocity before equation stored in Vec

				const u1 = rotate(obj1Velocity, angle);
				const u2 = rotate(obj2Velocity, angle);

				//velocity after collision
				const v1 = {x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y};
				const v2 = {x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y};


				//Final velocity after rotating axis back to original location
				const vFinal1 = rotate(v1, -angle);
				const vFinal2 = rotate(v2, -angle);
				// swap object velocity for realistic bounce effect
				obj1.vx = vFinal1.x;
				obj1.vy = vFinal1.y;
				//console.log(obj1.vx);
				obj2.vx = vFinal2.x;
				obj2.vy = vFinal2.y;
			}
		}
	}
			// dice collision reaction solid object boundary


// jips try-out

					//direction vector (vCollisionNorm)
				//let vCollisionX = obj1.vecX.cross(obj2.vecX);
				//let vCollisionY = obj1.vecY.cross(obj2.vecY);
				//let distanceX = vCollisionX.size();
				//let vCollisionNormX = vCollisionX.normalize();
				//let vRelativeVelocityX = new Vec(obj1.vx - obj2.vx, obj1.vy - obj2.vy, 0);
				//let speedX = vRelativeVelocity.dot(vCollisionNorm);

/*
// spicyyoghurt implementation
				let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
				let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
				let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};

				// speed of collision
				let vRelativeVelocity = {x: obj1.vx - obj2.vx,y: obj1.vy - obj2.vy};
				let speed = (vRelativeVelocity.x *vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y)/10;
				console.log("speed of collision : " + speed);
				if (speed <= 0) {
					break;
				}
				else{
					obj1.vx -= (speed * vCollisionNorm.x);
					obj1.vy -= (speed * vCollisionNorm.y);
					obj2.vx -= (speed * vCollisionNorm.x);
					obj2.vy -= (speed * vCollisionNorm.y);
				}
*/			//}
		//}
	}
}

function rotate(velocity, angle){
	const rotatedVelocities = {
		x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
		y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
	};
	return rotatedVelocities;
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2){
		//check x and y for overlap
		if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
			return false;
		}
		return true;
	}

function circleIntersect(x1, y1, r1, x2, y2, r2){
	// calculate the distance between the two circles
	let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

	//when the distance is smaller or equal to the sum of the two radius, the circle touch or overlap
	return squareDistance <= ((r1 + r2) * (r1 + r2));
}

function distance(x1, y1, x2, y2){
	const xDist = x2 - x1;
	const yDist = y2 - y1;
	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function getClickCoordinates(rect, e){
	var x;
	var y;
	if (e.pageX || e.pageY) {
	  x = e.pageX;
	  y = e.pageY;
	}
	else {
	  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	const {top, left } = rect; // element.getBoundingClientRect ();
	//const {clientX, clientY } = e;

	return {
		x: x - left,
		y: y - top
	};
}

function Clicked(x, y){
	//loop through all hand objects
	for (let i = 0; i < gameObjects.Hand.length; i++){
		if(x > (gameObjects.Hand[i].x-23) && x < (gameObjects.Hand[i].x+23) && y > (gameObjects.Hand[i].y-23) && y < (gameObjects.Hand[i].y+23) ){ //780 = 580+(200) <- image width
	        return gameObjects.Hand[i];
		}
	}
	//loop through all side objects
	for (let i = 0; i < gameObjects.Side.items.length; i++){
		if(x > (gameObjects.Side.items[i].x-23) && x < (gameObjects.Side.items[i].x+23) && y > (gameObjects.Side.items[i].y-23) && y < (gameObjects.Side.items[i].y+23) ){ //780 = 580+(200) <- image width
	        return gameObjects.Side.items[i];
		}
	}
	// loop through tabletiles
	//roundRect(Game.canvas, this.x-2, this.y-22, this.width, this.height, 5, true);
	for (let i = 0; i < gameObjects.TableTiles.items.length; i++){
		if(x > (gameObjects.TableTiles.items[i].x-2) && x < (gameObjects.TableTiles.items[i].x+28) && y > (gameObjects.TableTiles.items[i].y-22) && y < (gameObjects.TableTiles.items[i].y+28) ){ //780 = 580+(200) <- image width
        	return gameObjects.TableTiles.items[i];
		}
		//if (rectIntersect(gameObjects.TableTiles.items[i].x, gameObjects.TableTiles.items[i].y,gameObjects.TableTiles.items[i].width, gameObjects.TableTiles.items[i].heigth, x, y, 1, 1)){
		//	return gameObjects.TableTiles.items[i];
		//}
	}
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}



