// src/player/dungeonManager.js

/**
 * ダンジョンの進行状況を取得する
 * @param {Object} save セーブデータ
 * @returns {Object} 進行データ (maxFloor, cleared など)
 */
export function getDungeonProgress(save) {
  if (!save.dungeonProgress) {
    save.dungeonProgress = {
      maxFloor: 1,
      cleared: false,
    };
  }
  return save.dungeonProgress;
}

/**
 * 階層をクリアしたときに最高到達階層を更新する
 * @param {Object} save セーブデータ
 * @param {number} currentFloor クリアした階層
 * @returns {number} 更新後の最大到達階層
 */
export function updateDungeonProgress(save, currentFloor) {
  const progress = getDungeonProgress(save);
  
  if (currentFloor >= progress.maxFloor) {
    progress.maxFloor = currentFloor + 1;
  }
  
  return progress.maxFloor;
}