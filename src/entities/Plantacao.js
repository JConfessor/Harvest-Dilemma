export default class Plantacao extends Phaser.Physics.Arcade.Sprite {
  colheita = false;
  plantado = false; // garante que comece não plantada
  regada = false;

  constructor(scene, x, y, fruta, autoRegarColher, growthModifier = 1.0) {
    super(scene, x, y, "plantacao");

    this.fruta = fruta;
    this.autoRegarColher = autoRegarColher;
    this.growthModifier = growthModifier;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
  }

  init() {
    this.setTexture("plantacao");
    this.setOrigin(0.5, 0.5);
    this.body.setSize(12, 12);
    this.body.immovable = true;

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.setInitialFrame();

    // Se autoRegarColher é verdadeiro, já consideramos regado e iniciamos o crescimento
    if (this.autoRegarColher) {
      this.regada = true;
      this.plantado = true;
      this.startGrowthCycle();
    }
  }

  update() {
    // Aqui não iniciamos o crescimento, somente mantemos o frame inicial caso ainda não tenha sido plantado.
    if (!this.plantado && !this.regada) {
      this.setInitialFrame();
    }
  }

  setInitialFrame() {
    switch (this.fruta) {
      case "tomate":
        this.setFrame(632);
        break;
      case "cenoura":
        this.setFrame(584);
        break;
      case "beterraba":
        this.setFrame(824);
        break;
    }
  }

  startGrowthCycle() {
    const growthStages = this.getGrowthStages();
    let stageIndex = 0;

    const delay = 20000 * this.growthModifier; // 20s * modificador
    const grow = () => {
      if (stageIndex < growthStages.length) {
        this.setFrame(growthStages[stageIndex]);
        stageIndex++;
        this.scene.time.delayedCall(delay, grow, [], this);
      } else {
        this.colheita = true;
        this.regada = false;
      }
    };

    grow();
  }

  getGrowthStages() {
    switch (this.fruta) {
      case "tomate":
        return [633, 634, 635];
      case "cenoura":
        return [585, 586, 587];
      case "beterraba":
        return [825, 826, 827];
      default:
        return [];
    }
  }

  realizarColheita(qtd = 1) {
    switch (this.fruta) {
      case "cenoura":
        this.scene.cenoura += qtd;
        this.scene.hud.showDialogMessage(
          `Cenoura colhida! +${qtd}\nValor orgânico.`
        );
        break;
      case "beterraba":
        this.scene.beterraba += qtd;
        this.scene.hud.showDialogMessage(
          `Beterraba colhida! +${qtd}\nAlimento vital.`
        );
        break;
      case "tomate":
        this.scene.tomate += qtd;
        this.scene.hud.showDialogMessage(
          `Tomate colhido! +${qtd}\nSabores naturais.`
        );
        break;
    }
    this.scene.saveDataToRegistry();
    this.destroy();
  }
}
