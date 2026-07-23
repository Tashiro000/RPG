// src/inventory/inventoryManager.js

const MAX_ENHANCE_LEVEL = 10;

/**
 * プレイヤーに新しいアイテム/装備を追加
 */
export function addItem(save, item) {
  if (!Array.isArray(save.inventory)) {
    save.inventory = [];
  }
  const newItem = {
    ...item,
    instanceId: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
  };
  save.inventory.push(newItem);
  return newItem;
}

/**
 * 装備を装着する
 */
export function equipItem(save, instanceId) {
  if (!Array.isArray(save.inventory)) save.inventory = [];
  if (!save.equipped) save.equipped = { weapon: null, armor: null };

  const item = save.inventory.find((i) => i.instanceId === instanceId);
  if (!item || !item.type) return false;

  if (item.type === "weapon") {
    save.equipped.weapon = item;
  } else if (item.type === "armor") {
    save.equipped.armor = item;
  }

  return true;
}

/**
 * 装備を外す
 */
export function unequipItem(save, type) {
  if (save.equipped && save.equipped[type]) {
    save.equipped[type] = null;
  }
}

/**
 * アイテムの売却価格を計算する（Epic/Immortal対応）
 */
export function getItemSellPrice(item) {
  const baseStat = (item.atk || 0) + (item.def || 0) + (item.bonusMp || 0);
  let multiplier = 10; // Common
  if (item.rarity === "rare") multiplier = 25;
  if (item.rarity === "epic") multiplier = 40;
  if (item.rarity === "legendary") multiplier = 60;
  if (item.rarity === "immortal") multiplier = 200; // 超高額売却

  return Math.max(10, baseStat * multiplier);
}

/**
 * アイテムを売却してゴールドを獲得する
 */
export function sellItem(save, instanceId) {
  if (!Array.isArray(save.inventory)) return false;

  const index = save.inventory.findIndex((i) => i.instanceId === instanceId);
  if (index === -1) return false;

  const item = save.inventory[index];

  if (save.equipped?.weapon?.instanceId === instanceId || save.equipped?.armor?.instanceId === instanceId) {
    return false;
  }

  const price = getItemSellPrice(item);

  if (!save.player) save.player = {};
  save.player.gold = (save.player.gold || 0) + price;

  save.inventory.splice(index, 1);
  return { success: true, price, itemName: item.name };
}

/**
 * 指定したレアリティの装備を一括売却する
 * @param {Object} save セーブデータ
 * @param {Array<string>} targetRarities 売却対象のレアリティ配列 (例: ['common'])
 */
export function bulkSellItems(save, targetRarities = ["common"]) {
  if (!Array.isArray(save.inventory) || save.inventory.length === 0) {
    return { success: false, count: 0, earnedGold: 0 };
  }

  let totalGold = 0;
  let soldCount = 0;

  // 装備中のアイテムのinstanceIdを取得（売却から除外するため）
  const equippedInstanceIds = [
    save.equipped?.weapon?.instanceId,
    save.equipped?.armor?.instanceId
  ].filter(Boolean);

  save.inventory = save.inventory.filter(item => {
    // 装備中のものは残す
    if (equippedInstanceIds.includes(item.instanceId)) return true;

    // 対象のレアリティであれば売却
    if (targetRarities.includes(item.rarity)) {
      totalGold += getItemSellPrice(item);
      soldCount++;
      return false; // インベントリから除外
    }
    return true; // 残す
  });

  if (!save.player) save.player = {};
  save.player.gold = (save.player.gold || 0) + totalGold;

  return { success: true, count: soldCount, earnedGold: totalGold };
}

/**
 * アイテムの強化費用を計算（Epic/Immortal対応）
 */
export function getEnhanceCost(item) {
  const currentLevel = item.enhanceLevel || 0;
  if (currentLevel >= MAX_ENHANCE_LEVEL) return null;

  const baseCost = (currentLevel + 1) * 100;
  let rarityMultiplier = 1.0;
  if (item.rarity === "rare") rarityMultiplier = 1.4;
  if (item.rarity === "epic") rarityMultiplier = 1.8;
  if (item.rarity === "legendary") rarityMultiplier = 2.5;
  if (item.rarity === "immortal") rarityMultiplier = 5.0;

  let typeMultiplier = 1.0;
  if (item.id === "axe" || item.id === "steel_plate") typeMultiplier = 1.2;
  if (item.id === "shield" || item.id === "leather_armor") typeMultiplier = 0.8;

  return Math.round(baseCost * rarityMultiplier * typeMultiplier);
}

/**
 * アイテムを強化する
 */
export function enhanceItem(save, instanceId) {
  if (!Array.isArray(save.inventory)) return { success: false, reason: "インベントリが空です" };

  const item = save.inventory.find((i) => i.instanceId === instanceId);
  if (!item) return { success: false, reason: "対象アイテムが見つかりません" };

  const currentLevel = item.enhanceLevel || 0;
  if (currentLevel >= MAX_ENHANCE_LEVEL) {
    return { success: false, reason: `既に最大強化 (+${MAX_ENHANCE_LEVEL}) に達しています` };
  }

  const cost = getEnhanceCost(item);
  const currentGold = save.player?.gold || 0;

  if (currentGold < cost) {
    return { success: false, reason: "ゴールドが足りません" };
  }

  save.player.gold -= cost;

  item.enhanceLevel = currentLevel + 1;
  const statIncrease = 2;

  if (item.type === "weapon") {
    item.atk = (item.atk || 0) + statIncrease;
  } else if (item.type === "armor") {
    item.def = (item.def || 0) + statIncrease;
  }

  // もしMPボーナスを持つアイテムなら強化時に少しMP増加
  if (item.bonusMp) {
    item.bonusMp += 3;
  }

  const baseName = item.rawName || item.name.replace(/\s\+\d+$/, "");
  item.rawName = baseName;
  item.name = `${baseName} +${item.enhanceLevel}`;

  return { success: true, item, cost };
}

/**
 * 装備補正込みの総合ステータスを計算する
 */
export function getPlayerStats(player = {}, equipped = {}) {
  const baseAtk = player.atk || 10;
  const baseDef = player.def || 5;
  const baseMaxMp = player.maxMp || 30; // ★プレイヤー本体の基礎最大MP

  const weaponAtk = equipped.weapon?.atk || 0;
  const armorDef = equipped.armor?.def || 0;

  // ★装備品からのボーナスMPを取得
  const weaponMp = equipped.weapon?.bonusMp || 0;
  const armorMp = equipped.armor?.bonusMp || 0;
  const totalBonusMp = weaponMp + armorMp;

  return {
    totalAtk: baseAtk + weaponAtk,
    totalDef: baseDef + armorDef,
    totalMaxMp: baseMaxMp + totalBonusMp, // ★装備補正込みの最大MP
    weaponAtk,
    armorDef,
    bonusMp: totalBonusMp, // ★合計MPボーナス
  };
}