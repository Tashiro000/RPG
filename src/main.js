import { createTitleScreen } from "./ui/titleScreen.js";
import { createMainScreen } from "./ui/mainScreen.js";
import { createDungeonListScreen } from "./ui/dungeonListScreen.js";
import { createDungeonScreen } from "./ui/dungeonScreen.js";
import { createBattleScreen } from "./ui/battleScreen.js"; // 戦闘画面をインポート
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
      // 階層カードクリック時に戦闘画面へ遷移
      showBattle(save, dungeonId, difficulty, floorNumber);
    },
  });
}

// 戦闘画面の表示処理
function showBattle(save, dungeonId, difficulty, floorNumber) {
  createBattleScreen(app, save, { dungeonId, difficulty, floorNumber }, {
    onBack: () => showDungeon(save, dungeonId),
    onVictory: ({ dungeonId, difficulty, floorNumber }) => {
      // 勝利時に進行度を更新して保存し、ダンジョン画面に戻る
      clearFloor(save, dungeonId, difficulty, floorNumber);
      writeSave(save);
      showDungeon(save, dungeonId);
    }
  });
}

// アプリの開始
showTitle();