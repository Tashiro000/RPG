/**
 * 指定レベルに必要な累計経験値を計算
 */
export function getRequiredExp(level) {
  // レベルが上がるごとに必要EXPが次乗で増える計算式（調整可能）
  return Math.floor(10 * Math.pow(level, 1.5));
}

/**
 * 経験値を獲得し、レベルアップ判定を行う
 * @param {Object} player - セーブデータ内のプレイヤーオブジェクト
 * @param {number} expGained - 獲得経験値
 * @returns {Object} { newLevel, leveledUp }
 */
export function addExp(player, expGained) {
  player.exp = (player.exp || 0) + expGained;
  let leveledUp = false;

  while (player.exp >= getRequiredExp(player.level)) {
    player.level += 1;
    leveledUp = true;
    
    // レベルアップ時の基本ステータス上昇（簡易例）
    player.maxHp = (player.maxHp || 100) + 15;
    player.hp = player.maxHp; // レベルアップ時はHP全回復
    player.atk = (player.atk || 10) + 3;
    player.def = (player.def || 5) + 2;
  }

  return { level: player.level, leveledUp };
}