import Phaser, { Scene } from "phaser";
import { CONFIG } from "../config";

export default class HUD extends Phaser.GameObjects.Container {
  beterraba = 0;
  cenoura = 0;
  tomate = 0;
  laranja = 0;
  soilQuality = "100%";
  dinheiro = 0;

  // Textos do HUD principal
  beterrabaTxt;
  cenouraTxt;
  tomateTxt;
  laranjaTxt;
  dinheiroTxt;
  soilTxt; // Saúde do Solo

  // Caixa de diálogo simples (mensagem)
  dialogBox;
  dialogText;

  // Caixa de confirmação com opções
  confirmBox;
  confirmText;
  yesText;
  noText;

  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setScrollFactor(0); // HUD fixo na tela

    this.createHud();
    this.createDialogBox();
    this.createConfirmDialog();
  }

  createHud() {
    console.log("HUD Criado");

    this.conteudo = this.add(new Phaser.GameObjects.Container(this.scene));
    this.conteudo.setDepth(10);
    this.conteudo.setScrollFactor(0);

    const tile = CONFIG.TILE_SIZE;
    const widthDialog = 175;
    const heightDialog = 2 * tile;

    this.conteudo.add([
      this.scene.add.image(0, 0, "hudContainer", "dialog_topleft"),
      this.scene.add
        .image(16, 0, "hudContainer", "dialog_top")
        .setDisplaySize(widthDialog, tile),
      this.scene.add.image(
        widthDialog + tile,
        0,
        "hudContainer",
        "dialog_topright"
      ),
      this.scene.add
        .image(0, 16, "hudContainer", "dialog_left")
        .setDisplaySize(16, heightDialog),
      this.scene.add
        .image(16, 16, "hudContainer", "dialog_center")
        .setDisplaySize(widthDialog, heightDialog),
      this.scene.add
        .image(widthDialog + tile, 16, "hudContainer", "dialog_right")
        .setDisplaySize(tile, heightDialog),
      this.scene.add.image(
        0,
        heightDialog + tile,
        "hudContainer",
        "dialog_bottomleft"
      ),
      this.scene.add
        .image(16, heightDialog + tile, "hudContainer", "dialog_bottom")
        .setDisplaySize(widthDialog, tile),
      this.scene.add.image(
        widthDialog + tile,
        heightDialog + tile,
        "hudContainer",
        "dialog_bottomright"
      ),

      // Frutas e valores
      this.scene.add.image(23, 23, "hud", "beterraba.png"),
      (this.beterrabaTxt = this.scene.add.text(33, 18, "0")),
      this.scene.add.image(55, 23, "hud", "cenoura.png"),
      (this.cenouraTxt = this.scene.add.text(65, 18, "0")),
      this.scene.add.image(87, 23, "hud", "tomate.png"),
      (this.tomateTxt = this.scene.add.text(97, 18, "0")),
      this.scene.add.image(119, 23, "hud", "laranja.png"),
      (this.laranjaTxt = this.scene.add.text(129, 18, "0")),
      // Saúde do Solo:
      (this.soilTxt = this.scene.add.text(20, 55, "Saúde do Solo: 100%", {
        fontSize: "10px",
      })),
      // Moedas
      this.scene.add
        .image(155, 33, "hud", "coin_16.png")
        .setDisplaySize(16, 16),
      (this.dinheiroTxt = this.scene.add.text(165, 27, "0")),
    ]);
  }

  createDialogBox() {
    const w = 200;
    const h = 60;

    // Ajustar para parte superior direita:
    const x = this.scene.cameras.main.width - w / 2 - 10;
    const y = 30; // um pouco abaixo do topo

    const container = this.scene.add
      .container(x, y)
      .setDepth(100)
      .setScrollFactor(0);
    container.setVisible(false);

    const topLeft = this.scene.add
      .image(-w / 2, -h / 2, "hudContainer", "dialog_topleft")
      .setOrigin(0);
    const top = this.scene.add
      .image(-w / 2 + 16, -h / 2, "hudContainer", "dialog_top")
      .setDisplaySize(w - 32, 16);
    const topRight = this.scene.add
      .image(w / 2, -h / 2, "hudContainer", "dialog_topright")
      .setOrigin(1, 0);
    const left = this.scene.add
      .image(-w / 2, -h / 2 + 16, "hudContainer", "dialog_left")
      .setDisplaySize(16, h - 32)
      .setOrigin(0);
    const center = this.scene.add
      .image(-w / 2 + 16, -h / 2 + 16, "hudContainer", "dialog_center")
      .setDisplaySize(w - 32, h - 32)
      .setOrigin(0);
    const right = this.scene.add
      .image(w / 2, -h / 2 + 16, "hudContainer", "dialog_right")
      .setDisplaySize(16, h - 32)
      .setOrigin(1, 0);
    const bottomLeft = this.scene.add
      .image(-w / 2, h / 2, "hudContainer", "dialog_bottomleft")
      .setOrigin(0, 1);
    const bottom = this.scene.add
      .image(-w / 2 + 16, h / 2, "hudContainer", "dialog_bottom")
      .setDisplaySize(w - 32, 16)
      .setOrigin(0, 1);
    const bottomRight = this.scene.add
      .image(w / 2, h / 2, "hudContainer", "dialog_bottomright")
      .setOrigin(1, 1);

    this.dialogText = this.scene.add
      .text(0, 0, "", {
        fontSize: "10px",
        color: "#ffffff",
        wordWrap: { width: w - 40 },
        align: "center",
      })
      .setOrigin(0.5);

    container.add([
      topLeft,
      top,
      topRight,
      left,
      center,
      right,
      bottomLeft,
      bottom,
      bottomRight,
      this.dialogText,
    ]);
    this.dialogBox = container;
  }

  createConfirmDialog() {
    // Caixa de confirmação com opções "Não" e "Sim"
    const w = 220;
    const h = 180;
    const x = this.scene.cameras.main.width / 2;
    const y = this.scene.cameras.main.height / 2;

    const container = this.scene.add
      .container(x, y)
      .setDepth(101)
      .setScrollFactor(0);
    container.setVisible(false);

    const topLeft = this.scene.add
      .image(-w / 2, -h / 2, "hudContainer", "dialog_topleft")
      .setOrigin(0);
    const top = this.scene.add
      .image(-w / 2 + 16, -h / 2, "hudContainer", "dialog_top")
      .setDisplaySize(w - 32, 16);
    const topRight = this.scene.add
      .image(w / 2, -h / 2, "hudContainer", "dialog_topright")
      .setOrigin(1, 0);
    const left = this.scene.add
      .image(-w / 2, -h / 2 + 16, "hudContainer", "dialog_left")
      .setDisplaySize(16, h - 32)
      .setOrigin(0);
    const center = this.scene.add
      .image(-w / 2 + 16, -h / 2 + 16, "hudContainer", "dialog_center")
      .setDisplaySize(w - 32, h - 32)
      .setOrigin(0);
    const right = this.scene.add
      .image(w / 2, -h / 2 + 16, "hudContainer", "dialog_right")
      .setDisplaySize(16, h - 32)
      .setOrigin(1, 0);
    const bottomLeft = this.scene.add
      .image(-w / 2, h / 2, "hudContainer", "dialog_bottomleft")
      .setOrigin(0, 1);
    const bottom = this.scene.add
      .image(-w / 2 + 16, h / 2, "hudContainer", "dialog_bottom")
      .setDisplaySize(w - 32, 16)
      .setOrigin(0, 1);
    const bottomRight = this.scene.add
      .image(w / 2, h / 2, "hudContainer", "dialog_bottomright")
      .setOrigin(1, 1);

    this.confirmText = this.scene.add
      .text(0, -10, "", {
        fontSize: "10px",
        color: "#ffffff",
        wordWrap: { width: w - 40 },
        align: "center",
      })
      .setOrigin(0.5);

    // Opções "Não" e "Sim"
    this.noText = this.scene.add
      .text(-30, 60, "Não", { fontSize: "10px", color: "#ffffff" })
      .setOrigin(0.5);
    this.yesText = this.scene.add
      .text(30, 60, "Sim", { fontSize: "10px", color: "#ffffff" })
      .setOrigin(0.5);

    container.add([
      topLeft,
      top,
      topRight,
      left,
      center,
      right,
      bottomLeft,
      bottom,
      bottomRight,
      this.confirmText,
      this.noText,
      this.yesText,
    ]);
    this.confirmBox = container;
  }

  updateHUD({
    beterraba,
    cenoura,
    tomate,
    laranja,
    terreno,
    soilQuality,
    dinheiro,
  }) {
    this.beterraba = beterraba;
    this.cenoura = cenoura;
    this.tomate = tomate;
    this.laranja = laranja;
    this.soilQuality = soilQuality;
    this.dinheiro = dinheiro;

    this.beterrabaTxt.setText(this.beterraba);
    this.cenouraTxt.setText(this.cenoura);
    this.tomateTxt.setText(this.tomate);
    this.laranjaTxt.setText(this.laranja);
    this.soilTxt.setText(`Saúde do Solo: ${this.soilQuality}`);
    this.dinheiroTxt.setText(this.dinheiro);
  }

  showDialogMessage(text) {
    // Mostra caixa de dialogo no canto superior direito
    this.dialogText.setText(text);
    this.dialogBox.setVisible(true);

    this.scene.time.delayedCall(3000, () => {
      this.dialogBox.setVisible(false);
    });
  }

  showConfirmDialog(text) {
    this.confirmText.setText(text);
    this.confirmBox.setVisible(true);
    this.highlightConfirmOption(0); // inicia em "Não"
  }

  highlightConfirmOption(index) {
    if (index === 0) {
      this.noText.setColor("#00ff00");
      this.yesText.setColor("#ffffff");
    } else {
      this.noText.setColor("#ffffff");
      this.yesText.setColor("#00ff00");
    }
  }

  hideConfirmDialog() {
    this.confirmBox.setVisible(false);
  }
}
