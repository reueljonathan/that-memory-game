TMG.states.menuState = function(){

	var state = new Phaser.State();

	state.create = function(){
		this.game.stage.backgroundColor = '#FFFFFF';
		var btn = this.game.add.button(
			this.game.world.centerX, 
			this.game.world.centerY + 100, 
			'btn-start', 
			function(){
				this.game.plugin.screenOut(this.game, 'gameplay');
			},
			this, 1,0,0);
		var logoImage = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 100, 'transition-logo');
		
		logoImage.anchor.set(0.5);
		btn.anchor.set(0.5);
		this.game.plugin.screenIn(this.game);
	}

	return state;
}	
