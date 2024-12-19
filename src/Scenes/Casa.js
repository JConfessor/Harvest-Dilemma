import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";
import Fazenda from "./Fazenda";
import HUD from "../entities/hud";

export default class Casa extends Scene {
  map;
  cena = 0;

  layers = {};
  player;
  touch;
  groupObjects;

  beterraba = 0;
  cenoura = 0;
  tomate = 0;
  laranja = 0;
  sucoBet = 0;
  sucoCen = 0;
  sucoTom = 0;
  sucoLar = 0;
  dinheiro = 0;

  venda = true;

  hud;

  constructor() {
    super("Casa");
  }

  create() {
    this.createMap();
    this.createLayers();
    this.createPlayer();
    this.createObjects();
    this.createColliders();
    this.createCamera();
    this.createHud();
  }

  createPlayer() {
    this.touch = new Touch(this, 35 * 16, 12 * 16);
    this.player = new Player(this, 135, 247, this.touch, false, false);
    this.player.setDepth(3);
  }

  createObjects(name) {
    this.groupObjects = this.physics.add.group();

    const objects = this.map.createFromObjects("Objetos", {
      name: name,
    });

    this.physics.world.enable(objects);

    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      const prop = this.map.objects[0].objects[i];

      obj.setDepth(this.layers.length + 1);
      obj.setVisible(false);
      obj.body.immovable = true;

      this.groupObjects.add(obj);
    }
  }

  createMap() {
    this.map = this.make.tilemap({
      key: "tilemap_casa",
      tileWidth: CONFIG.TILE_SIZE,
      tileHeight: CONFIG.TILE_SIZE,
    });
    this.map.addTilesetImage("tiles_casa", "tiles_fazenda");
  }

  createLayers() {
    const tilesFazenda = this.map.getTileset("tiles_casa");
    const layerNames = this.map.getTileLayerNames();

    for (let i = 0; i < layerNames.length; i++) {
      const name = layerNames[i];

      this.layers[name] = this.map.createLayer(name, [tilesFazenda], 0, 0);
      this.layers[name].setDepth(i);

      if (name.endsWith("collision")) {
        this.layers[name].setCollisionByProperty({ collide: true });

        if (CONFIG.DEBUG_COLLISION) {
          const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
          this.layers[name].renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255),
          });
        }
      }
    }
  }

  createCamera() {
    const mapWidth = this.map.width * CONFIG.TILE_SIZE;
    const mapHeight = this.map.height * CONFIG.TILE_SIZE;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player);
  }

  createHud() {
    this.hud = new HUD(this, this.cameras.main.x - 10, -10);
  }

  createColliders() {
    const layerNames = this.map.getTileLayerNames();
    for (let i = 0; i < layerNames.length; i++) {
      const name = layerNames[i];

      if (name.endsWith("collision")) {
        this.physics.add.collider(this.player, this.layers[name]);
      }
    }

    this.physics.add.overlap(
      this.touch,
      this.groupObjects,
      this.handleTouch,
      undefined,
      this
    );
  }

  handleTouch(touch, object) {
    if (this.isTouching && this.player.isAction) {
      return;
    }

    if (this.isTouching && !this.player.isAction) {
      this.isTouching = false;
      return;
    }

    if (this.player.isAction) {
      this.isTouching = true;

      if (object.name == "sair") {
        this.venda = true;
        this.scene.sleep("Casa");
        this.scene.run("Fazenda");
      }

      switch (object.name) {
        case "beterraba":
          this.sucoBet = this.beterraba;
          this.hud.sucoBet = this.beterraba;
          this.beterraba = 0;
          this.hud.beterraba = this.beterraba;
          break;

        case "cenoura":
          this.sucoCen = this.cenoura;
          this.hud.sucoCen = this.sucoCen;
          this.cenoura = 0;
          this.hud.cenoura = this.cenoura;
          break;

        case "tomate":
          this.sucoTom = this.tomate;
          this.hud.sucoTom = this.sucoTom;
          this.tomate = 0;
          this.hud.tomate = this.tomate;
          break;

        case "laranja":
          this.sucoLar = this.laranja;
          this.hud.sucoLar = this.sucoLar;
          this.laranja = 0;
          this.hud.laranja = this.laranja;
          break;
      }

      if (object.name == "vender") {
        this.dinheiro =
          this.dinheiro +
          this.beterraba +
          this.cenoura +
          this.tomate +
          this.laranja +
          this.sucoBet * 2 +
          this.sucoCen * 2 +
          this.sucoTom * 2 +
          this.sucoLar * 2;

        this.beterraba = 0;
        this.cenoura = 0;
        this.tomate = 0;
        this.laranja = 0;
        this.sucoBet = 0;
        this.sucoCen = 0;
        this.sucoTom = 0;
        this.sucoLar = 0;

        this.hud.beterraba = this.beterraba;
        this.hud.tomate = this.tomate;
        this.hud.laranja = this.laranja;
        this.hud.cenoura = this.cenoura;
        this.hud.sucoBet = this.sucoBet;
        this.hud.sucoCen = this.sucoCen;
        this.hud.sucoTom = this.sucoTom;
        this.hud.sucoLar = this.sucoLar;
        this.hud.dinheiro = this.dinheiro;
      }
    }

    if (object.name == "atualizar" && this.venda) {
      let fazendaBeterraba = this.scene.get("Fazenda").beterraba;
      let fazendaCenoura = this.scene.get("Fazenda").cenoura;
      let fazendatomate = this.scene.get("Fazenda").tomate;
      let fazendalaranja = this.scene.get("Fazenda").laranja;

      fazendaBeterraba > this.beterraba
        ? (this.beterraba = fazendaBeterraba)
        : this.beterraba + 0;
      fazendaCenoura > this.cenoura
        ? (this.cenoura = fazendaCenoura)
        : this.cenoura + 0;
      fazendatomate > this.tomate
        ? (this.tomate = fazendatomate)
        : this.tomate + 0;
      fazendalaranja > this.laranja
        ? (this.laranja = fazendalaranja)
        : this.laranja + 0;

      this.hud.beterraba = this.beterraba;
      this.hud.tomate = this.tomate;
      this.hud.laranja = this.laranja;
      this.hud.cenoura = this.cenoura;
      this.hud.sucoBet = this.sucoBet;
      this.hud.sucoCen = this.sucoCen;
      this.hud.sucoTom = this.sucoTom;
      this.hud.sucoLar = this.sucoLar;
      this.hud.dinheiro = this.dinheiro;

      this.venda = false;
    }
  }
}
