import { createTitleScreen } from "./ui/titleScreen.js";
import { createMainScreen } from "./ui/mainScreen.js";
import { createDungeonListScreen } from "./ui/dungeonListScreen.js";
import { createDungeonScreen } from "./ui/dungeonScreen.js";
import { hasSave, createNewSave, loadSave, deleteSave, writeSave } from "./save/saveManager.js";
import { clearFloor } from "./dungeon/dungeonManager.js";
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
    onSettings: () => console.log("Settings clicked"),
    onExit: () => console.log("Exit clicked"),
  });
}

function showMain(save) {
  createMainScreen(app, save, {
    onDungeon: () => showDungeonList(save),
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

function showDungeonList(save) {
  createDungeonListScreen(app, {
    onSelectDungeon: (dungeonId) => showDungeon(save, dungeonId),
    onBack: () => showMain(save),
  });
}

function showDungeon(save, dungeonId) {
  createDungeonScreen(app, save, dungeonId, {
    onBack: () => showDungeonList(save),
    onEnterFloor: ({ dungeonId, difficulty, floorNumber }) => {
      // TODO: 戦闘システム実装後はここでバトル画面へ遷移し、勝利時にclearFloorを呼ぶ。
      // 現状は戦闘が無いため、進行確認用に仮クリアする。
      console.log(`(仮) ${difficulty} ${floorNumber}階 クリア`);
      clearFloor(save, dungeonId, difficulty, floorNumber);
      writeSave(save);
      showDungeon(save, dungeonId);
    },
  });
}

showTitle();