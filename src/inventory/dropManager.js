// src/inventory/dropManager.js

import { addItem } from "./inventoryManager.js";

// レアリティの定義（ドロップ確率）
export const RARITIES = [
  { id: "immortal", name: "Immortal", color: "#e11d48", multiplier: 3.5, chance: 0.0001 }, // 0.01%
  { id: "legendary", name: "Legendary", color: "#ff8c00", multiplier: 2.2, chance: 0.05 },  // 5%
  { id: "epic", name: "Epic", color: "#a855f7", multiplier: 1.8, chance: 0.15 },            // 15%
  { id: "rare", name: "Rare", color: "#4169e1", multiplier: 1.4, chance: 0.30 },             // 30%
  { id: "common", name: "Common", color: "#a9a9a9", multiplier: 1.0, chance: 0.4999 }        // 約 49.99%
];

// BASE_ITEMS 部分（baseMp を追加して魔法系装備にMPボーナスを定義）
const BASE_ITEMS = [
  // --- Common (6種: Rank 1~) ---
  { id: "sword", name: "鉄の剣", type: "weapon", baseAtk: 5, minRank: 1 },
  { id: "axe", name: "両手斧", type: "weapon", baseAtk: 8, minRank: 1 },
  { id: "spear", name: "スピア", type: "weapon", baseAtk: 6, minRank: 1 },
  { id: "dagger", name: "短剣", type: "weapon", baseAtk: 4, minRank: 1 },
  { id: "staff", name: "見習いの杖", type: "weapon", baseAtk: 3, baseMp: 15, minRank: 1 }, // ★追加
  { id: "leather_armor", name: "革の鎧", type: "armor", baseDef: 3, minRank: 1 },
  { id: "shield", name: "木製の大盾", type: "armor", baseDef: 4, minRank: 1 },

  // --- Rare (Rank 2~) ---
  { id: "steel_sword", name: "鋼鉄の長剣", type: "weapon", baseAtk: 10, minRank: 2 },
  { id: "silver_blade", name: "銀の魔術剣", type: "weapon", baseAtk: 11, baseMp: 20, minRank: 2 }, // ★追加
  { id: "flame_saber", name: "炎のセイバー", type: "weapon", baseAtk: 13, minRank: 2 },
  { id: "ice_rapier", name: "氷結のレイピア", type: "weapon", baseAtk: 12, minRank: 2 },
  { id: "thunder_spear", name: "雷鳴の槍", type: "weapon", baseAtk: 14, minRank: 2 },
  { id: "heavy_mace", name: "ヘビーメイス", type: "weapon", baseAtk: 15, minRank: 2 },
  { id: "composite_bow", name: "コンポジットボウ", type: "weapon", baseAtk: 12, minRank: 2 },
  { id: "battle_axe", name: "戦斧", type: "weapon", baseAtk: 16, minRank: 2 },
  { id: "steel_plate", name: "鋼鉄の胸甲", type: "armor", baseDef: 8, minRank: 2 },
  { id: "mithril_mail", name: "ミスリルチェイン", type: "armor", baseDef: 9, minRank: 2 },
  { id: "knight_shield", name: "騎士の盾", type: "armor", baseDef: 7, minRank: 2 },
  { id: "mage_robe", name: "魔導士の法衣", type: "armor", baseDef: 6, baseMp: 25, minRank: 2 }, // ★追加
  { id: "chain_mail", name: "鎖帷子", type: "armor", baseDef: 7, minRank: 2 },
  { id: "tower_shield", name: "タワーシールド", type: "armor", baseDef: 10, minRank: 2 },

  // --- Epic (Rank 3~) ---
  { id: "shadow_blade", name: "影打ちの太刀", type: "weapon", baseAtk: 18, minRank: 3 },
  { id: "dragon_slayer", name: "竜殺しの大剣", type: "weapon", baseAtk: 22, minRank: 3 },
  { id: "blood_scythe", name: "吸血の大鎌", type: "weapon", baseAtk: 20, minRank: 3 },
  { id: "holy_mace", name: "聖なるメイス", type: "weapon", baseAtk: 19, baseMp: 30, minRank: 3 }, // ★追加
  { id: "wind_bow", name: "疾風の大弓", type: "weapon", baseAtk: 18, minRank: 3 },
  { id: "dragon_scale", name: "竜鱗の鎧", type: "armor", baseDef: 14, minRank: 3 },
  { id: "dark_cloak", name: "暗黒のマント", type: "armor", baseDef: 12, baseMp: 35, minRank: 3 }, // ★追加
  { id: "phantom_shield", name: "幻影の大盾", type: "armor", baseDef: 15, minRank: 3 },
  { id: "valkyrie_mail", name: "戦乙女の鎧", type: "armor", baseDef: 16, minRank: 3 },
  { id: "demon_helm", name: "悪魔の兜", type: "armor", baseDef: 13, minRank: 3 },

  // --- Legendary (Rank 4~) ---
  { id: "excalibur_drop", name: "聖剣エクスカリバー", type: "weapon", baseAtk: 28, baseMp: 50, minRank: 4 }, // ★追加
  { id: "muramasa", name: "妖刀村正", type: "weapon", baseAtk: 30, minRank: 4 },
  { id: "gungnir", name: "神槍グングニル", type: "weapon", baseAtk: 29, minRank: 4 },
  { id: "mjolnir", name: "雷神の槌ミョルニル", type: "weapon", baseAtk: 32, minRank: 4 },
  { id: "dragon_god_armor", name: "神竜の胸甲", type: "armor", baseDef: 22, minRank: 4 },
  { id: "aegis_shield_drop", name: "神護のシールド", type: "armor", baseDef: 24, minRank: 4 },
  { id: "celestial_robe", name: "天界の羽衣", type: "armor", baseDef: 20, baseMp: 60, minRank: 4 }, // ★追加
  { id: "titan_plate", name: "巨人の神甲", type: "armor", baseDef: 25, minRank: 4 },

  // --- Immortal (Rank 5) ---
  { id: "immortal_sword", name: "終焉を齎す神剣ラグナロク", type: "weapon", baseAtk: 40, baseMp: 100, isImmortalExclusive: true }, // ★追加
  { id: "immortal_spear", name: "貫穿せし霊槍ロンギヌス", type: "weapon", baseAtk: 42, isImmortalExclusive: true },
  { id: "immortal_scythe", name: "冥界の断罪大鎌デスサイズ", type: "weapon", baseAtk: 45, isImmortalExclusive: true },
  { id: "immortal_armor", name: "絶対不可侵イージスの神鎧", type: "armor", baseDef: 35, isImmortalExclusive: true },
  { id: "immortal_shield", name: "不滅の星盾アイギス", type: "armor", baseDef: 38, baseMp: 80, isImmortalExclusive: true } // ★追加
];

function getRandomRarity() {
  const rand = Math.random();
  let cumulative = 0;
  for (const rarity of RARITIES) {
    cumulative += rarity.chance;
    if (rand <= cumulative) return rarity;
  }
  return RARITIES[RARITIES.length - 1]; // fallback Common
}

/**
 * 戦闘勝利時のドロップ処理 (ドロップ率 30%)
 */
export function processBattleDrop(save) {
  const dropChance = 0.30;
  if (Math.random() > dropChance) return null;

  const rarity = getRandomRarity();

  let availableBases = BASE_ITEMS.filter(item => !item.isImmortalExclusive);
  
  // イモータルの場合、神話級武具から優先抽出
  if (rarity.id === "immortal") {
    availableBases = BASE_ITEMS.filter(item => item.isImmortalExclusive);
  }

  const base = availableBases[Math.floor(Math.random() * availableBases.length)];
  const variance = 0.9 + Math.random() * 0.2; // 0.9 ~ 1.1

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

  // ★追加：ベースに baseMp があれば bonusMp を計算・保存
  if (base.baseMp) {
    generatedItem.bonusMp = Math.max(1, Math.round(base.baseMp * rarity.multiplier * variance));
  }

  const savedItem = addItem(save, generatedItem);
  return savedItem;
}