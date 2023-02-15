const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, 1024, 576);

const gravity = 0.7;

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: "./Game_Assets/background.png",
});

const Shop = new Sprite({
	position: {
		x: 600,
		y: 128,
	},
	imageSrc: "./Game_Assets/shop.png",
	scale: 2.75,
	framesMax: 6,
});

const player = new Fighter({
	//Player 1
	position: {
		x: 0,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: 0,
		y: 0,
	},
	imageSrc: "./Game_Assets/samuraiMack/Idle.png",
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 157,
	},
	sprites: {
		idle: {
			imageSrc: "./Game_Assets/samuraiMack/Idle.png",
			framesMax: 8,
		},
		run: {
			imageSrc: "./Game_Assets/samuraiMack/Run.png",
			framesMax: 8,
			image: new Image(),
		},
		jump: {
			imageSrc: "./Game_Assets/samuraiMack/Jump.png",
			framesMax: 2,
		},
		fall: {
			imageSrc: "./Game_Assets/samuraiMack/Fall.png",
			framesMax: 2,
		},
		attack1: {
			imageSrc: "./Game_Assets/samuraiMack/Attack1.png",
			framesMax: 6,
		},
		takeHit: {
			imageSrc: "./Game_Assets/samuraiMack/Take Hit.png",
			framesMax: 4,
		},
		death: {
			imageSrc: "./Game_Assets/samuraiMack/Death.png",
			framesMax: 6,
		},
	},
	attackBox: {
		offset: {
			x: 70,
			y: 50,
		},
		width: 195,
		height: 50,
	},
});

const enemy = new Fighter({
	//Player 2
	position: {
		x: 400,
		y: 100,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: -50,
		y: 0,
	},
	imageSrc: "./Game_Assets/kenji/Idle.png",
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		y: 167,
	},
	sprites: {
		idle: {
			imageSrc: "./Game_Assets/kenji/Idle.png",
			framesMax: 4,
		},
		run: {
			imageSrc: "./Game_Assets/kenji/Run.png",
			framesMax: 8,
			image: new Image(),
		},
		jump: {
			imageSrc: "./Game_Assets/kenji/Jump.png",
			framesMax: 2,
		},
		fall: {
			imageSrc: "./Game_Assets/kenji/Fall.png",
			framesMax: 2,
		},
		attack1: {
			imageSrc: "./Game_Assets/kenji/Attack1.png",
			framesMax: 4,
		},
		takeHit: {
			imageSrc: "./Game_Assets/kenji/Take hit.png",
			framesMax: 3,
		},
		death: {
			imageSrc: "./Game_Assets/kenji/Death.png",
			framesMax: 7,
		},
	},
	attackBox: {
		offset: {
			x: -170,
			y: 50,
		},
		width: 170,
		height: 50,
	},
});

console.log(player);

const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	w: {
		pressed: false,
	},

	ArrowRight: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
	ArrowUp: {
		pressed: false,
	},
};

decTimer();

function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.upadate();
	Shop.upadate();
	c.fillStyle = "rgba(255, 255, 255, 0.15)";
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.upadate();
	enemy.upadate();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	//Player Movement
	if (keys.a.pressed && player.lastKey === "a") {
		player.velocity.x = -5;
		player.switchSprite("run");
	} else if (keys.d.pressed && player.lastKey === "d") {
		player.velocity.x = 5;
		player.switchSprite("run");
	} else {
		player.switchSprite("idle");
	}
	// Player 1 Jumping
	if (player.velocity.y < 0) {
		player.switchSprite("jump");
	} else if (player.velocity.y > 0)
		//falling
		player.switchSprite("fall");

	//Player 2  Movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
		enemy.velocity.x = -5;
		enemy.switchSprite("run");
	} else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
		enemy.velocity.x = 5;
		enemy.switchSprite("run");
	} else {
		enemy.switchSprite("idle");
	}

	//Player 2 Jumping
	if (enemy.velocity.y < 0) {
		enemy.switchSprite("jump");
	} else if (enemy.velocity.y > 0)
		//Player 2 falling
		enemy.switchSprite("fall");

	// Detect Collision for enemy
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy,
		}) &&
		player.isAttacking &&
		player.frameCurrent === 4
	) {
		enemy.takeHit();
		player.isAttacking = false;
		document.querySelector("#enemyHealth").style.width = enemy.health + "%";
	}

	// If attack missed
	if (player.isAttacking && player.frameCurrent === 4) {
		player.isAttacking = false;
	}

	// Detect collision for player
	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player,
		}) &&
		enemy.isAttacking &&
		enemy.frameCurrent === 2
	) {
		player.takeHit();
		enemy.isAttacking = false;
		document.querySelector("#playerHealth").style.width = player.health + "%";
	}

	// If attack missed
	if (enemy.isAttacking && enemy.frameCurrent === 2) {
		enemy.isAttacking = false;
	}

	// Ending the game when health is 0
	if (enemy.health <= 0 || player.health <= 0) {
		deterWinner({ player, enemy, timerID });
	}
}

animate();

window.addEventListener("keydown", (event) => {
	if (!player.dead) {
		switch (event.key) {
			case "d":
				keys.d.pressed = true;
				player.lastKey = "d";
				break;

			case "a":
				keys.a.pressed = true;
				player.lastKey = "a";
				break;

			case "w":
				player.velocity.y = -20;
				break;

			case " ":
				player.attack();
				break;
		}
	}

	if (!enemy.dead) {
		switch (event.key) {
			case "ArrowRight":
				keys.ArrowRight.pressed = true;
				enemy.lastKey = "ArrowRight";
				break;

			case "ArrowLeft":
				keys.ArrowLeft.pressed = true;
				enemy.lastKey = "ArrowLeft";
				break;

			case "ArrowUp":
				enemy.velocity.y = -20;
				break;

			case "Enter":
				enemy.attack();
				break;
		}
	}

	// console.log(event.key);
});

window.addEventListener("keyup", (event) => {
	switch (event.key) {
		//Player Keys
		case "d":
			keys.d.pressed = false;
			break;

		case "a":
			keys.a.pressed = false;
			break;

		case "w":
			keys.w.pressed = false;
			break;

		// Enemy Keys
		case "ArrowRight":
			keys.ArrowRight.pressed = false;
			break;

		case "ArrowLeft":
			keys.ArrowLeft.pressed = false;
			break;

		case "ArrowUp":
			keys.ArrowUp.pressed = false;
			break;
	}
	//console.log(event.key);
});
