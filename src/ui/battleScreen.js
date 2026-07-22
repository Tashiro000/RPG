import { BattleManager } from "../battle/battleManager.js";

export function createBattleScreen(container, save, { dungeonId, difficulty, floorNumber }, handlers = {}) {
  const battle = new BattleManager(dungeonId, difficulty, floorNumber, save.player);
  let enemy = battle.getEnemyState();

  // モンスターIDと同名の画像パスを自動生成（例: assets/monsters/mob_1_1.png）
  const imagePath = new URL(`../assets/monsters/${enemy.id}.png`, import.meta.url).href;

  function render() {
    container.innerHTML = `
      <div class="battle-screen">
        <header class="battle-header">
          <h3>${dungeonId.toUpperCase()} ${difficulty.toUpperCase()} - ${floorNumber}F</h3>
          <button type="button" id="escape-btn" class="footer-btn">逃げる</button>
        </header>

        <!-- 敵の表示カード -->
        <div id="enemy-card">
          <div class="monster-image-container">
            <img 
              src="${imagePath}" 
              alt="???" 
              class="monster-img"
              onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\' viewBox=\'0 0 120 120\'><rect width=\'120\' height=\'120\' fill=\'%23171a22\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%236b7280\' font-size=\'12\'>No Image</text></svg>';"
            />
          </div>
          <h4>モンスター (クリックで詳細)</h4>
          <p>HP: <strong>${enemy.hp} / ${enemy.maxHp}</strong></p>
          
          <!-- 詳細情報 -->
          <div id="enemy-detail" style="display: none;">
            <p>属性: ${enemy.element}</p>
            <p>防御力: ${enemy.def}</p>
          </div>
        </div>

        <div class="battle-actions">
          <button type="button" id="attack-btn">通常攻撃</button>
        </div>
      </div>
    `;

    // 詳細情報のトグル
    const enemyCard = container.querySelector("#enemy-card");
    const enemyDetail = container.querySelector("#enemy-detail");
    enemyCard.addEventListener("click", () => {
      enemyDetail.style.display = enemyDetail.style.display === "none" ? "block" : "none";
    });

    // 逃げるボタン
    container.querySelector("#escape-btn").addEventListener("click", () => {
      if (typeof handlers.onBack === "function") handlers.onBack();
    });

    // 攻撃ボタン
    container.querySelector("#attack-btn").addEventListener("click", () => {
      const result = battle.playerAttack(enemy);
      if (result && result.status === "victory") {
        alert("勝利しました！");
        if (typeof handlers.onVictory === "function") {
          handlers.onVictory({ dungeonId, difficulty, floorNumber });
        }
      } else {
        render();
      }
    });
  }

  render();
}