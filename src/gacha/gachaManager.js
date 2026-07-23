// src/gacha/gachaManager.js

import { addItem } from "../inventory/inventoryManager.js";

export const SINGLE_GACHA_COST = 10; // 1回 10 J
export const MULTI_GACHA_COST = 90;   // 10連 90 J (10Jお得!)
export const GOLD_PER_GEM = 1000;    // 1000 G = 1 J

// レアリティ排出確率定義 (計100%)
export const GACHA_RARITIES = [
  { id: "immortal", name: "Immortal", color: "#e11d48", multiplier: 3.5, chance: 0.0001 }, // 0.01%
  { id: "legendary", name: "Legendary", color: "#ff8c00", multiplier: 2.2, chance: 0.0499 }, // 4.99%
  { id: "epic", name: "Epic", color: "#a855f7", multiplier: 1.8, chance: 0.15 },            // 15%
  { id: "rare", name: "Rare", color: "#4169e1", multiplier: 1.4, chance: 0.30 },             // 30%
  { id: "common", name: "Common", color: "#a9a9a9", multiplier: 1.0, chance: 0.50 }        // 50%
];

// ベースアイテムリスト
const GACHA_ITEMS = [
  { id: "gacha_sword", name: "英雄の剣", type: "weapon", baseAtk: 12 },
  { id: "gacha_spear", name: "龍の槍", type: "weapon", baseAtk: 15 },
  { id: "gacha_staff", name: "賢者の杖", type: "weapon", baseAtk: 10 },
  { id: "gacha_bow", name: "月影の弓", type: "weapon", baseAtk: 14 },
  { id: "gacha_plate", name: "聖なる鎧", type: "armor", baseDef: 10 },
  { id: "gacha_shield", name: "神木の大盾", type: "armor", baseDef: 8 },

  // Immortal 専用超神話武具 (5種類)
  { id: "immortal_sword", name: "終焉を齎す神剣ラグナロク", type: "weapon", baseAtk: 30, isImmortalExclusive: true },
  { id: "immortal_spear", name: "貫穿せし霊槍ロンギヌス", type: "weapon", baseAtk: 32, isImmortalExclusive: true },
  { id: "immortal_scythe", name: "冥界の断罪大鎌デスサイズ", type: "weapon", baseAtk: 35, isImmortalExclusive: true },
  { id: "immortal_armor", name: "絶対不可侵イージスの神鎧", type: "armor", baseDef: 25, isImmortalExclusive: true },
  { id: "immortal_shield", name: "不滅の星盾アイギス", type: "armor", baseDef: 28, isImmortalExclusive: true }
];

function getRandomRarity() {
  const rand = Math.random();
  let cumulative = 0;
  for (const rarity of GACHA_RARITIES) {
    cumulative += rarity.chance;
    if (rand <= cumulative) return rarity;
  }
  return GACHA_RARITIES[GACHA_RARITIES.length - 1];
}

/**
 * ゴールドをジェムに変換する (1000 G -> 1 J)
 */
export function convertGoldToGems(save, gemAmount = 1) {
  if (!save.player) save.player = {};
  const currentGold = save.player.gold || 0;
  const cost = gemAmount * GOLD_PER_GEM;

  if (currentGold < cost) {
    return { success: false, reason: `${cost} G 足りません` };
  }

  save.player.gold -= cost;
  save.player.gems = (save.player.gems || 0) + gemAmount;

  return { success: true, gemsAdded: gemAmount, remainingGold: save.player.gold };
}

/**
 * 1個のガチャアイテムを生成して保存
 */
function generateOneGachaItem(save) {
  const rarity = getRandomRarity();

  let availableBases = GACHA_ITEMS.filter(item => !item.isImmortalExclusive);
  if (rarity.id === "immortal") {
    availableBases = GACHA_ITEMS.filter(item => item.isImmortalExclusive);
  }

  const base = availableBases[Math.floor(Math.random() * availableBases.length)];
  const variance = 0.95 + Math.random() * 0.1;

  const generatedItem = {
    id: base.id,
    name: `${rarity.name === 'Common' ? '' : rarity.name + ' '}${base.name}`,
    type: base.type,
    rarity: rarity.id,
    rarityName: rarity.name,
    color: rarity.color,
  };

  if (base.type === "weapon") {
    generatedItem.atk = Math.max(1, Math.round(base.baseAtk * rarity.multiplier * variance));
  } else {
    generatedItem.def = Math.max(1, Math.round(base.baseDef * rarity.multiplier * variance));
  }

  return addItem(save, generatedItem);
}

/**
 * ガチャを引く (1回または10連)
 */
export function drawGacha(save, count = 1) {
  if (!save.player) save.player = {};
  const currentGems = save.player.gems || 0;
  const cost = count === 10 ? MULTI_GACHA_COST : SINGLE_GACHA_COST * count;

  if (currentGems < cost) {
    return { success: false, reason: "ジェムが足りません" };
  }

  // ジェム消費
  save.player.gems -= cost;

  const results = [];
  for (let i = 0; i < count; i++) {
    const item = generateOneGachaItem(save);
    results.push(item);
  }

  return { success: true, items: results };
}

/**
 * 排出確率一覧データを取得する
 */
export function getGachaProbabilityList() {
  return GACHA_RARITIES.map((r) => ({
    name: r.name,
    color: r.color,
    percentage: r.chance < 0.01 ? `${(r.chance * 100).toFixed(2)}%` : `${(r.chance * 100).toFixed(0)}%`
  }));
}