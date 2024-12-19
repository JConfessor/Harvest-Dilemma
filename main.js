import { AUTO } from "phaser";
import { CONFIG } from "./src/config";
import Casa from "./src/Scenes/Casa";
import Fazenda from "./src/Scenes/Fazenda";

const config = {
  width: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  type: AUTO,
  scene: [Fazenda, Casa],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
      },
      debug: false,
    },
  },
  pixelArt: true,
  scale: {
    zoom: CONFIG.GAME_SCALE,
  },
};

export default new Phaser.Game(config);
