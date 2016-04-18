TMG.states.gameOverState = function(){
	var state = new Phaser.State();

	state.init = function(params){
		this.playerPoints = params.points || 0;
	};

	state.create = function(){
		this.game.stage.smoothed = false;
		this.game.stage.scale.set(0.5);
		var btn = this.game.add.button(
			this.game.world.centerX, 
			this.game.world.centerY, 
			'btn-start', 
			function(){
				this.game.plugin.screenOut(this.game, 'gameplay');
				// this.game.state.start('gameplay');
			},
			this, 1,0,2);
		var twitterImage = this.game.add.image(this.game.world.centerX, this.game.world.height - 10, 'twitter-account');
		twitterImage.anchor.set(0.5, 1);
		btn.anchor.set(0.5);

		this.fontMessage = this.add.bitmapText(
			this.game.world.centerX, this.game.world.height * 0.1, 
			'font', 'GAME OVER', 36);
	
		this.fontPoints = this.add.bitmapText(
			this.game.world.centerX, this.game.world.height * 0.3, 
			'font', 'YOUR SCORE WAS ' + this.playerPoints, 28);

		this.fontPoints.anchor.set(0.5);
		this.fontMessage.anchor.set(0.5);


		this.game.plugin.screenIn(this.game);
	};

	return state;
}