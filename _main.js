/// <reference path="lib/jquery-1.7.1.js" />
/// <reference path="_eGravity.js" />
/// <reference path="_eKeyboard.js" />
/// <reference path="_world.js" />

document.onkeydown = function (e) {
	Game.Keyboard.current = e.keyCode;

	if (Game.Keyboard.current == eKeyBoard.SPACE) {
		Game.settings.paused = !Game.settings.paused;
	}

};

document.onkeyup = function (e) { Game.Keyboard.current = 0 };

Game = {
	settings: {
		velocity: 10,
		defaultDistance: 3,
		loop: 0,
		paused: false,
		event: {
			evt: null,
			init: 0,
			count: 0
		}
	},

	Keyboard: {
		current: 0
	},
	context: null,

	load: function (context) {
		World.load(context);
		Game.init();
	},

	init: function () {
		var bricks = [];
		var cores = ["yellow", "blue", "pink", "red", "orange", "gray", "brown",
					"magenta", "Purple", "Silver", "Gold", "Lime", "white"];
		var x = 1;
		for (i = 1; i <= 7; i++) {
			var y = 0;
			for (j = 1; j <= 20; j++) {
				var brick = new Model();
				brick.UID = i + '' + j;
				brick.name = 'tijolo';
				brick.settings.movable = false;
				brick.settings.width = 63;
				brick.settings.height = 15;
				brick.color = cores[j - 1];
				brick.x = x;
				brick.y = y;

				brick.update = function (colisao) {
					if (colisao) {
						World.Elements.bricks.splice(World.Elements.bricks.indexOf(this), 1);
					}
				}

				brick.draw = function (ctx) {
					ctx.fillStyle = this.color;
					ctx.fillRect(this.x, this.y, this.settings.width, this.settings.height);
				}
				y += 17;

				bricks.push(brick);
			}
			x += 65;
		}

		//criando bola
		bola = new Model();
		bola.name = "Bola";
		bola.UID = 99;
		bola.settings.movable = false; //movel
		bola.settings.width = 9; //largura
		bola.settings.height = 9; //altura
		bola.settings.weight = 0.1; //peso

		//Coordenadas
		bola.x = 240;
		bola.y = 510;
		bola.dx = Game.settings.defaultDistance;
		bola.dy = Game.settings.defaultDistance;

		bola.draw = function (ctx) {
			ctx.fillStyle = "#fff";
			ctx.beginPath();
			ctx.arc(bola.x, bola.y, bola.settings.width, bola.settings.height, Math.PI, true);
			ctx.closePath();
			ctx.fill();
		};

		bola.update = function (obj) {

			var yIsrefresd = false;
			var xIsrefresd = false;

			if (obj) {
				if (obj.UID == 100 /*Plataforma*/) {
					if (bola.y + obj.settings.height <= obj.y + obj.settings.height) {
						this.dy = -this.dy;
						yIsrefresd = true;
					}

					if (Game.Keyboard.current == eKeyBoard.LEFT) {
						this.x -= 10;
						//this.dx = -this.dx;
						//xIsrefresd = this.dy < 0;

						Game.settings.event.evt = function () {
							World.Elements.ball.y += 1;
							Game.draw();
						}
						Game.settings.event.count = 10;
					}

					if (Game.Keyboard.current == eKeyBoard.RIGHT) {
						this.x += 10;
						this.dx = Game.settings.defaultDistance;
						xIsrefresd = true;

						Game.settings.event.evt = function () {
							World.Elements.ball.y -= 1;
							Game.draw();
						}
						Game.settings.event.count = 10;
					}



				}

				if (obj.name == 'tijolo') {

					if (bola.y + obj.settings.height <= obj.y + obj.settings.height) {
						this.dy = -this.dy;
					} else {
						this.dy = Game.settings.defaultDistance;
					}

					if (bola.x + obj.settings.width <= obj.x + obj.settings.width) {
						this.dx = -this.dx;
					} else {
						this.dx = Game.settings.defaultDistance;
					}
				}
			}

			if (!xIsrefresd) {
				if ((this.x + bola.settings.width) >= World.settings.width) {
					this.dx = -this.dx;
				}

				if ((this.x - bola.settings.width) <= 0) {
					this.dx = Game.settings.defaultDistance;
				}
			}

			if (!yIsrefresd) {
				if ((this.y + bola.settings.height) >= World.settings.height) {
					this.dy = -this.dy;
					window.location.reload();
				}

				if ((this.y - bola.settings.height) <= 0) {
					this.dy = Game.settings.defaultDistance;
				}
			}

			this.x += this.dx;
			this.y += this.dy;

		};

		//criando plataforma
		var plataforma = new Model();

		plataforma.name = "Plataforma";
		plataforma.UID = 100;
		plataforma.color = "#000"
		plataforma.settings.movable = false; //movel
		plataforma.settings.width = 100; //largura
		plataforma.settings.height = 20; //altura
		plataforma.settings.weight = 0.1; //peso

		//Coordenadas
		plataforma.x = 190;
		plataforma.y = 530;

		plataforma.draw = function (ctx) {
			ctx.fillStyle = this.color;
			ctx.fillRect(plataforma.x, plataforma.y, plataforma.settings.width, plataforma.settings.height);
		};

		plataforma.update = function (obj) {

			if (Game.Keyboard.current == eKeyBoard.LEFT && plataforma.x > 0) {
				plataforma.x -= 5;
			}

			if (Game.Keyboard.current == eKeyBoard.RIGHT && (plataforma.x + plataforma.settings.width < World.settings.width)) {
				plataforma.x += 5;
			}
		}

		//criando mensagens
		var mensagens = new Model();

		mensagens.name = "Mensagens";
		mensagens.UID = 200;
		mensagens.color = "red"
		mensagens.settings.movable = false; //movel
		mensagens.settings.width = 100; //largura
		mensagens.settings.height = 20; //altura
		mensagens.settings.weight = 0.1; //peso

		//Coordenadas
		mensagens.x = 100;
		mensagens.y = 300;

		mensagens.draw = function (ctx) {

			if (Game.settings.paused) {
				ctx.fillStyle = this.color;
				ctx.font = "40px Arial";
				//ctx.shadowColor = 'black';
				//ctx.shadowBlur = 50;
				//ctx.shadowOffsetX '= 10;
				//ctx.shadowOffsetY = 10;

				ctx.fillText("Game Paused", this.x, this.y);
			}
		};

		World.addElements(bola, bricks, plataforma, mensagens);

		Game.draw();

		var contexto = World.context;

		contexto.fillStyle = "red";
		contexto.font = "bold 80px Arial";

		contexto.fillText("Ready?", 100, 300)

		setTimeout(function () {
			World.clear();
			Game.draw();
			contexto.fillStyle = "red";
			contexto.font = "bold 80px Arial";

			contexto.fillText("5", 210, 300)
		}, 1000);

		setTimeout(function () {
			World.clear();
			Game.draw();
			contexto.fillStyle = "red";
			contexto.font = "bold 80px Arial";

			contexto.fillText("4", 210, 300)
		}, 2000);

		setTimeout(function () {
			World.clear();
			Game.draw();
			contexto.fillStyle = "red";
			contexto.font = "bold 80px Arial";

			contexto.fillText("3", 210, 300)
		}, 3000);

		setTimeout(function () {
			World.clear();
			Game.draw();
			contexto.fillStyle = "red";
			contexto.font = "bold 80px Arial";

			contexto.fillText("2", 210, 300)
		}, 4000);

		setTimeout(function () {
			World.clear();
			Game.draw();
			contexto.fillStyle = "red";
			contexto.font = "bold 80px Arial";

			contexto.fillText("1", 210, 300)
		}, 5000);

		setTimeout(function () {
			World.clear();
			Game.draw();
			contexto.fillStyle = "red";
			contexto.font = "bold 80px Arial";

			contexto.fillText("GO!", 160, 300)
		}, 6000);

		setTimeout(Game.run, 7000);
	},

	run: function () {

		

		if (Game.settings.event.count > 0) {
			if (Game.settings.event.evt != null) {
				Game.settings.event.evt();
				console.log(">> EXECUTING EVENTO... LEFT (" + Game.settings.event.count + ")");
				Game.settings.event.count--;
			}

			if (Game.settings.event.count == 0) {
				console.log(">> END EVENTO");
			}
		}


		if (!Game.settings.paused) {
			Game.update();
			Game.settings.loop++;
		}
		
		Game.draw();

		setTimeout('Game.run()', Game.settings.velocity);

	},

	update: function () {
		World.update();
	},

	draw: function () {
		World.draw();
	}


}