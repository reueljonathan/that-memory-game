TMG.states.preloadState = function(){
	var state = new Phaser.State();

	state.preload = function(){
		this.back = this.add.sprite(0,0, 'transition-back');
		this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY,
			'transition-logo');
		this.logo.anchor.set(0.5);


		this.preloadBar = this.add.sprite(this.game.world.centerX, 
		this.game.world.centerY + 100, 'loading-sprite');
		this.preloadBar.anchor.set(0.5);
		
		this.load.setPreloadSprite(this.preloadBar);
	}

	state.create = function(){
		this.game.state.start('menu');
	}

	return state;
}