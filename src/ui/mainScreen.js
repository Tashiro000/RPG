// src/ui/mainScreen.js

import { createStatusScreen } from "./statusScreen.js";

const LOCATIONS = [
  // --- 1列目 (4つ：ステータスボタンを除外) ---
  { action: "dungeon", label: "ダンジョン" },
  { action: "inventory", label: "装備・<br class=\"pc-only\">インベントリ" },
  { action: "consumables", label: "道具箱<br class=\"pc-only\">（消耗品）" },
  { action: "shop", label: "道具屋<br class=\"pc-only\">（ショップ）" },
  
  // --- 2列目 (3つ) ---
  { action: "forge", label: "鍛冶屋" },
  { action: "gacha", label: "ガチャ" },
  { action: "casino", label: "カジノ" },
];

function renderParty(party) {
  if (!party || party.length === 0) {
    return `<span class="party-empty">パーティ未編成</span>`;
  }
  return party
    .map((member) => `<span class="party-member">${member.name}</span>`)
    .join("");
}

export function createMainScreen(container, save, handlers = {}) {
  const gold = save?.player?.gold ?? save?.currency?.g ?? 0;
  const gem = save?.player?.gem ?? save?.currency?.j ?? 0;
  const party = save?.party || [];
  const level = save?.player?.level || 1; // プレイヤーのレベルを取得

  container.innerHTML = `
    <div class="main-screen">
      <header class="main-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <!-- 左上：ステータスを開けるレベル表示・ボタン -->
        <div class="header-status-area">
          <button type="button" id="btn-header-status" class="footer-btn" style="padding: 0.3rem 0.8rem; font-size: 0.9rem; background: var(--bg-stone); border-color: var(--gold-soft); color: var(--gold-soft);">
            Lv. ${level} ステータス
          </button>
        </div>

        <div class="currency">
          <span class="currency-item gold">G ${gold}</span>
          <span class="currency-item gem">J ${gem}</span>
        </div>
        <div class="party-summary">${renderParty(party)}</div>
      </header>

      <nav class="location-grid" role="menu">
        ${LOCATIONS.map(
          (loc) => `<button type="button" class="location-card" data-action="${loc.action}" role="menuitem">${loc.label}</button>`
        ).join("")}
      </nav>

      <footer class="main-footer">
        <button type="button" class="footer-btn" data-action="save">セーブ</button>
        <button type="button" class="footer-btn" data-action="title">タイトルへ戻る</button>
      </footer>
    </div>
  `;

  // 左上のステータスボタンのイベント登録
  const handleStatusOpen = () => {
    createStatusScreen(container, save, {
      onBack: () => {
        createMainScreen(container, save, handlers);
      }
    });
  };

  container.querySelector("#btn-header-status").addEventListener("click", handleStatusOpen);

  const actions = {
    dungeon: handlers.onDungeon,
    inventory: handlers.onInventory,
    consumables: handlers.onConsumables,
    shop: handlers.onShop,
    forge: handlers.onForge,
    gacha: handlers.onGacha,
    casino: handlers.onCasino,
    save: handlers.onSave,
    title: handlers.onTitle,
  };

  container.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fn = actions[btn.dataset.action];
      if (typeof fn === "function") fn();
    });
  });
}