import { createTitleScreen } from "./ui/titleScreen.js";

const app = document.getElementById("app");

createTitleScreen(app, {
  onNewGame: () => {
    // 例: ワールドシード生成 → キャラメイキング画面へ遷移
    console.log("New Game clicked");
  },
  onContinue: () => {
    // 例: セーブデータ読み込み → メイン画面へ遷移
    console.log("Continue clicked");
  },
  onSettings: () => {
    // 例: 設定画面（音量, キー設定等）を表示
    console.log("Settings clicked");
  },
  onExit: () => {
    // ブラウザ上ではタブを閉じられないため確認ダイアログ等に留める想定
    console.log("Exit clicked");
  },
});