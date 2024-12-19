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
  sucoBet = 0;
  sucoCen = 0;
  sucoTom = 0;
  sucoLar = 0;
  dinheiro = 0;
  terreno = 0;
  soilQuality = 100;

  confirmMode = false;
  confirmCallback = null;
  selectedOption = 0; // 0 = Não, 1 = Sim

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

    this.loadDataFromRegistry(); // Carregar dados do registry

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

  loadDataFromRegistry() {
    this.beterraba = this.registry.get("beterraba") || 0;
    this.cenoura = this.registry.get("cenoura") || 0;
    this.tomate = this.registry.get("tomate") || 0;
    this.laranja = this.registry.get("laranja") || 0;
    this.dinheiro = this.registry.get("dinheiro") || 0;
    this.sucoBet = this.registry.get("sucoBet") || 0;
    this.sucoCen = this.registry.get("sucoCen") || 0;
    this.sucoTom = this.registry.get("sucoTom") || 0;
    this.sucoLar = this.registry.get("sucoLar") || 0;
    this.soilQuality = this.registry.get("soilQuality") || 100;
  }

  saveDataToRegistry() {
    this.registry.set("beterraba", this.beterraba);
    this.registry.set("cenoura", this.cenoura);
    this.registry.set("tomate", this.tomate);
    this.registry.set("laranja", this.laranja);
    this.registry.set("dinheiro", this.dinheiro);
    this.registry.set("sucoBet", this.sucoBet);
    this.registry.set("sucoCen", this.sucoCen);
    this.registry.set("sucoTom", this.sucoTom);
    this.registry.set("sucoLar", this.sucoLar);
    this.registry.set("soilQuality", this.soilQuality);
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
      `Semente de ${fruitName} obtida!\nUsar agrotóxico?\n(←/→ para escolher, ENTER para confirmar)`
    );
    this.hud.highlightConfirmOption(this.selectedOption);

    this.confirmCallback = (useAgro) => {
      if (useAgro) {
        this.selectedAgrotoxico = fruitName;
        this.degradeSoil(5);
        this.hud.showDialogMessage(
          "Agrotóxico aplicado.\nImpacto ambiental negativo a longo prazo."
        );
      } else {
        this.selectedAgrotoxico = null;
        this.degradeSoil(1);
        this.hud.showDialogMessage(
          "Plantio orgânico.\nVocê ajuda a preservar o meio ambiente!"
        );
      }
      this.saveDataToRegistry();
    };
  }

  handleTouch(touch, object) {
    if (this.isTouching && this.player.isAction) {
      return;
    }

    if (this.isTouching && !this.player.isAction) {
      this.isTouching = false;
      return;
    }

    if (this.player.isAction && !this.confirmMode) {
      this.isTouching = true;

      if (object.name.startsWith("arvore")) {
        let name = object.name;
        if (this.arvores[name].anim == false) {
          this.arvores[name].anim = true;
          this.laranja += 3;
          this.hud.showDialogMessage(
            "Laranjas coletadas!\nUso sustentável dos recursos naturais."
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

      if (this.semente == "beterraba" && object.name == "plantacaoBeterraba") {
        this.plantacao = new Plantacao(
          this,
          object.x,
          object.y - 3,
          "beterraba",
          false,
          this.getGrowthModifier("beterraba")
        ).setDepth(3);
        this.GroupPlant.add(this.plantacao);
        this.hud.showDialogMessage(
          "Beterraba plantada!\nAlimento saudável, solo protegido."
        );
        this.saveDataToRegistry();
      }

      if (this.semente == "tomate" && object.name == "plantacaoTomate") {
        this.plantacao = new Plantacao(
          this,
          object.x,
          object.y - 3,
          "tomate",
          false,
          this.getGrowthModifier("tomate")
        ).setDepth(3);
        this.GroupPlant.add(this.plantacao);
        this.hud.showDialogMessage(
          "Tomate plantado!\nVocê colabora com a sustentabilidade."
        );
        this.saveDataToRegistry();
      }

      if (this.semente == "cenoura" && object.name == "plantacaoCenoura") {
        this.plantacao = new Plantacao(
          this,
          object.x,
          object.y - 3,
          "cenoura",
          false,
          this.getGrowthModifier("cenoura")
        ).setDepth(3);
        this.GroupPlant.add(this.plantacao);
        this.hud.showDialogMessage(
          "Cenoura plantada!\nProdução orgânica é o futuro."
        );
        this.saveDataToRegistry();
      }

      if (object.name == "atualizar" && this.atualizarDinheiro) {
        // Atualiza dados da casa no registry
        let casa = this.scene.get("Casa");
        this.beterraba = casa.beterraba;
        this.cenoura = casa.cenoura;
        this.tomate = casa.tomate;
        this.laranja = casa.laranja;
        this.sucoBet = casa.sucoBet;
        this.sucoCen = casa.sucoCen;
        this.sucoTom = casa.sucoTom;
        this.sucoLar = casa.sucoLar;
        this.dinheiro = casa.dinheiro;

        this.saveDataToRegistry();
        this.atualizarDinheiro = false;
      }
    }
  }

  handleTouchPlantas(touch, planta) {
    if (this.player.regar && !planta.regada) {
      planta.regada = true;
      this.hud.showDialogMessage("Planta regada!\nÁgua limpa, solo forte!");
      this.saveDataToRegistry();
    }

    if (this.player.colher && planta.colheita) {
      planta.destroy();
      switch (planta.fruta) {
        case "cenoura":
          this.cenoura++;
          this.hud.showDialogMessage(
            "Cenoura colhida!\nNutrição para você, sem danos ambientais."
          );
          break;
        case "beterraba":
          this.beterraba++;
          this.hud.showDialogMessage(
            "Beterraba colhida!\nAlimento fresco e sustentável."
          );
          break;
        case "tomate":
          this.tomate++;
          this.hud.showDialogMessage(
            "Tomate colhido!\nBom para você, bom para a natureza."
          );
          break;
      }
      this.saveDataToRegistry();
    }
  }

  handleTouchVaca(touch, vaca) {
    if (this.isTouching && this.player.isAction) {
      return;
    }

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
              "A vaca Araponga está feliz!\nBem-estar animal faz parte da sustentabilidade."
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
              "A vaca Mimosa está contente!\nAmbiente saudável = animais saudáveis."
            );
            this.saveDataToRegistry();
          }
        }
      }
    }
  }
}
