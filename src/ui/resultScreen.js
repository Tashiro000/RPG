// src/ui/resultScreen.js

import { addExperience } from "../player/levelManager.js";

/**
 * 戦闘勝利・ダンジョンクリア後のリザルト画面
 * @param {HTMLElement} container 描画先のコンテナ
 * @param {Object} save セーブデータ
 * @param {Object} resultData { rewards: { gold: number, exp: number }, floorNumber: number }
 * @param {Object} callbacks { onContinue: Function, onReturnToHub: Function }
 */
export function createResultScreen(container, save, { rewards, floorNumber }, { onContinue, onReturnToHub }) {
  const goldGained = rewards?.gold || 0;
  const expGained = rewards?.exp || 0;

  // 1. ゴールドの加算
  if (!save.player.gold) save.player.gold = 0;
  save.player.gold += goldGained;

  // 2. 経験値加算とレベルアップ判定
  const expResult = addExperience(save, expGained);

  container.innerHTML = `
    <div class="result-screen" style="max-width: 480px; margin: 2rem auto; padding: 1.5rem; background: var(--bg-stone); border: 1px solid var(--gold); border-radius: 8px; text-align: center;">
      <h2 style="color: var(--gold-soft); margin-bottom: 1rem;">VICTORY - ${floorNumber}F 突破！</h2>

      <!-- 獲得報酬エリア -->
      <div style="background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; text-align: left;">
        <h3 style="color: var(--parchment); font-size: 1.1rem; margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 0.5rem;">獲得報酬</h3>
        <p style="color: var(--gold-soft); font-size: 1.1rem; margin: 0.5rem 0;">💰 所持金: +${goldGained} G</p>
        <p style="color: #60a5fa; font-size: 1.1rem; margin: 0.5rem 0;">✨ 獲得EXP: +${expGained}</p>
      </div>

      <!-- レベルアップ通知エリア -->
      ${expResult.leveledUp ? `
        <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; text-align: left;">
          <h3 style="color: #4ade80; margin-top: 0; font-size: 1.1rem;">🎉 LEVEL UP!</h3>
          <p style="color: #ffffff; font-weight: bold; margin: 0.3rem 0;">Lv.${expResult.oldLevel} ➔ Lv.${expResult.newLevel}</p>
          ${expResult.messages.map(msg => `<p style="color: var(--parchment); font-size: 0.85rem; margin: 0.2rem 0;">• ${msg}</p>`).join("")}
        </div>
      ` : ""}

      <!-- 次の行動ボタン -->
      <div style="display: flex; gap: 1rem; justify-content: center;">
        ${onContinue ? `<button id="btn-next-floor" class="equip-btn" style="padding: 0.75rem 1.5rem; flex: 1;">次の階層へ</button>` : ""}
        <button id="btn-hub" class="footer-btn" style="padding: 0.75rem 1.5rem; flex: 1;">拠点に戻る</button>
      </div>
    </div>
  `;

  // イベント設定
  const nextBtn = container.querySelector("#btn-next-floor");
  if (nextBtn && onContinue) {
    nextBtn.addEventListener("click", onContinue);
  }

  const hubBtn = container.querySelector("#btn-hub");
  if (hubBtn && onReturnToHub) {
    hubBtn.addEventListener("click", onReturnToHub);
  }
}