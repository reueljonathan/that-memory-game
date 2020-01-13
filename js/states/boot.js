TMG.states.bootState = function(){
	var state = new Phaser.State();

	state.preload = function(){
		this.load.image('loading-sprite',  'assets/loading-sprite.png');
		this.load.image('transition-logo', 'assets/phaser1.png');
		this.load.image('transition-back', 'assets/transition-background.png');

		this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
		this.load.bitmapFont('font-green', 'assets/fonts/font-green.png', 'assets/fonts/font.fnt');
		this.load.bitmapFont('font-red', 'assets/fonts/font-red.png', 'assets/fonts/font.fnt');

		/* menu state */
		this.game.load.spritesheet('btn-start', 'assets/btn/start.png', 107, 60);

		/* gameplay state */
		this.game.load.spritesheet('square', 'assets/square-64.png', 64,64);
	}

	state.create = function(){
		this.game.plugin = this.game.plugins.add(Phaser.Plugin.Transition);
		this.game.tmgPosition = this.game.plugins.add(Phaser.Plugin.Position);

		this.state.start('preload');
	}

	return state;
}
