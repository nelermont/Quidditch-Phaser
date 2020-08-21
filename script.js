let gameScene = new Phaser.Scene('Game');

let config = {
   type: Phaser.CANVAS,
   width: 1000,
   height: 500,
   scene: gameScene

};

let game = new Phaser.Game(config);

let audio = new Audio();
audio.src = 'assets/audio/SoundEffects/themeMusic.mp3';
audio.loop = true;
let audioWin = new Audio();
audioWin.src = 'assets/audio/SoundEffects/win.mp3';

gameScene.init = function () {
   this.playerSpeed = 1.5;
   this.enemyMaxY = 280;
   this.enemyMinY = 80;
};

gameScene.preload = function () {
   this.load.image('background', 'assets/bg.jpeg');
   this.load.image('harry', 'assets/222.png');
   this.load.image('slytherin', 'assets/333.png');
   this.load.image('snitchImg', 'assets/snitch.png');
};

gameScene.create = function () {
   audio.play();
   let bg = this.add.sprite(0, 0, 'background');
   bg.setOrigin(0, 0);

   this.harry = this.add.sprite(40, this.sys.game.config.height / 2, 'harry')

   this.snitchImg = this.add.sprite(this.sys.game.config.width - 30, this.sys.game.config.height / 2, 'snitchImg');
   this.snitchImg.setScale(0.1);

   this.enemies = this.add.group({
      key: 'slytherin',
      repeat: 6,
      setXY: {
         x: 130,
         y: 100,
         stepX: 130,
         stepY: 200
      }
   });

   Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
      enemy.speed = Math.random() * 2 + 1;
   }, this);

   this.isPlayerAlive = true;
};

gameScene.update = function () {
   if (!this.isPlayerAlive) {
      return;
   }
   if (this.input.activePointer.isDown) {
      this.harry.x += this.playerSpeed;
   }

   if (Phaser.Geom.Intersects.RectangleToRectangle(this.harry.getBounds(), this.snitchImg.getBounds())) {
      this.gameWin();
   }

   let enemies = this.enemies.getChildren();
   let numEnemies = enemies.length;

   for (let i = 0; i < numEnemies; i++) {

      enemies[i].y += enemies[i].speed;

      if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
         enemies[i].speed *= -1;
      } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
         enemies[i].speed *= -1;
      }
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.harry.getBounds(), enemies[i].getBounds())) {
         this.gameOver();
         break;
      }
   }
};

gameScene.fxSound = function () {
   let audioFx = new Audio();
   audioFx.src = 'assets/audio/SoundEffects/gameOver.mp3';
   audioFx.autoplay = true;
}

gameScene.text = function () {
   let style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
   let text = this.add.text(300, 250, "ВЫ ПОЙМАЛИ СНИТЧ!!!", style);
   text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
}

gameScene.gameOver = function () {
   audio.pause();
   this.isPlayerAlive = false;
   this.fxSound();
   this.time.delayedCall(150, function () {
      this.cameras.main.fade(250);
   }, [], this);
   this.time.delayedCall(500, function () {
      this.scene.restart();
   }, [], this);

}

gameScene.gameWin = function () {
   this.isPlayerAlive = false;
   this.text();
   audio.pause();
   audioWin.play();
   this.time.delayedCall(12000, function () {
      this.scene.restart();
   }, [], this);
}


