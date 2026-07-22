// mainScreen.js
// タイトルからNew Game/Continueで遷移してくるハブ画面。
// 現時点では各コンテンツ(ダンジョン/鍛冶屋/ガチャ/カジノ/アイテム袋)は未実装のため、
// ボタンはhandlers経由でコールバックを呼ぶだけの骨組みとする。

const LOCATIONS = [
  { action: "dungeon", label: "ダンジョン" },
  { action: "inventory", label: "アイテム袋" },
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

/**
 * メイン画面をcontainer内に描画する。
 * @param {HTMLElement} container
 * @param {object} save セーブデータ(saveManager.loadSave/createNewSaveの戻り値)
 * @param {object} handlers 各ボタンのコールバック
 *   onDungeon, onInventory, onForge, onGacha, onCasino, onSave, onTitle
 */
export function createMainScreen(container, save, handlers = {}) {
  const { currency, party } = save;

  container.innerHTML = `
    <div class="main-screen">
      <header class="main-header">
        <div class="currency">
          <span class="currency-item gold">G ${currency?.g ?? 0}</span>
          <span class="currency-item gem">J ${currency?.j ?? 0}</span>
        </div>
        <div class="party-summary">${renderParty(party)}</div>
      </header>

      <nav class="location-grid" role="menu">
        ${LOCATIONS.map(
          (loc) =>
            `<button type="button" class="location-card" data-action="${loc.action}" role="menuitem">${loc.label}</button>`
        ).join("")}
      </nav>

      <footer class="main-footer">
        <button type="button" class="footer-btn" data-action="save">セーブ</button>
        <button type="button" class="footer-btn" data-action="title">タイトルへ戻る</button>
      </footer>
    </div>
  `;

  const actions = {
    dungeon: handlers.onDungeon,
    inventory: handlers.onInventory,
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