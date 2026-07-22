// titleScreen.js
// タイトル画面の生成とイベント処理を担当するモジュール。

import { hasSave } from "../save/saveManager.js";

const GAME_TITLE = "Ember & Ash";

/**
 * バージョン情報を取得する。
 */
async function loadVersion() {
  try {
    const res = await fetch("/version.json");
    if (!res.ok) throw new Error("version.json not found");
    const data = await res.json();
    return data.version ?? "0.0.0";
  } catch {
    return "0.0.2";
  }
}

function createEmbers(count = 22) {
  let html = "";
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const delay = Math.random() * 7;
    const duration = 6 + Math.random() * 4;
    const drift = (Math.random() * 40 - 20).toFixed(0) + "px";
    html += `<span class="ember-particle" style="left:${left}%; animation-delay:${delay}s; animation-duration:${duration}s; --drift:${drift};"></span>`;
  }
  return html;
}

/**
 * タイトル画面をcontainer内に描画し、各メニュー項目のコールバックを紐づける。
 * @param {HTMLElement} container
 * @param {{onNewGame?: Function, onContinue?: Function, onSettings?: Function, onExit?: Function}} handlers
 */
export async function createTitleScreen(container, handlers = {}) {
  const canContinue = hasSave();
  const version = await loadVersion();

  container.innerHTML = `
    <div class="title-screen">
      <div class="embers">${createEmbers()}</div>

      <div class="title-block">
        <p class="eyebrow">Turn-Based Fantasy RPG</p>
        <h1 class="game-title">${GAME_TITLE}</h1>
        <svg class="divider" viewBox="0 0 220 14" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
          <path d="M0 7 H85 M135 7 H220" stroke-width="1"/>
          <path d="M95 7 L110 1 L125 7 L110 13 Z" stroke-width="1"/>
        </svg>
      </div>

      <ul class="title-menu" role="menu">
        <li><button type="button" data-action="new-game" role="menuitem">New Game</button></li>
        <li><button type="button" data-action="continue" role="menuitem" ${canContinue ? "" : "disabled"}>Continue</button></li>
        <li><button type="button" data-action="settings" role="menuitem">Settings</button></li>
        <li><button type="button" data-action="exit" role="menuitem">Exit</button></li>
      </ul>

      <p class="version-tag">v${version}</p>
    </div>
  `;

  const actions = {
    "new-game": handlers.onNewGame,
    "continue": handlers.onContinue,
    "settings": handlers.onSettings,
    "exit": handlers.onExit,
  };

  container.querySelectorAll(".title-menu button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fn = actions[btn.dataset.action];
      if (typeof fn === "function") fn();
    });
  });
}