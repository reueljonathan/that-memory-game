TMG.states.gameplayState = function(){
	var state = new Phaser.State();
	var addPointTween, subPointTween, shakeRightTween, shakeLeftTween, time;

	state.counter = function(){
		if(time > 0)
			time--;
	}

	state.populateBoard = function(){
		var squareId = 0,
		squareY = [
			this.game.tmgPosition.getY(this.boardBounds, 0.125),
			this.game.tmgPosition.getY(this.boardBounds, 0.375),
			this.game.tmgPosition.getY(this.boardBounds, 0.625),
			this.game.tmgPosition.getY(this.boardBounds, 0.875)
		],
		squareX = [
			this.game.tmgPosition.getX(this.boardBounds, 0.125),
			this.game.tmgPosition.getX(this.boardBounds, 0.375),
			this.game.tmgPosition.getX(this.boardBounds, 0.625),
			this.game.tmgPosition.getX(this.boardBounds, 0.875)
		];
		
		for (var row = 0, item, itemAnimation; row < 4; row++) {
			for (var collumn = 0; collumn < 4; collumn++) {
				item = this.board.create( squareX[collumn], squareY[row], 'square', 0);
				item.inputEnabled = false;
				item.id = squareId++;
				item.events.onInputDown.add( this.click );
				item.events.onInputUp.add( this.release );
				item.anchor.set(0.5);
				itemAnimation = item.animations.add('show', [0,1,2,3,4,3,2,1,0], 24);
				itemAnimation.onComplete.add(function(){
					state.blockSquareAnimation = false;
				});
			}
		}
	}

	state.create = function(){
		var squareId = 0;
		var scale = 10;
		var twitterImage = this.game.add.image(this.game.world.centerX, this.game.world.height - 10, 'twitter-account');
		twitterImage.anchor.set(0.5, 1);
		this.game.stage.backgroundColor = '#FFFFFF';
		this.game.time.advancedTiming = true;
		this.sequenceLength = 1;
		this.simonTurn = false;
		this.preCountingStart = true;
		this.countingStart = false;
		this.blockSquareAnimation = false;
		this.board = this.add.group();

		this.board.y = this.game.tmgPosition.getY(this.game, 0.25);
		this.boardBounds = {y:0, height: 0, width: this.game.world.width};
		this.boardBounds.y = this.board.y;
		this.boardBounds.height = Math.ceil(this.game.world.height * 0.60);

		this.playerPoints = 0;
		this.playerTurnIndex = 0;

		this.startCountSecond = -1;
		this.delta = 0;
		this.round = 1;

		this.disabledInput =  false;

		this.countingMessages = [ '3', '2', '1', 'GO'];

		this.actualShowIndex = -1;

		shakeRightTween = this.game.add.tween(this.board).to({ x: 5 }, 50, null, false, 0, 4);
		shakeLeftTween = this.game.add.tween(this.board).to({ x: 0 }, 50);

		shakeRightTween.chain(shakeLeftTween);


		this.click = function(item, pointer){
			item.animations.play('show');
		}

		this.release = function(item, pointer){
			state.testUserInput(item.id);
		}

		if(this.game.world.width < 450){
			scale = Math.floor((this.game.world.width - (this.game.world.width*0.2)) / 4) / 10;
		}

		this.populateBoard();

		this.reset();
		this.generateSequence(true);

		this.fontCount = this.add.bitmapText(this.game.world.centerX, this.game.tmgPosition.getY(this.game, 0.2), 'font', '', 32);
		this.fontCount.text = '';
		this.fontCount.anchor.set(0.5);

		this.fontTime = this.add.bitmapText(10 , 10, 'font', '', 32);
		this.fontTime.text = time;
		// this.fontTime.anchor.set(0.5, 0);

		this.fontPoints = this.add.bitmapText(this.game.world.width - 10, 10, 'font', '', 32);
		this.fontPoints.text = this.playerPoints || '00';
		this.fontPoints.anchor.set(1, 0);

		this.fontAddPoint = this.add.bitmapText(this.game.world.width - 10, 30, 'font-green', '', 32);
		this.fontAddPoint.text = '+5';
		this.fontAddPoint.alpha = 0;
		this.fontAddPoint.anchor.set(1, 0);
		addPointTween = this.game.add.tween(this.fontAddPoint)
			.to({alpha:0, y: 50}, 200);

		this.fontSubPoint = this.add.bitmapText(this.game.world.width - 10, 30, 'font-red', '', 32);
		this.fontSubPoint.text = '-10';
		this.fontSubPoint.alpha = 0;
		this.fontSubPoint.anchor.set(1, 0);
		subPointTween = this.game.add.tween(this.fontSubPoint)
			.to({alpha:0, y: 50}, 200);

		this.fontRound = this.add.bitmapText(-120, this.game.tmgPosition.getY(this.game, 0.2), 'font', '', 32);
		this.fontRound.text = 'ROUND '+this.round;
		this.fontRound.anchor.set(0.5);
		
		this.roundTweenIn = this.add.tween(this.fontRound).to({x: this.game.world.centerX}, 400, Phaser.Easing.Exponential.Out);
		this.roundTweenOut = this.add.tween(this.fontRound).to({x: this.game.world.width + 100}, 400, Phaser.Easing.Exponential.In);

		this.roundTweenIn.chain(this.roundTweenOut);

		this.roundTweenOut.onComplete.add(function(){
			state.fontRound.x = -120;
			state.simonTurn = true;
		}, this);
		
		this.game.plugin.screenIn(this.game);
	}

	state.update = function(){
		if( !this.game.inTransition ){

			this.fontTime.text = time;

			/* Before Start */
			if(this.preCountingStart)
			{
				this.startCountSecond = this.game.time.totalElapsedSeconds();
				this.preCountingStart = false;
				this.countingStart = true;
			}
			/* Counting */
			else if( this.countingStart )
			{
				if(this.delta === 4)
				{
					this.countingStart = false;
					this.roundTweenIn.start();
					// this.simonTurn = true;
					this.fontCount.destroy();

					this.game.time.events.loop(Phaser.Timer.SECOND, state.counter, this);
				}
				else
				{
					this.fontCount.text = this.countingMessages[this.delta];
					this.delta = Math.floor(this.game.time.totalElapsedSeconds() - this.startCountSecond);
				}			
			} else if( time === 0 ){
				this.disabledInput = true;
				this.game.inTransition = true;
				this.board.forEach(function(item){
					item.inputEnabled = false;
				},this);



				this.game.plugin.screenOut(this.game, 'gameover', {points: this.playerPoints});
			}
			/* Show animation */
			else if( this.simonTurn && !this.blockSquareAnimation)
			{
				if(!this.disabledInput){
					this.disabledInput = true;
					this.board.forEach(function(item){
						item.inputEnabled = false;
					},this);
					
				}
				this.showSequence();
			}
			/* Player turn */
			else if( !this.simonTurn ){
				if(this.disabledInput){
					this.disabledInput = false;
					this.board.forEach(function(item){
						item.inputEnabled = true;
					},this);
					this.playerTurnIndex = 0;
				}
			}
		}
	}


	state.reset = function(){
		this.sequenceLength = 1;
		this.sequence = [];
		time = 60;
	}

	state.generateSequence = function(increaseSequence){
		var newValue = 16;

		if (increaseSequence){
			this.sequence.push(-1);
		}

		for (var i = 0, length = this.sequence.length; i < length; i++) {
			while(newValue > 15 || (i > 0 && newValue === this.sequence[i-1])){
				newValue = Math.floor( Math.random() * 15 );
			}		
			
			this.sequence[i] = newValue;
			newValue = 16;
		};

	}

	state.showSequence = function(){
			this.actualShowIndex++;
			this.blockSquareAnimation = true;

			if(this.actualShowIndex < this.sequence.length){
				var square = this.board.children[ this.sequence[ this.actualShowIndex ] ],
					currentAnim = square.animations.currentAnim;
				if(!currentAnim.isPlaying)
				{
					square.animations.play(currentAnim.name);
				}

			}else{
				this.simonTurn = false;
				this.actualShowIndex = -1;
			}
	}

	state.testUserInput = function(squareId){
		if( this.sequence[this.playerTurnIndex++] === squareId ){
			this.playerPoints += 5;

			this.fontAddPoint.alpha = 1;
			this.fontAddPoint.y = this.fontPoints.y+ 20;
			addPointTween.start();
			
			if(this.playerTurnIndex === this.sequence.length){
				this.playerTurnIndex = 0;

				this.fontRound.text = 'ROUND ' + (++this.round);
				this.roundTweenIn.start();
				this.generateSequence(true);
				this.blockSquareAnimation = false;

				this.board.forEach(function(item){
					item.inputEnabled = false;
				},this);
			}
		}else{ 
			shakeRightTween.repeatCounter = 4;
			shakeRightTween.start();
			this.playerPoints -= 10;
			this.fontSubPoint.alpha = 1;
			this.fontSubPoint.y = this.fontPoints.y+ 20;
			this.playerTurnIndex = 0;
			this.fontRound.text = 'ROUND ' + (this.round);
			this.roundTweenIn.start();
			this.generateSequence();
			this.blockSquareAnimation = false;
			this.board.forEach(function(item){
				item.inputEnabled = false;
			},this);
			subPointTween.start();
		}

		this.fontPoints.text = this.playerPoints.toString().length === 1 ? '0' + this.playerPoints : this.playerPoints.toString();
	}

	state.render = function(){
		// game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
	}

	return state;
}