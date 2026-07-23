// src/utils/storage.js

const SAVE_KEY = "game_save_data";

// デフォルトの初期セーブデータ
export const DEFAULT_SAVE = {
  player: {
    gold: 1000,
    gem: 10,
  },
  party: [
    { id: "p1", name: "勇者", hp: 100, maxHp: 100, atk: 15, def: 10 },
  ],
  inventory: [],
  clearedFloors: [],
  lastSavedAt: null,
};

/**
 * セーブデータをローカルストレージに保存
 */
export function saveGame(data) {
  try {
    const saveData = {
      ...data,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (e) {
    console.error("Failed to save game:", e);
    return false;
  }
}

/**
 * セーブデータをローカルストレージから読み込み
 */
export function loadGame() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load game:", e);
    return null;
  }
}

/**
 * セーブデータの存在確認
 */
export function hasSaveData() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * セーブデータの削除
 */
export function deleteSaveData() {
  localStorage.removeItem(SAVE_KEY);
}