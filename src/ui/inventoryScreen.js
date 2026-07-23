// src/ui/inventoryScreen.js

import { equipItem, unequipItem, sellItem, getItemSellPrice, getPlayerStats, bulkSellItems } from "../inventory/inventoryManager.js";
import { writeSave } from "../save/saveManager.js";

let currentTypeFilter = "all"; // 'all', 'weapon', 'armor'
let currentRarityFilter = "all"; // 'all', 'common', 'rare', 'epic', 'legendary', 'immortal'
let currentSortBy = "power"; // 'power', 'rarity'

export function createInventoryScreen(container, save, handlers = {}) {
  if (!Array.isArray(save.inventory)) {
    save.inventory = [];
  }
  if (!save.equipped) {
    save.equipped = { weapon: null, armor: null };
  }

  function render() {
    const stats = getPlayerStats(save.player || {}, save.equipped);
    const equippedWeaponId = save.equipped.weapon?.instanceId;
    const equippedArmorId = save.equipped.armor?.instanceId;

    // 1. フィルター適用
    let inventoryList = [...(save.inventory || [])];
    if (currentTypeFilter !== "all") {
      inventoryList = inventoryList.filter(item => item.type === currentTypeFilter);
    }
    if (currentRarityFilter !== "all") {
      inventoryList = inventoryList.filter(item => item.rarity === currentRarityFilter);
    }

    // 2. ソート適用
    const rarityRank = { immortal: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
    inventoryList.sort((a, b) => {
      if (currentSortBy === "power") {
        const valA = a.atk || a.def || 0;
        const valB = b.atk || b.def || 0;
        return valB - valA;
      } else {
        return (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0);
      }
    });

    container.innerHTML = `
      <div class="main-screen">
        <header class="main-header">
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%; flex-wrap: wrap; gap: 10px;">
            <h2 style="color: var(--gold-soft); margin: 0;">インベントリ・装備</h2>
            <div style="color: var(--gold-soft); font-weight: bold;">所持金: ${save.player?.gold || 0} G</div>
            <button type="button" class="footer-btn" id="back-btn">拠点へ戻る</button>
          </div>
        </header>

        <!-- ステータス & 現在の装備状況 -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; margin-top: 1rem;">
          <div style="flex: 1; min-width: 200px; background: var(--bg-stone); padding: 1rem; border: 1px solid rgba(201,162,39,0.3); border-radius: 4px;">
            <h3 style="color: var(--gold-soft); margin-top:0;">プレイヤー情報</h3>
            <p>LV: ${save.player?.level || 1}</p>
            <p>攻撃力: <strong>${stats.totalAtk}</strong> (${save.player?.atk || 10} + 装備 ${stats.weaponAtk})</p>
            <p>防御力: <strong>${stats.totalDef}</strong> (${save.player?.def || 5} + 装備 ${stats.armorDef})</p>
          </div>

          <div style="flex: 1; min-width: 200px; background: var(--bg-stone); padding: 1rem; border: 1px solid rgba(201,162,39,0.3); border-radius: 4px;">
            <h3 style="color: var(--gold-soft); margin-top:0;">装備中の武具</h3>
            <p>武器: ${save.equipped.weapon ? `<span style="color:${save.equipped.weapon.color || '#fff'}">${save.equipped.weapon.name}</span>` : "なし"} 
              ${save.equipped.weapon ? `<button type="button" class="unequip-btn" id="unequip-weapon" style="font-size:0.75rem; padding: 2px 8px; margin-left: 8px;">外す</button>` : ""}
            </p>
            <p>防具: ${save.equipped.armor ? `<span style="color:${save.equipped.armor.color || '#fff'}">${save.equipped.armor.name}</span>` : "なし"} 
              ${save.equipped.armor ? `<button type="button" class="unequip-btn" id="unequip-armor" style="font-size:0.75rem; padding: 2px 8px; margin-left: 8px;">外す</button>` : ""}
            </p>
          </div>
        </div>

        <!-- ヘッダー & 一括売却 -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
          <h3 style="color: var(--gold-soft); margin: 0;">所持品一覧 (${save.inventory?.length || 0}個)</h3>
          <button type="button" class="footer-btn" id="bulk-sell-common" style="border-color: #dc2626; color: #fca5a5; font-size: 0.85rem;">
            Common装備を一括売却
          </button>
        </div>

        <!-- フィルター & ソート バー -->
        <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; background: var(--bg-stone); padding: 10px; border-radius: 4px; border: 1px solid rgba(201,162,39,0.3); font-size: 0.9rem;">
          <label style="color: var(--mist);">
            種別: 
            <select id="filter-type" style="background: #222; color: #fff; padding: 4px; border-radius: 4px; border: 1px solid #444;">
              <option value="all" ${currentTypeFilter === 'all' ? 'selected' : ''}>すべて</option>
              <option value="weapon" ${currentTypeFilter === 'weapon' ? 'selected' : ''}>武器</option>
              <option value="armor" ${currentTypeFilter === 'armor' ? 'selected' : ''}>防具</option>
            </select>
          </label>

          <label style="color: var(--mist);">
            レアリティ: 
            <select id="filter-rarity" style="background: #222; color: #fff; padding: 4px; border-radius: 4px; border: 1px solid #444;">
              <option value="all" ${currentRarityFilter === 'all' ? 'selected' : ''}>すべて</option>
              <option value="common" ${currentRarityFilter === 'common' ? 'selected' : ''}>Common</option>
              <option value="rare" ${currentRarityFilter === 'rare' ? 'selected' : ''}>Rare</option>
              <option value="epic" ${currentRarityFilter === 'epic' ? 'selected' : ''}>Epic</option>
              <option value="legendary" ${currentRarityFilter === 'legendary' ? 'selected' : ''}>Legendary</option>
              <option value="immortal" ${currentRarityFilter === 'immortal' ? 'selected' : ''}>Immortal</option>
            </select>
          </label>

          <label style="color: var(--mist);">
            並び順: 
            <select id="sort-by" style="background: #222; color: #fff; padding: 4px; border-radius: 4px; border: 1px solid #444;">
              <option value="power" ${currentSortBy === 'power' ? 'selected' : ''}>強さ順 (ATK/DEF)</option>
              <option value="rarity" ${currentSortBy === 'rarity' ? 'selected' : ''}>レアリティ順</option>
            </select>
          </label>
        </div>

        <!-- 所持アイテム一覧グリッド -->
        <div class="location-grid" id="inventory-grid">
          ${inventoryList.length === 0 ? `<p style="color: var(--mist); grid-column: 1/-1; text-align: center;">条件に一致するアイテムがありません</p>` : ""}
          ${inventoryList.map((item) => {
            const isEquipped = item.instanceId === equippedWeaponId || item.instanceId === equippedArmorId;
            const itemColor = item.color || "var(--gold-soft)";
            const sellPrice = getItemSellPrice(item);

            return `
              <div class="location-card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative; ${isEquipped ? 'border-color: var(--gold-soft); background: rgba(201,162,39,0.15);' : ''}">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color: ${itemColor};">${item.name}</strong>
                    ${isEquipped ? `<span style="background: var(--gold-soft); color: #111; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 4px;">E 装備中</span>` : ''}
                  </div>
                  <p style="font-size: 0.85rem; color: var(--mist); margin: 0.5rem 0;">
                    ${item.type === "weapon" ? `攻撃力 +${item.atk}` : `防御力 +${item.def}`}
                    ${item.rarityName ? `<span style="display:block; font-size: 0.75rem; color: ${itemColor}; margin-top:2px;">[${item.rarityName}]</span>` : ''}
                  </p>
                </div>

                <div style="display:flex; gap: 0.5rem; margin-top: 0.5rem;">
                  ${isEquipped 
                    ? `<button type="button" class="unequip-btn" data-type="${item.type}" style="font-size: 0.8rem; flex: 1;">外す</button>` 
                    : `<button type="button" class="equip-btn" data-id="${item.instanceId}" style="font-size: 0.8rem; flex: 1;">装備</button>`
                  }
                  ${!isEquipped ? `<button type="button" class="sell-btn footer-btn" data-id="${item.instanceId}" style="font-size: 0.8rem; flex: 1; border-color: #d97706; color: #fef08a;">売却 (${sellPrice}G)</button>` : ''}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    // イベント登録
    container.querySelector("#back-btn")?.addEventListener("click", () => {
      if (typeof handlers.onBack === "function") handlers.onBack();
    });

    // フィルター・ソートのイベント登録
    container.querySelector("#filter-type")?.addEventListener("change", (e) => {
      currentTypeFilter = e.target.value;
      render();
    });

    container.querySelector("#filter-rarity")?.addEventListener("change", (e) => {
      currentRarityFilter = e.target.value;
      render();
    });

    container.querySelector("#sort-by")?.addEventListener("change", (e) => {
      currentSortBy = e.target.value;
      render();
    });

    // Common一括売却ボタン
    container.querySelector("#bulk-sell-common")?.addEventListener("click", () => {
      const res = bulkSellItems(save, ["common"]);
      if (res.count > 0) {
        if (typeof handlers.onSave === "function") handlers.onSave(save);
        alert(`Common装備を ${res.count}個 売却し、${res.earnedGold} G を獲得しました！`);
        render();
      } else {
        alert("売却可能なCommon装備がありません。");
      }
    });

    container.querySelectorAll(".equip-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        equipItem(save, btn.dataset.id);
        if (typeof handlers.onSave === "function") handlers.onSave(save);
        render();
      });
    });

    container.querySelectorAll(".unequip-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.type) {
          unequipItem(save, btn.dataset.type);
          if (typeof handlers.onSave === "function") handlers.onSave(save);
          render();
        }
      });
    });

    // 単体売却ボタン
    container.querySelectorAll(".sell-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const res = sellItem(save, btn.dataset.id);
        if (res && res.success) {
          if (typeof handlers.onSave === "function") handlers.onSave(save);
          render();
        }
      });
    });

    container.querySelector("#unequip-weapon")?.addEventListener("click", () => {
      unequipItem(save, "weapon");
      if (typeof handlers.onSave === "function") handlers.onSave(save);
      render();
    });

    container.querySelector("#unequip-armor")?.addEventListener("click", () => {
      unequipItem(save, "armor");
      if (typeof handlers.onSave === "function") handlers.onSave(save);
      render();
    });
  }

  render();
}