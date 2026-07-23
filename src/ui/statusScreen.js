// src/ui/statusScreen.js

import { getRequiredExp, MAX_LEVEL } from "../player/levelManager.js";
import { getPlayerStats } from "../inventory/inventoryManager.js";

/**
 * ステータス画面を描画する関数
 */
export function createStatusScreen(container, save, { onBack }) {
  const player = save.player || {};
  const stats = getPlayerStats(player, save.equipped || {});
  
  const currentLevel = player.level || 1;
  const currentExp = player.exp || 0;
  const reqExp = getRequiredExp(currentLevel);
  
  // EXPプログレスバーの割合計算
  const isMaxLevel = currentLevel >= MAX_LEVEL;
  const expPercent = isMaxLevel ? 100 : Math.min(100, Math.floor((currentExp / reqExp) * 100));

  container.innerHTML = `
    <div class="status-screen" style="max-width: 480px; margin: 1rem auto; padding: 1.5rem; background: var(--bg-stone); border: 1px solid var(--gold); border-radius: 8px;">
      <header style="border-bottom: 1px solid var(--gold-soft); padding-bottom: 0.5rem; margin-bottom: 1rem;">
        <h2 style="color: var(--gold-soft); margin: 0;">ステータス</h2>
      </header>

      <main style="color: var(--parchment);">
        <!-- レベル & EXP 情報 -->
        <div style="background: rgba(0,0,0,0.3); padding: 0.8rem; border-radius: 6px; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <span style="font-size: 1.2rem; font-weight: bold; color: var(--gold-soft);">Lv. ${currentLevel}</span>
            <span style="font-size: 0.85rem; color: #aaa;">
              ${isMaxLevel ? "LEVEL MAX" : `次まで: ${reqExp - currentExp} EXP (${currentExp}/${reqExp})`}
            </span>
          </div>
          <!-- EXPゲージ -->
          <div style="background: #333; height: 10px; border-radius: 5px; overflow: hidden;">
            <div style="background: #60a5fa; height: 100%; width: ${expPercent}%; transition: width 0.3s;"></div>
          </div>
        </div>

        <!-- 基本パラメータ一覧 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; font-size: 0.95rem;">
          <div style="background: rgba(0,0,0,0.2); padding: 0.6rem; border-radius: 4px;">
            <span style="color: #aaa;">最大HP:</span> <strong>${stats.totalMaxHp || player.maxHp || 100}</strong>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 0.6rem; border-radius: 4px;">
            <span style="color: #aaa;">最大MP:</span> <strong>${stats.totalMaxMp}</strong>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 0.6rem; border-radius: 4px;">
            <span style="color: #aaa;">攻撃力:</span> <strong>${stats.totalAtk}</strong>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 0.6rem; border-radius: 4px;">
            <span style="color: #aaa;">防御力:</span> <strong>${stats.totalDef}</strong>
          </div>
        </div>
      </main>

      <footer style="margin-top: 1.5rem; text-align: center;">
        <button id="btn-status-back" class="footer-btn" style="padding: 0.6rem 2rem;">戻る</button>
      </footer>
    </div>
  `;

  container.querySelector("#btn-status-back").addEventListener("click", onBack);
}