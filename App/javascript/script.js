(function() {

    var game = {
        sequence: [],
   	    counter: 0,
   	    mode: 'normal',
        currAnswer: 0,

        init: function() {
            this.cacheDom();
            this.bindEvents();
            this.$gameLevel.text('- -');
            this.currAnswer = 0;
        },

        cacheDom: function() {
            this.$el = $(".game-container");
            //Button Audio
            this.$buttonSound = this.$el.find(".button-sound");
            //level indicator
            this.$gameLevel = this.$el.find(".level");
            //Turn Message
            this.$gameMessage = this.$el.find(".message")
            //Main game dom elements
            this.$gameOverlay = this.$el.find(".overlay");
            this.boxes = this.$el.find(".box");
            //Game Controller
            this.$startButton = this.$el.find(".start");
            this.$strictButton = this.$el.find(".mode");
            this.$resetButton = this.$el.find(".reset");
        },

        bindEvents: function() {
            this.$startButton.click(this.startGame.bind(this));
            this.$strictButton.click(this.strictGame.bind(this));
            this.$resetButton.click(this.resetGame.bind(this));
            this.boxes.click(this.playerClick.bind(this));
        },

        render: function() {
            this.$gameLevel.text(this.counter);
        },

        strictGame: function(e) {
            e.preventDefault();
            this.mode = "Strict";
            this.$buttonSound[0].play();
            this.$strictButton.addClass("hide");
        },

        resetGame: function(e) {
            e.preventDefault();
            this.$buttonSound[0].play();

            this.sequence = [];
            this.counter = 0;
            this.$gameLevel.text('- -');
            this.$gameMessage.text("");

            this.$startButton.removeClass("hide");
            this.$strictButton.removeClass("hide");
            this.$gameOverlay.removeClass("hide");
            this.$resetButton.addClass("hide");

        },

        reset: function() {
            this.$gameLevel.text('- -');
            this.sequence = [];
     	    this.counter = 0;
     	    this.changeTurn();
        },

        playSound: function(id) {
            switch(id){
       		 case 1: this.sounds.sound1.play(); break;
       		 case 2: this.sounds.sound2.play(); break;
       		 case 3: this.sounds.sound3.play(); break;
       		 case 4: this.sounds.sound4.play(); break;
       	   }
        },

        sounds: {
            sound1: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
   		    sound2: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
   		    sound3: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
   		    sound4: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
        },

        glowBox: function(id) {
            $(`#${id}`).addClass("active");

            var blink = setTimeout(function () {
                $(`#${id}`).removeClass("active");
            }, 300);
        },

        startGame: function(e) {
            e.preventDefault();
            this.$buttonSound[0].play();

            this.$startButton.addClass("hide");
            this.$strictButton.addClass("hide");
            this.$gameOverlay.addClass("hide");
            this.$resetButton.removeClass("hide");

            this.render();
            this.changeTurn("Simon Turn");
        },

        changeTurn: function(turn) {
            if (turn === "Player Turn") {
                this.player();
            } else {
                this.simon();
            }
        },

        loss: function() {
            var that = this;

            this.$gameLevel.text("! !");
            this.$gameMessage.text("You Lost the game");

            setTimeout(function() {
     		    that.reset();
     	    }, 500);
        },

        win: function() {
            this.$gameMessage.text("You Won the game");
        },

        timer: function(seq) {
            var speed = [1000, 800, 600, 400];

            if (seq < 5) {
                return speed[0];
            }
            if (seq < 10) {
                return speed[1];
            }
            if (seq < 15) {
                return speed[2];
            }
            if (seq <= 20) {
                return speed[3];
            }
        },

        //********************
        // Simon function
        //********************
        simon: function() {
            this.$gameMessage.text("Computer Turn");
            this.addStep();
        },

        addStep: function() {
            this.sequence.push((Math.floor(Math.random()*4))+1);
            this.counter++
            console.log('sequence ' + this.sequence);
            this.playStep();
        },

        playStep: function() {
            clearInterval(playSeq);
            this.render();
            var x = 0;
            var that = this;

            var playSeq = setInterval(function () {
                var step = that.sequence[x];
                that.glowBox(that.sequence[x]);
                that.playSound(step)

                if((x+1) === that.sequence.length){
                    clearInterval(playSeq);
                    that.changeTurn('Player Turn');

                }else {
                    x++
                }

            }, this.timer(this.sequence.length));
        },

        //********************
        // Player function
        //********************

        player: function() {
            this.$gameMessage.text("Player Turn");
        },

        playerClick: function(e) {
            e.preventDefault();
            var $clicked = parseInt(e.target.id);
            var that = this;
            this.playSound($clicked);

            if($clicked == this.sequence[this.currAnswer]){
                this.currAnswer++;

                if ((this.currAnswer + 1) > this.sequence.length && this.sequence.length < 20) {
                    setTimeout(function () {
                        that.currAnswer = 0;
                        that.changeTurn('Simons Turn');
                    }, 500);

                }else if ((this.currAnswer + 1) > this.sequence.length && this.sequence.length === 20) {
                    this.win();
                }

            }else {
                if (this.mode === "normal") {
                    this.$gameLevel.text("! !");
                    this.$gameMessage.text("Incorrect, Follow the Sequence");

                    setTimeout(function () {
                        that.currAnswer = 0;
                        that.playStep();
                    }, 1500);

                } else {
                    this.loss();
                }
            }
        }
    };

    game.init();
})()
