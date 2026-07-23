// src/ui/forgeScreen.js
import { enhanceItem, getEnhanceCost } from "../inventory/inventoryManager.js";

export function createForgeScreen(container, save, handlers = {}) {
  if (!Array.isArray(save.inventory)) save.inventory = [];

  function render() {
    const inventoryList = save.inventory;
    const gold = save.player?.gold || 0;

    container.innerHTML = `
      <div class="main-screen">
        <header class="main-header">
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <h2 style="color: var(--gold-soft); margin: 0;">鍛冶屋 (装備強化)</h2>
            <div style="color: var(--gold-soft); font-weight: bold;">所持金: ${gold} G</div>
            <button type="button" class="footer-btn" id="back-btn">拠点へ戻る</button>
          </div>
        </header>

        <p style="color: var(--mist); margin: 1rem 0;">
          ゴールドを消費して装備を強化 (+1) できます。最大+10まで強化可能です。
        </p>

        <div class="location-grid">
          ${inventoryList.length === 0 ? `<p style="color: var(--mist);">強化できる装備を持っていません</p>` : ""}
          ${inventoryList.map((item) => {
            const currentLevel = item.enhanceLevel || 0;
            const isMax = currentLevel >= 10;
            const cost = getEnhanceCost(item);
            const canAfford = gold >= cost && !isMax;
            const itemColor = item.color || "var(--gold-soft)";

            return `
              <div class="location-card" style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color: ${itemColor};">${item.name}</strong>
                    ${item.rarityName ? `<span style="font-size: 0.75rem; color: ${itemColor};">[${item.rarityName}]</span>` : ''}
                  </div>
                  <p style="font-size: 0.85rem; color: var(--mist); margin: 0.5rem 0;">
                    ${item.type === "weapon" ? `攻撃力: ${item.atk}` : `防御力: ${item.def}`}
                    ${isMax ? `<span style="color: #ef4444; font-weight: bold; margin-left: 6px;">[MAX +10]</span>` : ''}
                  </p>
                </div>

                ${isMax ? `
                  <button type="button" class="equip-btn" disabled style="opacity: 0.5; cursor: not-allowed; margin-top: 0.5rem; width: 100%;">
                    強化完了 (MAX)
                  </button>
                ` : `
                  <button type="button" class="enhance-btn equip-btn" data-id="${item.instanceId}" 
                    ${!canAfford ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} style="margin-top: 0.5rem; width: 100%;">
                    強化する (${cost} G)
                  </button>
                `}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    container.querySelector("#back-btn")?.addEventListener("click", () => {
      if (typeof handlers.onBack === "function") handlers.onBack();
    });

    container.querySelectorAll(".enhance-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const res = enhanceItem(save, btn.dataset.id);
        if (res.success) {
          alert(`【強化成功！】\n${res.item.name} に強化された！`);
        } else {
          alert(res.reason);
        }
        render();
      });
    });
  }

  render();
}