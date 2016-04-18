Phaser.Plugin.Transition = function(game, parent){
	Phaser.Plugin.call(this, game, parent);
}

Phaser.Plugin.Transition.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Transition.constructor = Phaser.Plugin.Transition;

Phaser.Plugin.Transition.prototype.screenOut = function(game, nextState, params){
	var background = game.add.image(0, 0, 'transition-back');
	var logo = game.add.sprite(game.world.centerX, -200, 'transition-logo');
	var backTween = game.add.tween(background).to({alpha :1}, 800, Phaser.Easing.Exponential.Out);
	var logoTween = game.add.tween(logo).to({y : game.world.centerY}, 600, Phaser.Easing.Exponential.Out);

	background.alpha = 0;
	logo.anchor.set(0.5);

	logoTween.onComplete.add(function(){
		game.state.start(nextState, true, false, params);
	});	

	backTween.start();
	logoTween.start();
}

Phaser.Plugin.Transition.prototype.screenIn = function(game){
	var background = game.add.image(0, 0, 'transition-back');
	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'transition-logo');
	var backTween = game.add.tween(background).to({alpha :0}, 800, Phaser.Easing.Exponential.In);
	var logoTween = game.add.tween(logo).to({y: -200}, 600, Phaser.Easing.Exponential.In);

	logo.anchor.set(0.5);
	game.inTransition = true;

	logoTween.onComplete.add(function(){
		game.inTransition = false;
	});

	backTween.start();
	logoTween.start();
}