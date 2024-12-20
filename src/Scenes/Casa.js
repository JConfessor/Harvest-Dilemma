// Casa.js

import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";
import HUD from "../entities/hud";

export default class Casa extends Scene {
  map;
  layers = {};
  player;
  touch;
  groupObjects;

  beterraba = 0;
  cenoura = 0;
  tomate = 0;
  laranja = 0;
  dinheiro = 0;

  hud;
  venda = true;

  constructor() {
    super("Casa");
  }

  preload() {}

  create() {
    this.createMap();
    this.createLayers();
    this.loadDataFromRegistry();
    this.createPlayer();
    this.createObjects();
    this.createColliders();
    this.createCamera();
    this.createHud();

    this.events.on("wake", this.loadDataFromRegistry, this);
  }

  loadDataFromRegistry() {
    this.beterraba = this.registry.get("beterraba") || 0;
    this.cenoura = this.registry.get("cenoura") || 0;
    this.tomate = this.registry.get("tomate") || 0;
    this.laranja = this.registry.get("laranja") || 0;
    this.dinheiro = this.registry.get("dinheiro") || 0;
  }

  saveDataToRegistry() {
    this.registry.set("beterraba", this.beterraba);
    this.registry.set("cenoura", this.cenoura);
    this.registry.set("tomate", this.tomate);
    this.registry.set("laranja", this.laranja);
    this.registry.set("dinheiro", this.dinheiro);
  }

  createPlayer() {
    this.touch = new Touch(this, 35 * 16, 12 * 16);
    this.player = new Player(this, 135, 247, this.touch, false, false);
    this.player.setDepth(3);
  }

  createObjects(name) {
    this.groupObjects = this.physics.add.group();

    const objects = this.map.createFromObjects("Objetos", { name: name });
    this.physics.world.enable(objects);

    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
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
    this.events.on(Phaser.Scenes.Events.UPDATE, () => {
      this.hud.updateHUD({
        beterraba: this.beterraba,
        cenoura: this.cenoura,
        tomate: this.tomate,
        laranja: this.laranja,
        terreno: 0,
        soilQuality: "100%",
        dinheiro: this.dinheiro,
      });
    });
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
        this.saveDataToRegistry();
        this.scene.sleep("Casa");
        this.scene.run("Fazenda");
      }

      // Preços individuais
      const prices = {
        beterraba: 3,
        cenoura: 2,
        tomate: 4,
        laranja: 5,
      };

      if (object.name == "vender") {
        let total =
          this.beterraba * prices.beterraba +
          this.cenoura * prices.cenoura +
          this.tomate * prices.tomate +
          this.laranja * prices.laranja;

        this.dinheiro += total;
        this.beterraba = 0;
        this.cenoura = 0;
        this.tomate = 0;
        this.laranja = 0;
        this.saveDataToRegistry();
        this.hud.showDialogMessage(
          `Itens vendidos! +${total} moedas.\nReflita: produzir sem destruir é possível.`
        );
      }

      if (object.name == "atualizar" && this.venda) {
        this.loadDataFromRegistry();
        this.venda = false;
      }
    }
  }
}
