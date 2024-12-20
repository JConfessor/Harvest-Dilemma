// hud.js

import Phaser, { Scene } from "phaser";
import { CONFIG } from "../config";

export default class HUD extends Phaser.GameObjects.Container {
  beterraba = 0;
  cenoura = 0;
  tomate = 0;
  laranja = 0;
  soilQuality = "100%";
  dinheiro = 0;

  beterrabaTxt;
  cenouraTxt;
  tomateTxt;
  laranjaTxt;
  dinheiroTxt;
  soilTxt;

  dialogBox;
  dialogText;
  dialogBoxElements;

  confirmBox;
  confirmText;
  yesText;
  noText;

  storeBox;
  storeText;
  storeOptions = [
    "Auto regar/colher (1000 moedas)",
    "Cuidar do solo +10% (250 moedas)",
    "Adubo especial +5% solo (150 moedas)",
    "Sementes especiais (200 moedas)",
    "Fechar",
  ];
  selectedStoreOption = 0;
  storeOptionTexts = [];

  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setScrollFactor(0);

    this.createHud();
    this.createDialogBox();
    this.createConfirmDialog();
    this.createStoreMenu();
  }

  createHud() {
    const tile = CONFIG.TILE_SIZE;
    const widthDialog = 175;
    const heightDialog = 2 * tile;
    const hudFont = { fontSize: "12px", color: "#ffffff" };

    this.conteudo = this.add(new Phaser.GameObjects.Container(this.scene));
    this.conteudo.setDepth(10);
    this.conteudo.setScrollFactor(0);

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

      this.scene.add.image(23, 23, "hud", "beterraba.png"),
      (this.beterrabaTxt = this.scene.add.text(33, 18, "0", hudFont)),
      this.scene.add.image(55, 23, "hud", "cenoura.png"),
      (this.cenouraTxt = this.scene.add.text(65, 18, "0", hudFont)),
      this.scene.add.image(87, 23, "hud", "tomate.png"),
      (this.tomateTxt = this.scene.add.text(97, 18, "0", hudFont)),
      this.scene.add.image(119, 23, "hud", "laranja.png"),
      (this.laranjaTxt = this.scene.add.text(129, 18, "0", hudFont)),
      (this.soilTxt = this.scene.add.text(
        20,
        55,
        "Saúde do Solo: 100%",
        hudFont
      )),
      this.scene.add
        .image(155, 33, "hud", "coin_16.png")
        .setDisplaySize(16, 16),
      (this.dinheiroTxt = this.scene.add.text(165, 27, "0", hudFont)),
    ]);
  }

  createDialogBox() {
    const w = 200;
    const h = 60;
    const x = this.scene.cameras.main.width - w / 2 - 10;
    const y = 30;

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
    this.dialogBoxElements = {
      topLeft,
      top,
      topRight,
      left,
      center,
      right,
      bottomLeft,
      bottom,
      bottomRight,
    };
    this.dialogBox = container;
  }

  adjustDialogBoxSize() {
    let textHeight = this.dialogText.getBounds().height;
    let textWidth = this.dialogText.getBounds().width;
    const w = Math.max(200, textWidth + 60);
    const h = Math.max(60, textHeight + 40);

    const {
      topLeft,
      top,
      topRight,
      left,
      center,
      right,
      bottomLeft,
      bottom,
      bottomRight,
    } = this.dialogBoxElements;

    topLeft.setPosition(-w / 2, -h / 2);
    top.setPosition(-w / 2 + 16, -h / 2).setDisplaySize(w - 32, 16);
    topRight.setPosition(w / 2, -h / 2);
    left.setPosition(-w / 2, -h / 2 + 16).setDisplaySize(16, h - 32);
    center.setPosition(-w / 2 + 16, -h / 2 + 16).setDisplaySize(w - 32, h - 32);
    right.setPosition(w / 2, -h / 2 + 16).setDisplaySize(16, h - 32);
    bottomLeft.setPosition(-w / 2, h / 2);
    bottom.setPosition(-w / 2 + 16, h / 2).setDisplaySize(w - 32, 16);
    bottomRight.setPosition(w / 2, h / 2);
    this.dialogText.setWordWrapWidth(w - 40);
  }

  createConfirmDialog() {
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

  createStoreMenu() {
    const w = 250;
    const h = 230;
    const x = this.scene.cameras.main.width / 2;
    const y = this.scene.cameras.main.height / 2;

    this.storeBox = this.scene.add
      .container(x, y)
      .setDepth(102)
      .setScrollFactor(0);
    this.storeBox.setVisible(false);

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

    this.storeText = this.scene.add
      .text(0, -70, "Loja:", {
        fontSize: "12px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    let startY = -30;
    for (let i = 0; i < this.storeOptions.length; i++) {
      let opt = this.scene.add
        .text(0, startY + i * 30, this.storeOptions[i], {
          fontSize: "10px",
          color: "#ffffff",
        })
        .setOrigin(0.5);
      this.storeOptionTexts.push(opt);
    }

    this.storeBox.add([
      topLeft,
      top,
      topRight,
      left,
      center,
      right,
      bottomLeft,
      bottom,
      bottomRight,
      this.storeText,
      ...this.storeOptionTexts,
    ]);
  }

  highlightStoreOption(index) {
    for (let i = 0; i < this.storeOptionTexts.length; i++) {
      if (i === index) {
        this.storeOptionTexts[i].setColor("#00ff00");
      } else {
        this.storeOptionTexts[i].setColor("#ffffff");
      }
    }
  }

  openStoreMenu() {
    this.selectedStoreOption = 0;
    this.storeBox.setVisible(true);
    this.highlightStoreOption(this.selectedStoreOption);
  }

  closeStoreMenu() {
    this.storeBox.setVisible(false);
  }

  moveStoreSelection(dir) {
    this.selectedStoreOption += dir;
    if (this.selectedStoreOption < 0)
      this.selectedStoreOption = this.storeOptions.length - 1;
    if (this.selectedStoreOption >= this.storeOptions.length)
      this.selectedStoreOption = 0;
    this.highlightStoreOption(this.selectedStoreOption);
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
    this.dialogText.setText(text);
    this.dialogBox.setVisible(true);
    this.scene.time.delayedCall(10, () => {
      this.adjustDialogBoxSize();
    });
    this.scene.time.delayedCall(3000, () => {
      this.dialogBox.setVisible(false);
    });
  }

  showConfirmDialog(text) {
    this.confirmText.setText(text);
    this.confirmBox.setVisible(true);
    this.highlightConfirmOption(0);
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
