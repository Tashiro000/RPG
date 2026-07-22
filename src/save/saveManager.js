// saveManager.js
// セーブデータの作成・読み込み・保存を一元管理するモジュール。
// 現状はlocalStorageで実装。将来的にファイル保存等に変更する場合はこの中身のみ差し替える。

const SAVE_KEY = "rpg_save";
const SAVE_VERSION = 1;

/**
 * セーブデータが存在するかを判定する。
 */
export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * 新規セーブデータを作成し、保存する。
 * @param {string} seed ワールドシード
 */
export function createNewSave(seed) {
  const save = {
    saveVersion: SAVE_VERSION,
    seed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    playtimeSeconds: 0,
    party: [],       // 今後、主人公+仲間3人の編成データを入れる
    position: null,   // 今後、現在地(ダンジョン/階層等)を入れる
    inventory: {},    // 今後、所持アイテム・武器を入れる
    currency: { g: 0, j: 0 },
    dungeonProgress: {},
  };
  writeSave(save);
  return save;
}

/**
 * セーブデータを読み込む。存在しない場合はnullを返す。
 */
export function loadSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    console.error("セーブデータの読み込みに失敗しました");
    return null;
  }
}

/**
 * セーブデータを上書き保存する。
 */
export function writeSave(save) {
  save.updatedAt = new Date().toISOString();
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

/**
 * セーブデータを削除する(デバッグ・タイトルへ戻る等で使用)。
 */
export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}