// src/ui/gachaScreen.js

import { 
  drawGacha, 
  convertGoldToGems, 
  SINGLE_GACHA_COST, 
  MULTI_GACHA_COST, 
  GOLD_PER_GEM, 
  getGachaProbabilityList 
} from "../gacha/gachaManager.js";

export function createGachaScreen(container, save, handlers = {}) {
  function render(lastResults = null) {
    const gold = save.player?.gold || 0;
    const gems = save.player?.gems || 0;

    const canAffordSingle = gems >= SINGLE_GACHA_COST;
    const canAffordMulti = gems >= MULTI_GACHA_COST;
    const probList = getGachaProbabilityList();

    container.innerHTML = `
      <div class="main-screen">
        <header class="main-header">
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <h2 style="color: var(--gold-soft); margin: 0;">装備ガチャ</h2>
            <div style="display:flex; gap:1rem; align-items:center;">
              <div style="color: var(--gold-soft); font-weight: bold;">${gold} G</div>
              <div style="color: #38bdf8; font-weight: bold;">${gems} J</div>
            </div>
            <button type="button" class="footer-btn" id="back-btn">拠点へ戻る</button>
          </div>
        </header>

        <!-- 両替エリア -->
        <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 6px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.9rem; color:var(--mist);">💎 両替: <strong>${GOLD_PER_GEM} G = 1 J</strong></span>
          <div style="display:flex; gap:0.5rem;">
            <button type="button" class="footer-btn" id="convert-1-btn" ${gold < GOLD_PER_GEM ? 'disabled style="opacity:0.5;"' : ''}>+1 J (1,000 G)</button>
            <button type="button" class="footer-btn" id="convert-10-btn" ${gold < GOLD_PER_GEM * 10 ? 'disabled style="opacity:0.5;"' : ''}>+10 J (10,000 G)</button>
          </div>
        </div>

        <div style="text-align: center; margin: 1rem 0;">
          <h3 style="color: var(--gold-soft); font-size: 1.4rem; margin-bottom: 0.25rem;">神秘の武具ガチャ</h3>
          <button type="button" class="footer-btn" id="prob-btn" style="margin-bottom: 1rem; font-size: 0.8rem;">
            📊 排出確率一覧
          </button>

          <!-- 結果表示エリア -->
          <div style="margin: 0 auto 1.5rem auto; max-width: 480px; min-height: 140px; background: var(--bg-stone); border: 2px dashed rgba(201,162,39,0.5); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            ${lastResults ? `
              <div style="font-size: 0.85rem; color: var(--mist); margin-bottom:0.5rem;">【獲得アイテム (${lastResults.length}個)】</div>
              <div style="display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:center; max-height:180px; overflow-y:auto; width:100%;">
                ${lastResults.map(item => `
                  <div style="padding: 0.4rem 0.6rem; background: rgba(0,0,0,0.4); border:1px solid ${item.color}; border-radius:4px; font-size:0.8rem; text-align:left;">
                    <strong style="color: ${item.color};">${item.name}</strong><br>
                    <span style="color: var(--gold-soft);">${item.type === "weapon" ? `攻 +${item.atk}` : `防 +${item.def}`}</span>
                  </div>
                `).join("")}
              </div>
            ` : `
              <span style="color: var(--mist);">1回10J / 10連90J で強力な武具を召喚！</span>
            `}
          </div>

          <!-- ガチャボタン群 -->
          <div style="display:flex; gap:1rem; justify-content:center;">
            <button type="button" class="equip-btn" id="draw-single-btn" ${!canAffordSingle ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} style="font-size: 1rem; padding: 10px 20px;">
              単発 (${SINGLE_GACHA_COST} J)
            </button>
            <button type="button" class="equip-btn" id="draw-multi-btn" ${!canAffordMulti ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} style="font-size: 1rem; padding: 10px 24px; background: linear-gradient(135deg, #b45309, #d97706);">
              10連 (${MULTI_GACHA_COST} J)
            </button>
          </div>
        </div>

        <!-- 排出確率表示モーダル -->
        <div id="prob-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); justify-content: center; align-items: center; z-index: 1000;">
          <div style="background: var(--bg-stone); border: 2px solid var(--gold-soft); border-radius: 8px; padding: 1.5rem; max-width: 320px; width: 90%; text-align: center;">
            <h4 style="color: var(--gold-soft); margin-top: 0; margin-bottom: 1rem;">提供割合（排出確率）</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
              ${probList.map((p) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(0,0,0,0.3); border-radius: 4px;">
                  <span style="color: ${p.color}; font-weight: bold;">${p.name}</span>
                  <span style="color: var(--gold-soft); font-weight: bold;">${p.percentage}</span>
                </div>
              `).join("")}
            </div>
            <button type="button" class="footer-btn" id="close-prob-btn" style="width: 100%;">閉じる</button>
          </div>
        </div>
      </div>
    `;

    // イベントリスナー設定
    container.querySelector("#back-btn")?.addEventListener("click", () => {
      if (typeof handlers.onBack === "function") handlers.onBack();
    });

    // 両替ボタン
    container.querySelector("#convert-1-btn")?.addEventListener("click", () => {
      const res = convertGoldToGems(save, 1);
      if (res.success) render(lastResults);
      else alert(res.reason);
    });

    container.querySelector("#convert-10-btn")?.addEventListener("click", () => {
      const res = convertGoldToGems(save, 10);
      if (res.success) render(lastResults);
      else alert(res.reason);
    });

    // 単発ガチャ
    container.querySelector("#draw-single-btn")?.addEventListener("click", () => {
      const res = drawGacha(save, 1);
      if (res.success) render(res.items);
      else alert(res.reason);
    });

    // 10連ガチャ
    container.querySelector("#draw-multi-btn")?.addEventListener("click", () => {
      const res = drawGacha(save, 10);
      if (res.success) render(res.items);
      else alert(res.reason);
    });

    // モーダル
    const modal = container.querySelector("#prob-modal");
    container.querySelector("#prob-btn")?.addEventListener("click", () => {
      if (modal) modal.style.display = "flex";
    });
    container.querySelector("#close-prob-btn")?.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }

  render();
}