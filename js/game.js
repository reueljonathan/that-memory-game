'use strict';

const width = ( window.innerWidth < 415 ? window.innerWidth : 415 );
const height = ( window.innerHeight < 800 ? window.innerHeight : 800 );

const game = new Phaser.Game(
  width, 
  height, 
  Phaser.CANVAS, 
  'game-container', 
  null, 
  false, 
  false);

function startGame(){
	game.state.start('boot');
}
