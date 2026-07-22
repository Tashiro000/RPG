import { createTitleScreen } from "./ui/titleScreen.js";
import { createMainScreen } from "./ui/mainScreen.js";
import { hasSave, createNewSave, loadSave, deleteSave, writeSave } from "./save/saveManager.js";
import { generateSeed } from "./utils/worldSeed.js";

const app = document.getElementById("app");

function showTitle() {
  createTitleScreen(app, {
    onNewGame: () => {
      if (hasSave()) {
        const overwrite = confirm("既存のセーブデータを上書きしますか？");
        if (!overwrite) return;
        deleteSave();
      }
      const seed = generateSeed();
      const save = createNewSave(seed);
      showMain(save);
    },
    onContinue: () => {
      const save = loadSave();
      if (!save) return;
      showMain(save);
    },
    onSettings: () => {
      console.log("Settings clicked");
    },
    onExit: () => {
      console.log("Exit clicked");
    },
  });
}

function showMain(save) {
  createMainScreen(app, save, {
    onDungeon: () => console.log("Dungeon clicked"),
    onInventory: () => console.log("Inventory clicked"),
    onForge: () => console.log("Forge clicked"),
    onGacha: () => console.log("Gacha clicked"),
    onCasino: () => console.log("Casino clicked"),
    onSave: () => {
      writeSave(save);
      console.log("Saved:", save);
    },
    onTitle: () => showTitle(),
  });
}

showTitle();