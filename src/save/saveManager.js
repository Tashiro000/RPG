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
    player: {
      level: 1,
      exp: 0,
      gold: 500, // 初期ゴールド
      gems: 0,   // 初期ジェム
      atk: 10,
      def: 5
    },
    party: [],       // 今後、主人公+仲間3人の編成データを入れる
    position: null,   // 今後、現在地(ダンジョン/階層等)を入れる
    inventory: [],    // 所持アイテム・武器リスト
    equipped: { weapon: null, armor: null },
    currency: { g: 500, j: 0 },
    dungeonProgress: {},
  };
  writeSave(save);
  return save;
}

/**
 * セーブデータを読み込む。存在しない場合はnullを返す。
 * 構造のマイグレーション（補正）も同時に行う。
 */
export function loadSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const save = JSON.parse(raw);

    // --- 互換性・補正処理 (マイグレーション) ---
    if (!save.player) {
      save.player = { level: 1, exp: 0, gold: 500, gems: 0, atk: 10, def: 5 };
    }
    
    // gemsが未定義の場合は0で初期化
    if (save.player.gems === undefined) {
      save.player.gems = 0;
    }

    // currency オブジェクトと player.gold / gems の同期（どちらの記法でも動くように互換維持）
    if (!save.currency) {
      save.currency = { g: save.player.gold || 0, j: save.player.gems || 0 };
    } else {
      // currency側からplayer側へ補正
      if (save.player.gold === undefined) save.player.gold = save.currency.g || 0;
      if (save.player.gems === undefined) save.player.gems = save.currency.j || 0;
    }

    if (!Array.isArray(save.inventory)) {
      save.inventory = [];
    }

    if (!save.equipped) {
      save.equipped = { weapon: null, armor: null };
    }

    return save;
  } catch (e) {
    console.error("セーブデータの読み込みに失敗しました", e);
    return null;
  }
}

/**
 * セーブデータを上書き保存する。
 */
export function writeSave(save) {
  // 保存前に player と currency の値を同期させる
  if (save.player) {
    if (!save.currency) save.currency = { g: 0, j: 0 };
    save.currency.g = save.player.gold || 0;
    save.currency.j = save.player.gems || 0;
  }

  save.updatedAt = new Date().toISOString();
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

/**
 * セーブデータを削除する(デバッグ・タイトルへ戻る等で使用)。
 */
export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}