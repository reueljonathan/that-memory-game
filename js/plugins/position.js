Phaser.Plugin.Position = function(game, parent){
	Phaser.Plugin.call(this, game, parent);
}

Phaser.Plugin.Position.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Position.constructor = Phaser.Plugin.Position;

Phaser.Plugin.Position.prototype.get = function(parent, x, y){
	if(y == undefined) x = y;

	if(parent.world)
		return new Phaser.Point( Math.ceil( x * parent.world.width), Math.ceil( y * parent.world.height));
	else
		return new Phaser.Point( Math.ceil( x * parent.width), Math.ceil( y * parent.height));
}

Phaser.Plugin.Position.prototype.getX = function(parent, x){
	if(parent.world)
		return Math.ceil( x * parent.world.width);
	else
		return Math.ceil( x * parent.width);
}

Phaser.Plugin.Position.prototype.getY = function(parent, x){
	if(parent.world)
		return Math.ceil( x * parent.world.height);
	else
		return Math.ceil( x * parent.height);
}