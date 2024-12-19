import { CONFIG } from "../config";

export default class Touch extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
  }

  init() {
    this.body.setSize(CONFIG.TILE_SIZE / 2.5, CONFIG.TILE_SIZE / 2.5);
  }
}
