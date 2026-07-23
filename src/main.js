// src/main.js

import { createTitleScreen } from "./ui/titleScreen.js";
import { createMainScreen } from "./ui/mainScreen.js";
import { createDungeonListScreen } from "./ui/dungeonListScreen.js";
import { createDungeonScreen } from "./ui/dungeonScreen.js";
import { createBattleScreen } from "./ui/battleScreen.js";
import { hasSave, createNewSave, loadSave, deleteSave, writeSave } from "./save/saveManager.js";
import { clearFloor } from "./dungeon/dungeonManager.js";
import { generateSeed } from "./utils/worldSeed.js";
import { addExp } from "./utils/levelUtils.js";
import { createInventoryScreen } from "./ui/inventoryScreen.js";
import { createForgeScreen } from "./ui/forgeScreen.js";
import { createGachaScreen } from "./ui/gachaScreen.js";
import { createShopScreen } from "./ui/shopScreen.js";
import { createConsumableScreen } from "./ui/consumableScreen.js";
import { createCasinoScreen } from "./ui/casinoScreen.js";
import { processBattleDrop } from "./inventory/dropManager.js";

const app = document.getElementById("app");

// トースト通知（セーブ時などのポップアップ表示）
function showNotification(message) {
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

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
    onInventory: () => showInventory(save),
    onConsumables: () => showConsumables(save),
    onShop: () => showShop(save),
    onForge: () => showForge(save),
    onGacha: () => showGacha(save),
    onCasino: () => showCasino(save),
    onSave: () => {
      writeSave(save);
      showNotification("ゲームを保存しました");
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
      showBattle(save, dungeonId, difficulty, floorNumber);
    },
  });
}

function showBattle(save, dungeonId, difficulty, floorNumber) {
  createBattleScreen(app, save, { dungeonId, difficulty, floorNumber }, {
    onBack: () => showDungeon(save, dungeonId),
    onVictory: ({ dungeonId, difficulty, floorNumber, rewards }) => {
      if (!save.player) save.player = { gold: 0, exp: 0, level: 1 };
      
      save.player.gold = (save.player.gold || 0) + (rewards?.gold || 0);
      const result = addExp(save.player, rewards?.exp || 0);

      const droppedItem = processBattleDrop(save);

      let msg = `勝利！\n${rewards?.gold || 0} G と ${rewards?.exp || 0} EXP を獲得！`;
      if (result.leveledUp) {
        msg += `\nレベルが ${result.level} に上がった！`;
      }
      if (droppedItem) {
        msg += `\n\n【ドロップ】${droppedItem.name} を手に入れた！`;
      }

      alert(msg);

      clearFloor(save, dungeonId, difficulty, floorNumber);
      writeSave(save);
      showDungeon(save, dungeonId);
    }
  });
}

function showInventory(save) {
  createInventoryScreen(app, save, {
    onBack: () => {
      writeSave(save);
      showMain(save);
    },
  });
}

function showConsumables(save) {
  createConsumableScreen(app, save, {
    onBack: () => {
      writeSave(save);
      showMain(save);
    },
    onSave: (updatedSave) => {
      writeSave(updatedSave);
    }
  });
}

function showShop(save) {
  createShopScreen(app, save, {
    onBack: () => {
      writeSave(save);
      showMain(save);
    },
    onSave: (updatedSave) => {
      writeSave(updatedSave);
    }
  });
}

function showForge(save) {
  createForgeScreen(app, save, {
    onBack: () => {
      writeSave(save);
      showMain(save);
    },
  });
}

function showGacha(save) {
  createGachaScreen(app, save, {
    onBack: () => {
      writeSave(save);
      showMain(save);
    },
  });
}

function showCasino(save) {
  createCasinoScreen(app, save, {
    onBack: () => {
      writeSave(save);
      showMain(save);
    },
    onSave: (updatedSave) => {
      writeSave(updatedSave);
    }
  });
}

showTitle();