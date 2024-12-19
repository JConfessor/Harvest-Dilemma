import { AUTO, Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";
import Arvores from "../entities/Arvores";
import Vaca from "../entities/Vaca";
import Plantacao from "../entities/Plantacao";
import HUD from "../entities/hud";

export default class Fazenda extends Scene {
  map;
  layers = {};

  player;
  touch;
  cena = 0;
  hud;

  groupObjects;
  GroupArvores;
  GroupPlant;

  arvores = [];
  vacas = [];
  plantacao;

  semente = null;
  selectedAgrotoxico = null;
  isTouching = false;

  regando = false;
  colhendo = false;
  atualizarDinheiro = false;

  beterraba = 0;
  cenoura = 0;
  tomate = 0;
  laranja = 0;
  dinheiro = 0;
  terreno = 0;
  soilQuality = 100;

  confirmMode = false;
  confirmCallback = null;
  selectedOption = 0; // 0 = Não, 1 = Sim

  autoRegarColher = false; // Módulo de regar/colher automático

  constructor() {
    super("Fazenda");
  }

  preload() {
    this.load.tilemapTiledJSON("tilemap_fazenda", "./fazenda.tmj");
    this.load.tilemapTiledJSON("tilemap_casa", "./casa.tmj");
    this.load.image("tiles_fazenda", "./mapas/tiles/geral.png");
    this.load.spritesheet("player", "./mapas/tiles/player.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet("arvore", "./mapas/tiles/arvore_laranjas_anim.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet("arvore_vazia", "./mapas/tiles/arvore_anim.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet("vaca", "./mapas/tiles/vacas_anim.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("plantacao", "./mapas/tiles/geral.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.atlas("hud", "./mapas/tiles/hud.png", "./mapas/hudFazenda.json");
    this.load.atlas(
      "hudContainer",
      "./hudContainer.png",
      "./hudContainer.json"
    );
  }

  create() {
    this.createMapFazenda();
    this.createLayersFazenda();
    this.loadDataFromRegistry();

    this.createPlayer();
    this.createTree();
    this.createCow();
    this.createObjects();
    this.createColliders();
    this.createCamera();
    this.createHud();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.gKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);

    this.events.on("wake", this.loadDataFromRegistry, this);
  }

  update(time, delta) {
    this.hud.updateHUD({
      beterraba: this.beterraba,
      cenoura: this.cenoura,
      tomate: this.tomate,
      laranja: this.laranja,
      terreno: this.terreno,
      soilQuality: Math.round(this.soilQuality) + "%",
      dinheiro: this.dinheiro,
    });

    if (this.confirmMode) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
        this.selectedOption = 0;
        this.hud.highlightConfirmOption(this.selectedOption);
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
        this.selectedOption = 1;
        this.hud.highlightConfirmOption(this.selectedOption);
      }

      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        const useAgro = this.selectedOption === 1;
        if (this.confirmCallback) {
          this.confirmCallback(useAgro);
        }
        this.confirmMode = false;
        this.confirmCallback = null;
        this.hud.hideConfirmDialog();
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.gKey)) {
      this.buyAutoRegarColher();
    }

    this.input.keyboard.once("keydown-E", () => {
      this.regando = true;
    });

    setTimeout(() => {
      this.regando = false;
    }, 1000);

    this.input.keyboard.once("keydown-R", () => {
      this.colhendo = true;
    });

    setTimeout(() => {
      this.colhendo = false;
    }, 1000);
  }

  buyAutoRegarColher() {
    if (this.dinheiro >= 1000) {
      this.dinheiro -= 1000;
      this.autoRegarColher = true;
      this.hud.showDialogMessage(
        "Módulo de rega/colheita automática adquirido!\nPlantas serão cuidadas automaticamente."
      );
      this.saveDataToRegistry();
    } else {
      this.hud.showDialogMessage(
        "Dinheiro insuficiente para comprar rega/colheita automática."
      );
    }
  }

  loadDataFromRegistry() {
    this.beterraba = this.registry.get("beterraba") || 0;
    this.cenoura = this.registry.get("cenoura") || 0;
    this.tomate = this.registry.get("tomate") || 0;
    this.laranja = this.registry.get("laranja") || 0;
    this.dinheiro = this.registry.get("dinheiro") || 0;
    this.soilQuality = this.registry.get("soilQuality") || 100;
    this.autoRegarColher = this.registry.get("autoRegarColher") || false;
  }

  saveDataToRegistry() {
    this.registry.set("beterraba", this.beterraba);
    this.registry.set("cenoura", this.cenoura);
    this.registry.set("tomate", this.tomate);
    this.registry.set("laranja", this.laranja);
    this.registry.set("dinheiro", this.dinheiro);
    this.registry.set("soilQuality", this.soilQuality);
    this.registry.set("autoRegarColher", this.autoRegarColher);
  }

  createPlayer() {
    this.touch = new Touch(this, 35 * 16, 12 * 16);
    this.player = new Player(this, 35 * 16, 12 * 16, this.touch, false, false);
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

  createTree() {
    for (let i = 0; i < this.map.objects[0].objects.length; i++) {
      const obj = this.map.objects[0].objects[i];
      if (obj.name.startsWith("arvore")) {
        let name = obj.name;
        this.arvores[name] = new Arvores(
          this,
          obj.x + 6,
          obj.y - 10,
          false
        ).setDepth(4);
      }
    }
  }

  createCow() {
    this.GroupVacas = this.physics.add.group();
    this.vacas[0] = new Vaca(this, 288, 224, "araponga", false, 1).setDepth(3);
    this.GroupVacas.add(this.vacas[0]);
    this.vacas[1] = new Vaca(this, 576, 144, "mimosa", false, 2).setDepth(3);
    this.GroupVacas.add(this.vacas[1]);
  }

  createMapFazenda() {
    this.map = this.make.tilemap({
      key: "tilemap_fazenda",
      tileWidth: CONFIG.TILE_SIZE,
      tileHeight: CONFIG.TILE_SIZE,
    });
    this.map.addTilesetImage("tiles_fazenda", "tiles_fazenda");
  }

  createLayersFazenda() {
    const tilesFazenda = this.map.getTileset("tiles_fazenda");
    const layerNames = this.map.getTileLayerNames();

    for (let i = 0; i < layerNames.length; i++) {
      const name = layerNames[i];
      this.layers[name] = this.map.createLayer(name, [tilesFazenda], 0, 0);
      this.layers[name].setDepth(i);

      if (name.endsWith("collision") || name.endsWith("vaca")) {
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
  }

  createColliders() {
    const layerNames = this.map.getTileLayerNames();
    for (let i = 0; i < layerNames.length; i++) {
      const name = layerNames[i];
      if (name.endsWith("collision")) {
        this.physics.add.collider(this.player, this.layers[name]);
        this.physics.add.collider(this.GroupVacas, this.layers[name]);
      }
      if (name.endsWith("vaca")) {
        this.physics.add.collider(this.GroupVacas, this.layers[name]);
      }
    }

    const obj = this.map.objects[0].objects;
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].name.startsWith("arvore")) {
        let name = obj[i].name;
        this.physics.add.collider(this.player, this.arvores[name]);
        this.physics.add.collider(this.GroupVacas, this.arvores[name]);
      }
    }

    this.physics.add.overlap(
      this.touch,
      this.groupObjects,
      this.handleTouch,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.touch,
      this.GroupVacas,
      this.handleTouchVaca,
      undefined,
      this
    );
    this.GroupPlant = this.physics.add.group();
    this.physics.add.overlap(
      this.touch,
      this.GroupPlant,
      this.handleTouchPlantas,
      undefined,
      this
    );
  }

  getGrowthModifier(fruit) {
    return this.selectedAgrotoxico === fruit ? 0.25 : 1.0;
  }

  degradeSoil(amount) {
    this.soilQuality -= amount;
    if (this.soilQuality < 0) this.soilQuality = 0;
  }

  askAgrotoxico(fruitName) {
    this.semente = fruitName;
    this.confirmMode = true;
    this.selectedOption = 0;
    this.hud.showConfirmDialog(
      `Semente de ${fruitName} obtida!\nUsar agrotóxico?\n(←/→ para escolher, ENTER p/ confirmar)`
    );
    this.hud.highlightConfirmOption(this.selectedOption);

    this.confirmCallback = (useAgro) => {
      if (useAgro) {
        this.selectedAgrotoxico = fruitName;
        this.degradeSoil(5);
        this.hud.showDialogMessage(
          "Agrotóxico aplicado.\nSolo sofre danos a longo prazo."
        );
      } else {
        this.selectedAgrotoxico = null;
        this.degradeSoil(1);
        this.hud.showDialogMessage(
          "Plantio orgânico.\nPreserva o meio ambiente!"
        );
      }
      this.saveDataToRegistry();
    };
  }

  canPlant() {
    if (this.soilQuality <= 0) {
      this.hud.showDialogMessage(
        "O solo está completamente degradado!\nNão é mais possível plantar."
      );
      return false;
    }
    return true;
  }

  handleTouch(touch, object) {
    if (this.isTouching && this.player.isAction) return;
    if (this.isTouching && !this.player.isAction) {
      this.isTouching = false;
      return;
    }

    if (this.player.isAction && !this.confirmMode) {
      this.isTouching = true;

      if (object.name.startsWith("arvore")) {
        let name = object.name;
        if (!this.arvores[name].anim) {
          this.arvores[name].anim = true;
          this.laranja += 3;
          this.hud.showDialogMessage(
            "Laranjas coletadas!\nEconomia sustentável."
          );
          this.saveDataToRegistry();
        }
      }

      if (object.name == "casa") {
        this.saveDataToRegistry();
        this.scene.run("Casa");
        this.scene.sleep("Fazenda");
        this.cena = 1;
        this.atualizarDinheiro = true;
      }

      if (object.name == "beterraba") {
        this.askAgrotoxico("beterraba");
      } else if (object.name == "tomate") {
        this.askAgrotoxico("tomate");
      } else if (object.name == "cenoura") {
        this.askAgrotoxico("cenoura");
      }

      // Plantar
      if (this.semente && object.name.startsWith("plantacao")) {
        if (!this.canPlant()) return;
        let fruta = this.semente;

        this.plantacao = new Plantacao(
          this,
          object.x,
          object.y - 3,
          fruta,
          this.autoRegarColher, // se autoRegarColher=true, já consideramos a planta regada ou colhida quando pronto.
          this.getGrowthModifier(fruta)
        ).setDepth(3);

        // Se autoRegarColher = true, a planta já nasce regada, e podemos criar lógica para colher automaticamente quando pronta.
        // A lógica completa de auto colheita pode ser dentro do Plantacao.js quando colheita = true, ou simplificar aqui.

        this.GroupPlant.add(this.plantacao);
        this.hud.showDialogMessage(
          `${
            fruta.charAt(0).toUpperCase() + fruta.slice(1)
          } plantada!\nRecursos sustentáveis garantem o futuro.`
        );
        this.saveDataToRegistry();
      }

      if (object.name == "atualizar" && this.atualizarDinheiro) {
        // Ao voltar da casa, Casa já terá atualizado o registry.
        this.loadDataFromRegistry();
        this.atualizarDinheiro = false;
      }
    }
  }

  handleTouchPlantas(touch, planta) {
    if (this.autoRegarColher) {
      // Se autoRegarColher = true, planta já nasce regada (definimos no Plantacao)
      // Ao ficar pronta, podemos colher automaticamente sem apertar nada, mas isso teria que ser no Plantacao.js quando vira colheita.
      // Aqui, se o jogador tocar:
      if (this.player.colher && planta.colheita) {
        planta.destroy();
        switch (planta.fruta) {
          case "cenoura":
            this.cenoura++;
            this.hud.showDialogMessage(
              "Cenoura colhida automaticamente!\nSem esforço, mas cuidado com o solo."
            );
            break;
          case "beterraba":
            this.beterraba++;
            this.hud.showDialogMessage(
              "Beterraba colhida automaticamente!\nTecnologia a favor da natureza."
            );
            break;
          case "tomate":
            this.tomate++;
            this.hud.showDialogMessage(
              "Tomate colhido automaticamente!\nMenos trabalho, mas mantenha o solo saudável."
            );
            break;
        }
        this.saveDataToRegistry();
      }
      return;
    }

    if (this.player.regar && !planta.regada) {
      planta.regada = true;
      this.hud.showDialogMessage("Planta regada!\nRecarga de vida ao solo.");
      this.saveDataToRegistry();
    }

    if (this.player.colher && planta.colheita) {
      planta.destroy();
      switch (planta.fruta) {
        case "cenoura":
          this.cenoura++;
          this.hud.showDialogMessage(
            "Cenoura colhida!\nSuprimento fresco e responsável."
          );
          break;
        case "beterraba":
          this.beterraba++;
          this.hud.showDialogMessage(
            "Beterraba colhida!\nAgricultura consciente."
          );
          break;
        case "tomate":
          this.tomate++;
          this.hud.showDialogMessage(
            "Tomate colhido!\nAlimento puro, sem agrotóxicos."
          );
          break;
      }
      this.saveDataToRegistry();
    }
  }

  handleTouchVaca(touch, vaca) {
    if (this.isTouching && this.player.isAction) return;
    if (this.isTouching && !this.player.isAction) {
      this.isTouching = false;
      return;
    }

    if (this.player.isAction && !this.confirmMode) {
      this.isTouching = true;

      if (vaca.name.startsWith("araponga")) {
        for (let i = 0; i < this.vacas.length; i++) {
          if (this.vacas[i].name == "araponga") {
            this.vacas[i].anim = true;
            this.hud.showDialogMessage(
              "A vaca Araponga está feliz!\nBem-estar animal é essencial."
            );
            this.saveDataToRegistry();
          }
        }
      }

      if (vaca.name.startsWith("mimosa")) {
        for (let i = 0; i < this.vacas.length; i++) {
          if (this.vacas[i].name == "mimosa") {
            this.vacas[i].anim = true;
            this.hud.showDialogMessage(
              "A vaca Mimosa está contente!\nEquilíbrio entre fauna e flora."
            );
            this.saveDataToRegistry();
          }
        }
      }
    }
  }
}
