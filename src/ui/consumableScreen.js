// src/ui/consumableScreen.js

import { SHOP_ITEMS } from "./shopScreen.js";
import { useConsumable } from "../inventory/consumableManager.js";

export function createConsumableScreen(container, save, handlers = {}) {
  if (!save.consumables) save.consumables = {};

  function render() {
    const ownedItemIds = Object.keys(save.consumables).filter(id => save.consumables[id] > 0);

    container.innerHTML = `
      <div class="main-screen">
        <header class="main-header">
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <h2 style="color: var(--gold-soft); margin: 0;">所持道具（消耗品）</h2>
            <button type="button" class="footer-btn" id="back-btn">拠点へ戻る</button>
          </div>
        </header>

        <!-- 簡易プレイヤー情報 -->
        <div style="background: var(--bg-stone); padding: 0.8rem 1rem; border: 1px solid rgba(201,162,39,0.3); border-radius: 4px; margin: 1rem 0; display:flex; gap: 1.5rem; font-size: 0.9rem;">
          <div>HP: <strong style="color: #4ade80;">${save.player?.hp || 100} / ${save.player?.maxHp || 100}</strong></div>
          <div>攻撃力: <strong>${save.player?.atk || 10}</strong></div>
          <div>防御力: <strong>${save.player?.def || 5}</strong></div>
        </div>

        <!-- 消耗品リスト -->
        <div class="location-grid">
          ${ownedItemIds.length === 0 ? `<p style="color: var(--mist); grid-column: 1/-1;">使用可能な道具を持っていません。</p>` : ""}
          ${ownedItemIds.map(id => {
            const count = save.consumables[id];
            const def = SHOP_ITEMS.find(i => i.id === id) || { name: id, description: "" };

            return `
              <div class="location-card" style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color: var(--gold-soft);">${def.name}</strong>
                    <span style="font-size: 0.85rem; color: var(--mist);">x${count}</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--mist); margin: 0.5rem 0;">${def.description}</p>
                </div>
                <button type="button" class="footer-btn use-btn" data-id="${id}" style="margin-top: 0.5rem;">
                  使用する
                </button>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    // 拠点に戻る
    container.querySelector("#back-btn")?.addEventListener("click", () => {
      if (typeof handlers.onBack === "function") handlers.onBack();
    });

    // アイテム使用ボタン
    container.querySelectorAll(".use-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const itemId = btn.dataset.id;
        const res = useConsumable(save, itemId);

        if (res.message) alert(res.message);

        if (res.success) {
          if (typeof handlers.onSave === "function") handlers.onSave(save);
          render();
        }
      });
    });
  }

  render();
}