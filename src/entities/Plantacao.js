export default class Plantacao extends Phaser.Physics.Arcade.Sprite {
  colheita = false;
  constructor(scene, x, y, fruta, regada, growthModifier = 1.0) {
    super(scene, x, y, "plantacao");

    this.fruta = fruta;
    this.regada = regada;
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
  }

  update() {
    if (!this.plantado) {
      this.setInitialFrame();
    }

    if (this.regada && !this.colheita) {
      this.plantado = true;
      this.startGrowthCycle();
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

    const grow = () => {
      if (stageIndex < growthStages.length) {
        this.setFrame(growthStages[stageIndex]);
        stageIndex++;
        setTimeout(grow, 20000 * this.growthModifier);
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
}
