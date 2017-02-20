/// <reference path="lib/jquery-1.7.1.js" />
/// <reference path="_eGravity.js" />

World = {
	settings: {
		width: 0,
		height: 0,
		gravity: 0,
		hasColision: true
	},

	title: '',
	context: null,
	Elements: {
		ball: null,
		bricks: null,
		plataform: null,
		mensagens: null
	},

	load: function (context) {
		if (context) World.context = context[0].getContext('2d');
		World.settings.width = context.width();
		World.settings.height = context.height();
		World.settings.gravity = eGravity.TERRA;
	},

	update: function () {
		World.Elements.ball.update();
		World.Elements.plataform.update();
		$(World.Elements.bricks).each(function () {
			if (World.collision(World.Elements.ball, this)) {
				this.update(World.Elements.ball);
				World.Elements.ball.update(this);
			} else {
				this.update();
			}

		});

		if (World.collision(World.Elements.ball, World.Elements.plataform)) {
			World.Elements.ball.update(World.Elements.plataform);
			World.Elements.plataform.update(World.Elements.ball);
		}

		Game.settings.velocity = World.Elements.bricks.length / 7;

	},

	collision: function (objeto1, objeto2) {

		//Define os pontos corners dos objetos
		left1 = objeto1.x;
		left2 = objeto2.x;
		right1 = objeto1.x + objeto1.settings.width;
		right2 = objeto2.x + objeto2.settings.width;
		top1 = objeto1.y;
		top2 = objeto2.y;
		bottom1 = objeto1.y + objeto1.settings.height;
		bottom2 = objeto2.y + objeto2.settings.height;

		/*Teste de rejeição para colisão de polígonos circundantes*/
		if (bottom1 < top2) return false;
		if (top1 > bottom2) return false;

		if (right1 < left2) return false;
		if (left1 > right2) return false;

		console.log(objeto1.name + ' colidiu com ' + objeto2.name+' >> QTD TIJOLOS: '+(World.Elements.bricks.length - 1));
		return World.settings.hasColision;

	},

	draw: function () {
		World.clear();
		
		World.Elements.plataform.draw(World.context);
		$(World.Elements.bricks).each(function () {
			if (this.draw) {
				this.draw(World.context);
			}
		});

		World.Elements.ball.draw(World.context);
		World.Elements.mensagens.draw(World.context);

	},

	clear: function () {
		World.context.clearRect(0, 0, World.settings.width, World.settings.height);
	},

	addElements: function (ball, bricks, plataform, mensagens) {
		World.Elements.ball = ball;
		World.Elements.bricks = bricks;
		World.Elements.plataform = plataform;
		World.Elements.mensagens = mensagens;

	}
}

Model = function () {
	this.UID = 0;
	this.name = 'unknown';
	this.image = null;
	this.x = 0;
	this.y = 0;
	this.dx = 0;
	this.dy = 0;
	this.color = null;

	this.draw = null; //functions
	this.update = null; //functions

	this.settings = {
		movable: false,
		width: 0,
		height: 0,
		weight: 0
	};
}