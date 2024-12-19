import Fazenda from "../Scenes/Fazenda";
import { CONFIG } from "../config";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  cursors;
  touch;
  isAction = false;
  constructor(scene, x, y, touch, colher, regar) {
    super(scene, x, y, "player");

    this.touch = touch;
    this.colher = colher;
    this.regar = regar;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
  }

  init() {
    this.setFrame(0);

    this.speed = 80;
    this.frameRate = 8;
    this.direction = "down";

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = this.scene.input.keyboard.addKeys({
      regar: Phaser.Input.Keyboard.KeyCodes.R,
      colher: Phaser.Input.Keyboard.KeyCodes.C,
    });

    this.setOrigin(0.5, 0.5);

    this.body.setSize(12, 8);
    this.body.setOffset(18, 23);

    this.initAnimations();

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

    this.play("idle-right");
  }

  update() {
    const { left, right, down, up, space } = this.cursors;

    if (left.isDown) {
      this.setVelocityX(-this.speed);
      this.direction = "left";
    } else if (right.isDown) {
      this.setVelocityX(this.speed);
      this.direction = "right";
    } else {
      this.setVelocityX(0);
    }

    if (up.isDown) {
      this.setVelocityY(-this.speed);
      this.direction = "up";
    } else if (down.isDown) {
      this.setVelocityY(this.speed);
      this.direction = "down";
    } else {
      this.setVelocityY(0);
    }

    this.isAction = space.isDown;
    this.regar = this.keys.regar.isDown;
    this.colher = this.keys.colher.isDown;

    if (this.regar) {
      this.play("regar-" + this.direction, true);
    } else if (this.colher) {
      this.play("colher-" + this.direction, true);
    } else if (this.isAction) {
      this.play("plantar-" + this.direction, true);
    } else if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.play("idle-" + this.direction, true);
    } else {
      this.play("walk-" + this.direction, true);
    }

    let tx = 0,
      ty = 0,
      offset = CONFIG.TILE_SIZE / 3;
    switch (this.direction) {
      case "down":
        tx = 0;
        ty = offset;
        break;
      case "up":
        tx = 0;
        ty = -offset;
        break;
      case "left":
        tx = -offset;
        ty = 0;
        break;
      case "right":
        tx = offset;
        ty = 0;
        break;
    }
    this.touch.setPosition(this.x + tx, this.y + ty);
  }

  initAnimations() {
    this.anims.create({
      key: "idle-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 24,
        end: 31,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 8,
        end: 15,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 16,
        end: 23,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 2,
        end: 7,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 48,
        end: 55,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 40,
        end: 47,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 56,
        end: 63,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 32,
        end: 39,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    // Animações para plantar
    this.anims.create({
      key: "plantar-down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 152,
        end: 159,
      }),
      frameRate: this.frameRate,
      repeat: 0,
    });

    this.anims.create({
      key: "plantar-up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 136,
        end: 143,
      }),
      frameRate: this.frameRate,
      repeat: 0,
    });

    this.anims.create({
      key: "plantar-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 144,
        end: 151,
      }),
      frameRate: this.frameRate,
      repeat: 0,
    });

    this.anims.create({
      key: "plantar-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 128,
        end: 135,
      }),
      frameRate: this.frameRate,
      repeat: 0,
    });

    this.anims.create({
      key: "colher-up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 104,
        end: 111,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "colher-down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 96,
        end: 103,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "colher-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 112,
        end: 119,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "colher-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 120,
        end: 127,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "regar-down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 160,
        end: 167,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "regar-up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 168,
        end: 175,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "regar-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 176,
        end: 183,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "regar-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 184,
        end: 191,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });
  }
}
