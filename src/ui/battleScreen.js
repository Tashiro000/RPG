// src/ui/battleScreen.js

import { getAvailableSkills } from "../data/skills.js";
import { getPlayerStats } from "../inventory/inventoryManager.js";
import { createStatusScreen } from "./statusScreen.js"; // ★追加

export function createBattleScreen(container, save, { dungeonId, difficulty, floorNumber }, { onBack, onVictory }) {
  const stats = getPlayerStats(save.player || {}, save.equipped || {});

  if (!save.player) save.player = {};
  const maxHp = stats.totalMaxHp || save.player.maxHp || 100;
  if (save.player.hp === undefined) save.player.hp = maxHp;
  if (save.player.mp === undefined) save.player.mp = stats.totalMaxMp;

  const playerLevel = save.player.level || 1; // ★レベルの取得

  const monster = {
    name: `階層 ${floorNumber} の魔物`,
    hp: 30 + floorNumber * 15,
    maxHp: 30 + floorNumber * 15,
    atk: 5 + floorNumber * 2,
    exp: 10 + floorNumber * 5,
    gold: 15 + floorNumber * 8,
  };

  let playerHp = save.player.hp;
  let playerMp = save.player.mp;
  let monsterHp = monster.hp;

  // 再描画用の関数を定義
  function render() {
    container.innerHTML = `
      <div class="battle-screen">
        <header class="dungeon-header" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem;">
          <!-- ★左上にレベルとステータス確認ボタンを配置 -->
          <button type="button" id="btn-battle-status" class="footer-btn" style="padding: 0.2rem 0.6rem; font-size: 0.8rem; background: var(--bg-stone); border-color: var(--gold-soft); color: var(--gold-soft);">
            Lv. ${playerLevel} ステータス
          </button>
          <h2 class="dungeon-title" style="margin: 0; font-size: 1.1rem;">BATTLE - ${floorNumber}F</h2>
          <div></div> <!-- レイアウト調整用 -->
        </header>

        <main class="battle-body" style="text-align: center; margin-top: 1rem;">
          <!-- モンスター表示エリア -->
          <div class="monster-card" style="background: var(--bg-stone); border: 1px solid var(--ember); padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 8px;">
            <h3 style="color: var(--ember); font-size: 1.4rem; margin-bottom: 0.5rem;">${monster.name}</h3>
            <div class="hp-bar-bg" style="background: #333; height: 16px; border-radius: 8px; overflow: hidden; width: 80%; margin: 0 auto;">
              <div id="monster-hp-bar" style="background: var(--ember); height: 100%; width: ${Math.max(0, (monsterHp / monster.maxHp) * 100)}%; transition: width 0.3s;"></div>
            </div>
            <p style="margin-top: 0.5rem; color: var(--parchment);">HP: <span id="monster-hp-text">${Math.max(0, monsterHp)}</span> / ${monster.maxHp}</p>
          </div>

          <!-- ログ表示エリア -->
          <div id="battle-log" style="height: 100px; overflow-y: auto; background: rgba(0,0,0,0.5); border: 1px solid var(--gold); padding: 0.5rem; text-align: left; margin-bottom: 1rem; font-size: 0.9rem; color: var(--parchment);">
            <p style="color: var(--gold-soft);">${monster.name} が現れた！</p>
          </div>

          <!-- プレイヤー情報表示 -->
          <div class="player-status-card" style="background: var(--bg-stone); border: 1px solid var(--gold-soft); padding: 1rem; margin-bottom: 1rem; border-radius: 8px; max-width: 400px; margin-left: auto; margin-right: auto;">
            <h4 style="margin: 0 0 0.5rem 0; color: var(--gold-soft);">プレイヤー</h4>
            
            <div style="background: #333; height: 16px; border-radius: 8px; overflow: hidden; width: 90%; margin: 0 auto 0.5rem auto;">
              <div id="player-hp-bar" style="background: #22c55e; height: 100%; width: ${Math.max(0, Math.min(100, (playerHp / maxHp) * 100))}%; transition: width 0.3s;"></div>
            </div>

            <div style="display: flex; justify-content: center; gap: 1.5rem; color: var(--parchment); font-size: 0.95rem;">
              <div>HP: <strong id="player-hp-text" style="color: #4ade80;">${playerHp}</strong> / ${maxHp}</div>
              <div>MP: <strong id="player-mp-text" style="color: #4a90e2;">${playerMp}</strong> / ${stats.totalMaxMp}</div>
            </div>
          </div>

          <!-- コマンドボタン群 -->
          <div id="command-main" style="display: flex; justify-content: center; gap: 0.8rem; margin-bottom: 1rem;">
            <button id="btn-attack" class="equip-btn" style="padding: 0.6rem 1.5rem;">攻撃</button>
            <button id="btn-skill-menu" class="equip-btn" style="padding: 0.6rem 1.5rem; background: var(--bg-stone); border-color: #4a90e2; color: #4a90e2;">スキル</button>
            <button id="btn-escape" class="equip-btn" style="padding: 0.6rem 1.5rem;">逃げる</button>
          </div>

          <!-- スキル選択サブメニュー -->
          <div id="command-skill" style="display: none; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
            <div id="skill-list" style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;"></div>
            <button id="btn-skill-cancel" class="footer-btn" style="padding: 0.3rem 1rem; font-size: 0.85rem; margin-top: 0.5rem;">キャンセル</button>
          </div>
        </main>

        <footer class="main-footer">
          <button id="btn-back" class="footer-btn">撤退する</button>
        </footer>
      </div>
    `;

    // --- イベントリスナーの再バインド ---
    
    // ステータス画面を開くボタン
    container.querySelector("#btn-battle-status").addEventListener("click", () => {
      createStatusScreen(container, save, {
        onBack: () => {
          // ステータス画面から戻ってきたら戦闘画面を再描画
          render();
        }
      });
    });

    // ログの自動スクロール
    const logEl = container.querySelector("#battle-log");
    if (logEl) logEl.scrollTop = logEl.scrollHeight;

    // 攻撃ボタン
    container.querySelector("#btn-attack").addEventListener("click", () => {
      const dmg = Math.max(1, stats.totalAtk + Math.floor(Math.random() * 5));
      monsterHp -= dmg;
      addLog(`プレイヤーの攻撃！ ${monster.name} に ${dmg} のダメージ！`, "var(--gold-soft)");
      updateUIElements();

      if (monsterHp <= 0) {
        addLog(`${monster.name} を倒した！`, "var(--gold-soft)");
        setTimeout(() => {
          save.player.hp = maxHp;
          save.player.mp = stats.totalMaxMp;
          onVictory({
            dungeonId,
            difficulty,
            floorNumber,
            rewards: { gold: monster.gold, exp: monster.exp },
          });
        }, 800);
      } else {
        monsterTurn();
      }
    });

    // スキルメニュー
    container.querySelector("#btn-skill-menu").addEventListener("click", () => {
      container.querySelector("#command-main").style.display = "none";
      container.querySelector("#command-skill").style.display = "flex";

      const skillListEl = container.querySelector("#skill-list");
      skillListEl.innerHTML = "";
      const skills = getAvailableSkills(save);

      skills.forEach((skill) => {
        const btn = document.createElement("button");
        btn.className = "equip-btn";
        btn.style.fontSize = "0.85rem";
        btn.style.padding = "0.4rem 0.8rem";
        btn.textContent = `${skill.name} (MP:${skill.mpCost})`;

        if (playerMp < skill.mpCost) {
          btn.disabled = true;
          btn.style.opacity = "0.5";
        }

        btn.addEventListener("click", () => {
          useSkill(skill);
        });

        skillListEl.appendChild(btn);
      });
    });

    container.querySelector("#btn-skill-cancel").addEventListener("click", () => {
      container.querySelector("#command-skill").style.display = "none";
      container.querySelector("#command-main").style.display = "flex";
    });

    container.querySelector("#btn-escape").addEventListener("click", onBack);
    container.querySelector("#btn-back").addEventListener("click", onBack);
  }

  // 画面の一部要素だけを更新するヘルパー
  const updateUIElements = () => {
    const mHpText = container.querySelector("#monster-hp-text");
    const mHpBar = container.querySelector("#monster-hp-bar");
    const pHpText = container.querySelector("#player-hp-text");
    const pHpBar = container.querySelector("#player-hp-bar");
    const pMpText = container.querySelector("#player-mp-text");

    if (mHpText) mHpText.textContent = Math.max(0, monsterHp);
    if (mHpBar) mHpBar.style.width = `${Math.max(0, (monsterHp / monster.maxHp) * 100)}%`;
    if (pHpText) pHpText.textContent = Math.max(0, playerHp);
    if (pHpBar) pHpBar.style.width = `${Math.max(0, Math.min(100, (playerHp / maxHp) * 100))}%`;
    if (pMpText) pMpText.textContent = Math.max(0, playerMp);
  };

  const addLog = (msg, color = "var(--parchment)") => {
    const logEl = container.querySelector("#battle-log");
    if (!logEl) return;
    const p = document.createElement("p");
    p.style.color = color;
    p.textContent = msg;
    logEl.appendChild(p);
    logEl.scrollTop = logEl.scrollHeight;
  };

  const monsterTurn = () => {
    if (monsterHp <= 0) return;

    setTimeout(() => {
      const rawDmg = monster.atk - Math.floor(stats.totalDef / 2);
      const dmg = Math.max(1, rawDmg + Math.floor(Math.random() * 2));
      playerHp -= dmg;
      addLog(`${monster.name} の攻撃！ プレイヤーは ${dmg} のダメージを受けた！`, "var(--ember)");
      updateUIElements();

      if (playerHp <= 0) {
        addLog("あなたは敗北した...", "var(--ember)");
        setTimeout(() => {
          alert("全滅してしまった...");
          save.player.hp = maxHp;
          save.player.mp = stats.totalMaxMp;
          onBack();
        }, 1000);
      }
    }, 500);
  };

  const useSkill = (skill) => {
    if (playerMp < skill.mpCost) return;

    playerMp -= skill.mpCost;
    container.querySelector("#command-skill").style.display = "none";
    container.querySelector("#command-main").style.display = "flex";

    if (skill.type === "heal") {
      const healAmount = Math.floor(stats.totalAtk * skill.powerRatio);
      playerHp = Math.min(maxHp, playerHp + healAmount);
      addLog(`${skill.name} を唱えた！ HPが ${healAmount} 回復した！`, "#4a90e2");
      updateUIElements();
      monsterTurn();
    } else {
      const dmg = Math.floor(stats.totalAtk * skill.powerRatio + Math.floor(Math.random() * 4));
      monsterHp -= dmg;
      addLog(`${skill.name} を繰り出した！ ${monster.name} に ${dmg} のダメージ！`, "var(--gold-soft)");
      updateUIElements();

      if (monsterHp <= 0) {
        addLog(`${monster.name} を倒した！`, "var(--gold-soft)");
        setTimeout(() => {
          save.player.hp = maxHp;
          save.player.mp = stats.totalMaxMp;
          onVictory({
            dungeonId,
            difficulty,
            floorNumber,
            rewards: { gold: monster.gold, exp: monster.exp },
          });
        }, 800);
      } else {
        monsterTurn();
      }
    }
  };

  // 初回描画の実行
  render();
}