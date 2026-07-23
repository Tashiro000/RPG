// src/data/skills.js

export const ALL_SKILLS = [
  {
    id: "slash",
    name: "スラッシュ",
    mpCost: 0,
    powerRatio: 1.2,
    type: "physical",
    requiredLevel: 1,
    description: "基本の斬撃。"
  },
  {
    id: "heavy_strike",
    name: "一閃突き",
    mpCost: 8,
    powerRatio: 1.8,
    type: "physical",
    requiredLevel: 2,
    description: "高威力の突き。"
  },
  {
    id: "fireball",
    name: "ファイアボール",
    mpCost: 12,
    powerRatio: 2.2,
    type: "magic",
    requiredLevel: 3,
    description: "火炎の弾を解き放つ。"
  },
  {
    id: "heal",
    name: "ヒール",
    mpCost: 10,
    powerRatio: 1.5,
    type: "heal",
    requiredLevel: 4,
    description: "自身のHPを回復する。"
  },
  {
    id: "gigantic_flare",
    name: "ギガフレア",
    mpCost: 35,
    powerRatio: 4.0,
    type: "magic",
    requiredLevel: 8,
    description: "超極大の魔法ダメージを与える。"
  }
];

/**
 * プレイヤーのレベルに応じて利用可能なスキルを取得
 */
export function getAvailableSkills(save) {
  const level = save?.player?.level || 1;
  return ALL_SKILLS.filter(skill => level >= skill.requiredLevel);
}