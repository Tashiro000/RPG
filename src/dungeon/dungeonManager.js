// dungeonManager.js
// ダンジョンの定義読み込みと、セーブデータ内の進行状況(クリア済み階層)を管理する。

import dungeons from "../../data/dungeons.json";

export function getDungeons() {
  return dungeons;
}

export function getDungeon(dungeonId) {
  return dungeons.find((d) => d.id === dungeonId);
}

function ensureProgress(save, dungeonId) {
  if (!save.dungeonProgress) save.dungeonProgress = {};
  if (!save.dungeonProgress[dungeonId]) {
    save.dungeonProgress[dungeonId] = {
      clearedFloors: { normal: 0, hard: 0, nightmare: 0 },
    };
  }
  return save.dungeonProgress[dungeonId];
}

export function getProgress(save, dungeonId) {
  return ensureProgress(save, dungeonId);
}

/**
 * 難易度が解放されているか。Normalは常に解放。
 * Hard/Nightmareは、直前の難易度を全階層クリアしていれば解放。
 */
export function isDifficultyUnlocked(save, dungeonId, difficulty) {
  const dungeon = getDungeon(dungeonId);
  const progress = ensureProgress(save, dungeonId);
  const idx = dungeon.difficulties.indexOf(difficulty);
  if (idx <= 0) return true;
  const prevDifficulty = dungeon.difficulties[idx - 1];
  return progress.clearedFloors[prevDifficulty] >= dungeon.floorsPerDifficulty;
}

/**
 * 指定の階層に入れるか。1階層目、または直前の階層をクリア済みなら解放。
 */
export function isFloorUnlocked(save, dungeonId, difficulty, floorNumber) {
  if (!isDifficultyUnlocked(save, dungeonId, difficulty)) return false;
  const progress = ensureProgress(save, dungeonId);
  return floorNumber === 1 || progress.clearedFloors[difficulty] >= floorNumber - 1;
}

/**
 * 階層をクリア済みにする。戦闘システム実装後は、戦闘勝利時にこれを呼ぶ想定。
 */
export function clearFloor(save, dungeonId, difficulty, floorNumber) {
  const progress = ensureProgress(save, dungeonId);
  if (floorNumber > progress.clearedFloors[difficulty]) {
    progress.clearedFloors[difficulty] = floorNumber;
  }
  return progress;
}