// Plantacao.js

export default class Plantacao extends Phaser.Physics.Arcade.Sprite {
  colheita = false;
  plantado = false;
  regada = false;

  // Tempos base de crescimento (em milissegundos).
  // 1 mês = 60s = 60000ms
  // Tomate: 2 meses → 120s total / 3 estágios = 40s/estágio → 40000ms/estágio
  // Cenoura: 3 meses → 180s total / 3 estágios = 60s/estágio → 60000ms/estágio
  // Beterraba: 4 meses → 240s total / 3 estágios = 80s/estágio → 80000ms/estágio
  growthTimes = {
    tomate: 120000,
    cenoura: 180000,
    beterraba: 240000,
  };

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

    if (this.autoRegarColher) {
      this.regada = true;
      this.plantado = true;
      this.startGrowthCycle();
    }
  }

  update() {
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

  startGrowthCycle() {
    const growthStages = this.getGrowthStages();
    let stageIndex = 0;

    const totalGrowthTime = this.growthTimes[this.fruta] || 60000;
    const stageTime =
      (totalGrowthTime * this.growthModifier) / growthStages.length;

    const grow = () => {
      if (stageIndex < growthStages.length) {
        this.setFrame(growthStages[stageIndex]);
        stageIndex++;
        this.scene.time.delayedCall(stageTime, grow, [], this);
      } else {
        this.colheita = true;
        this.regada = false;
      }
    };

    grow();
  }

  realizarColheita(qtd = 1) {
    switch (this.fruta) {
      case "cenoura":
        this.scene.cenoura += qtd;
        this.scene.hud.showDialogMessage(
          `Cenoura colhida! +${qtd}\nEquilíbrio: alimento e cuidado.`
        );
        break;
      case "beterraba":
        this.scene.beterraba += qtd;
        this.scene.hud.showDialogMessage(
          `Beterraba colhida! +${qtd}\nPreservar o solo é garantir o futuro.`
        );
        break;
      case "tomate":
        this.scene.tomate += qtd;
        this.scene.hud.showDialogMessage(
          `Tomate colhido! +${qtd}\nSaúde da terra, saúde das pessoas.`
        );
        break;
    }
    this.scene.saveDataToRegistry();
    this.destroy();
  }
}
