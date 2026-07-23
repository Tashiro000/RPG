// src/inventory/consumableManager.js

import { SHOP_ITEMS } from "../ui/shopScreen.js";

/**
 * 消耗品を使用する関数
 * @param {Object} save セーブデータ
 * @param {string} itemId アイテムID
 * @returns {Object} { success: boolean, message: string }
 */
export function useConsumable(save, itemId) {
  if (!save.consumables || !save.consumables[itemId] || save.consumables[itemId] <= 0) {
    return { success: false, message: "アイテムを所持していません。" };
  }

  const itemDef = SHOP_ITEMS.find(i => i.id === itemId);
  if (!itemDef) {
    return { success: false, message: "未知のアイテムです。" };
  }

  // ★初期値に mp / maxMp を追加
  if (!save.player) {
    save.player = { level: 1, hp: 100, maxHp: 100, mp: 30, maxMp: 30, atk: 10, def: 5 };
  }

  let used = false;
  let message = "";

  // アイテム種別ごとの効果処理
  switch (itemId) {
    // HP回復系
    case "potion_small":
    case "potion_medium":
    case "potion_large": {
      const healAmount = itemId === "potion_small" ? 50 : itemId === "potion_medium" ? 150 : 400;
      const currentHp = save.player.hp ?? save.player.maxHp ?? 100;
      const maxHp = save.player.maxHp ?? 100;

      if (currentHp >= maxHp) {
        return { success: false, message: "HPは既に満タンです。" };
      }

      save.player.hp = Math.min(maxHp, currentHp + healAmount);
      message = `${itemDef.name}を使用し、HPが ${healAmount} 回復した！（現在のHP: ${save.player.hp}/${maxHp}）`;
      used = true;
      break;
    }

    // MP回復系 (★追加)
    case "mana_potion_small":
    case "mana_potion_large": {
      const healAmount = itemId === "mana_potion_small" ? 30 : 100;
      const currentMp = save.player.mp ?? save.player.maxMp ?? 30;
      const maxMp = save.player.maxMp ?? 30;

      if (currentMp >= maxMp) {
        return { success: false, message: "MPは既に満タンです。" };
      }

      save.player.mp = Math.min(maxMp, currentMp + healAmount);
      message = `${itemDef.name}を使用し、MPが ${healAmount} 回復した！（現在のMP: ${save.player.mp}/${maxMp}）`;
      used = true;
      break;
    }

    // 永久ステータス上昇（種系）
    case "stat_atk_seed":
      save.player.atk = (save.player.atk || 10) + 1;
      message = `${itemDef.name}を使用！ベース攻撃力が 1 上昇した！（現在: ${save.player.atk}）`;
      used = true;
      break;

    case "stat_def_seed":
      save.player.def = (save.player.def || 5) + 1;
      message = `${itemDef.name}を使用！ベース防御力が 1 上昇した！（現在: ${save.player.def}）`;
      used = true;
      break;

    case "stat_hp_seed":
      save.player.maxHp = (save.player.maxHp || 100) + 10;
      save.player.hp = (save.player.hp || 100) + 10;
      message = `${itemDef.name}を使用！最大HPが 10 上昇した！（現在: ${save.player.maxHp}）`;
      used = true;
      break;

    // 魔力の種 (★追加)
    case "stat_mp_seed":
      save.player.maxMp = (save.player.maxMp || 30) + 5;
      save.player.mp = (save.player.mp || 30) + 5;
      message = `${itemDef.name}を使用！最大MPが 5 上昇した！（現在: ${save.player.maxMp}）`;
      used = true;
      break;

    // 戦闘時バフ・ブースト系
    case "atk_elixir":
    case "def_elixir":
    case "crit_elixir":
    case "exp_scroll":
    case "gold_charm":
    case "drop_pendant":
      return { success: false, message: "このアイテムは戦闘前または探索準備画面で自動的に適用されます。" };

    default:
      return { success: false, message: "このアイテムはここでは使用できません。" };
  }

  if (used) {
    save.consumables[itemId] -= 1;
    if (save.consumables[itemId] <= 0) {
      delete save.consumables[itemId];
    }
  }

  return { success: used, message };
}