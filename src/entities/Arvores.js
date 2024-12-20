// Arvores.js

export default class Arvores extends Phaser.Physics.Arcade.Sprite {
  timerVazia = false;
  timerCrescimento = true;
  timerColheita = true;
  timer;
  constructor(scene, x, y, anim) {
    super(scene, x, y, "arvore_vazia", 0);

    this.anim = anim;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
  }

  init() {
    this.setTexture("arvore");
    this.setFrame(0);

    this.frameRate = 8;

    this.setOrigin(0.5, 0.5);

    this.body.setSize(10, 7);
    this.body.setOffset(18, 34);
    this.body.immovable = true;

    this.initAnimations();

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update() {
    if (this.anim && this.timerColheita) {
      this.play("balanco");
      this.timerColheita = false;
      this.timer = setTimeout(() => {
        this.timerVazia = true;
      }, 2000);
    }
    if (!this.anim && this.timerColheita) {
      this.setTexture("arvore");
      this.setFrame(13);
    }

    if (this.timerVazia) {
      this.setTexture("arvore_vazia");
      this.setFrame(0);
      this.timerVazia = false;
      this.timer = setTimeout(() => {
        this.timerCrescimento = false;
      }, 90000);
    }

    if (!this.timerCrescimento) {
      this.setTexture("arvore");
      this.setFrame(12);
      this.timer = setTimeout(() => {
        this.timerColheita = true;
        this.anim = false;
      }, 90000);
      this.timerCrescimento = true;
    }
  }

  initAnimations() {
    this.anims.create({
      key: "balanco",
      frames: this.anims.generateFrameNumbers("arvore", {
        start: 36,
        end: 47,
      }),
      frameRate: this.frameRate,
      repeat: 0,
    });
  }
}
