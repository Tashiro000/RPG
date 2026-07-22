import { createTitleScreen } from "./ui/titleScreen.js";
import { hasSave, createNewSave, loadSave, deleteSave } from "./save/saveManager.js";
import { generateSeed } from "./utils/worldSeed.js";

const app = document.getElementById("app");

createTitleScreen(app, {
  onNewGame: () => {
    if (hasSave()) {
      // 既にセーブがある場合の上書き確認は、後で確認ダイアログUIに置き換える
      const overwrite = confirm("既存のセーブデータを上書きしますか？");
      if (!overwrite) return;
      deleteSave();
    }
    const seed = generateSeed();
    const save = createNewSave(seed);
    console.log("New Game created:", save);
    // 今後: キャラメイキング画面 → メイン画面へ遷移
  },
  onContinue: () => {
    const save = loadSave();
    console.log("Continue with save:", save);
    // 今後: メイン画面へ遷移し、saveの内容を復元
  },
  onSettings: () => {
    console.log("Settings clicked");
  },
  onExit: () => {
    console.log("Exit clicked");
  },
});