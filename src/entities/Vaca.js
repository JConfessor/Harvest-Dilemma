import { Math } from "phaser";
export default class Vaca extends Phaser.Physics.Arcade.Sprite {
  aux = true;

  constructor(scene, x, y, name, anim, textura) {
    super(scene, x, y, "vaca");

    this.name = name;
    this.anim = anim;
    this.textura = textura;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
  }

  init() {
    this.setTexture("vaca");
    this.frameRate = 5;
    this.setOrigin(0.5, 0.5);
    this.body.setSize(20, 10);

    this.initAnimations();

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

    if (this.name == "araponga") {
      this.play("walk2");
    } else {
      this.play("walk1");
    }
  }

  update() {
    if (!this.anim) {
      if (this.body.velocity.x == 0) {
        this.setVelocityX(Math.Between(-8, 8));
        if (this.body.velocity.x < 5 && this.body.velocity.x > -5) {
          this.setVelocityX(this.body.velocity.x * 2);
        }
      }

      if (this.body.velocity.y == 0) {
        this.setVelocityY(Math.Between(-8, 8));
        if (this.body.velocity.y < 5 && this.body.velocity.y < -5) {
          this.setVelocityY((this.body.velocity.y += this.body.velocity.y));
        }
      }

      if (this.body.velocity.x < 0) {
        this.scaleX = -1;
        this.body.setOffset(30, 18);
      } else {
        this.scaleX = 1;
        this.body.setOffset(8, 18);
      }
    } else if (this.anim && this.aux) {
      this.aux = false;
      this.setVelocity(0, 0);
      if (this.name == "araponga") {
        this.play("coracao2");
        setTimeout(() => {
          this.anim = false;
          this.aux = true;
          this.play("walk2");
        }, 2000);
      }

      if (this.name == "mimosa") {
        this.play("coracao1");
        setTimeout(() => {
          this.anim = false;
          this.aux = true;
          this.play("walk1");
        }, 2000);
      }
    } else if (this.anim) {
      this.setVelocity(0, 0);
    }
  }

  initAnimations() {
    this.anims.create({
      key: "walk1",
      frames: this.anims.generateFrameNumbers("vaca", {
        start: 72,
        end: 80,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "coracao1",
      frames: this.anims.generateFrameNumbers("vaca", {
        start: 120,
        end: 125,
      }),
      frameRate: this.frameRate,
      repeat: 0,
    });

    this.anims.create({
      key: "walk2",
      frames: this.anims.generateFrameNumbers("vaca", {
        start: 8,
        end: 15,
      }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    this.anims.create({
      key: "coracao2",
      frames: this.anims.generateFrameNumbers("vaca", {
        start: 56,
        end: 61,
      }),
      frameRate: this.frameRate,
      repeat: 0,
    });
  }
}
