'use strict';

var game = new Phaser.Game('100', '100', Phaser.CANVAS, '', null, false, false);

function startGame(){
	game.state.start('boot');
}