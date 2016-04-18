game.state = new Phaser.StateManager(game);

game.state.add('gameover', TMG.states.gameOverState());
game.state.add('gameplay', TMG.states.gameplayState());
game.state.add('menu', TMG.states.menuState());
game.state.add('preload', TMG.states.preloadState());
game.state.add('boot', TMG.states.bootState());


game.state.start('boot');