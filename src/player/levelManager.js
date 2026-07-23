// src/player/levelManager.js

export const MAX_LEVEL = 99;

/**
 * 次のレベルに必要な経験値を計算する関数
 * @param {number} level 現在のレベル
 * @returns {number} 必要EXP
 */
export function getRequiredExp(level) {
  if (level >= MAX_LEVEL) return 0;
  return Math.floor(10 * Math.pow(level, 1.5));
}

/**
 * 経験値を獲得し、レベルアップ判定とステータス成長を行う
 * @param {Object} save セーブデータ
 * @param {number} expGained 獲得経験値
 * @returns {Object} { leveledUp: boolean, oldLevel: number, newLevel: number, messages: Array<string> }
 */
export function addExperience(save, expGained) {
  if (!save.player) save.player = {};
  
  // 初期値補正
  if (!save.player.level) save.player.level = 1;
  if (!save.player.exp) save.player.exp = 0;
  if (!save.player.maxHp) save.player.maxHp = 100;
  if (!save.player.maxMp) save.player.maxMp = 30;
  if (!save.player.atk) save.player.atk = 10;
  if (!save.player.def) save.player.def = 5;

  const oldLevel = save.player.level;
  
  // すでにカンストしている場合は処理を行わない
  if (save.player.level >= MAX_LEVEL) {
    return { leveledUp: false, oldLevel, newLevel: MAX_LEVEL, messages: [] };
  }

  save.player.exp += expGained;

  let leveledUp = false;
  const messages = [];

  // レベルアップ判定ループ
  while (save.player.level < MAX_LEVEL) {
    const reqExp = getRequiredExp(save.player.level);
    
    if (save.player.exp >= reqExp) {
      save.player.exp -= reqExp;
      save.player.level += 1;
      leveledUp = true;

      // ステータス上昇量
      const hpGain = 15;
      const mpGain = 5;
      const atkGain = 2;
      const defGain = 1;

      save.player.maxHp += hpGain;
      save.player.maxMp += mpGain;
      save.player.atk += atkGain;
      save.player.def += defGain;

      // レベルアップ時はHP/MPを上限まで全回復
      save.player.hp = save.player.maxHp;
      save.player.mp = save.player.maxMp;

      messages.push(`レベルが ${save.player.level} に上がった！ (HP+${hpGain}, MP+${mpGain}, ATK+${atkGain}, DEF+${defGain})`);
    } else {
      break;
    }
  }

  // カンストに達した場合は端数EXPをクリア
  if (save.player.level >= MAX_LEVEL) {
    save.player.exp = 0;
  }

  return {
    leveledUp,
    oldLevel,
    newLevel: save.player.level,
    messages
  };
}