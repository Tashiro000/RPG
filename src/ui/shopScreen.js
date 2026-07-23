// src/ui/shopScreen.js

// 消耗品・バフ系アイテムの豊富なラインナップ定義
export const SHOP_ITEMS = [
  // HP回復系
  { id: "potion_small", name: "小型ポーション", price: 30, category: "recovery", description: "HPを 50 回復する" },
  { id: "potion_medium", name: "中型ポーション", price: 100, category: "recovery", description: "HPを 150 回復する" },
  { id: "potion_large", name: "大型ポーション", price: 300, category: "recovery", description: "HPを 400 回復する" },

  // MP回復系 (追加)
  { id: "mana_potion_small", name: "小型マナポーション", price: 40, category: "recovery", description: "MPを 30 回復する" },
  { id: "mana_potion_large", name: "大型マナポーション", price: 150, category: "recovery", description: "MPを 100 回復する" },

  // 一時バフ系（次の戦闘・ダンジョン等で使用）
  { id: "atk_elixir", name: "怪力の薬", price: 150, category: "buff", description: "次の戦闘中、攻撃力が +20% 上昇する" },
  { id: "def_elixir", name: "鉄壁の薬", price: 150, category: "buff", description: "次の戦闘中、防御力が +20% 上昇する" },
  { id: "crit_elixir", name: "会心の薬", price: 200, category: "buff", description: "次の戦闘中、クリティカル率が +15% 上昇する" },

  // ドロップ・経験値系
  { id: "exp_scroll", name: "鍛錬の書", price: 250, category: "boost", description: "次の戦闘で獲得できる経験値が 1.5倍 になる" },
  { id: "gold_charm", name: "金運のお守り", price: 250, category: "boost", description: "次の戦闘で獲得できるゴールドが 1.5倍 になる" },
  { id: "drop_pendant", name: "幸運のペンダント", price: 400, category: "boost", description: "次の戦闘でのドロップ率が大幅に上昇する" },

  // 永久強化・特殊
  { id: "stat_atk_seed", name: "攻撃の種", price: 1000, category: "special", description: "使用するとプレイヤーのベース攻撃力が 恒久的に +1 上昇する" },
  { id: "stat_def_seed", name: "防御の種", price: 1000, category: "special", description: "使用するとプレイヤーのベース防御力が 恒久的に +1 上昇する" },
  { id: "stat_hp_seed", name: "生命の種", price: 1200, category: "special", description: "使用するとプレイヤーの最大HPが 恒久的に +10 上昇する" },
  { id: "stat_mp_seed", name: "魔力の種", price: 1200, category: "special", description: "使用するとプレイヤーの最大MPが 恒久的に +5 上昇する" }
];

let currentCategory = "all";

export function createShopScreen(container, save, handlers = {}) {
  if (!save.player) save.player = { gold: 0, level: 1, atk: 10, def: 5, maxHp: 100, hp: 100, maxMp: 30, mp: 30 };
  if (!save.consumables) save.consumables = {};

  function render() {
    let filteredItems = SHOP_ITEMS;
    if (currentCategory !== "all") {
      filteredItems = SHOP_ITEMS.filter(item => item.category === currentCategory);
    }

    const gold = save.player?.gold ?? save.currency?.g ?? 0;

    container.innerHTML = `
      <div class="main-screen">
        <header class="main-header">
          <div style="display:flex; justify-space-between; align-items:center; width:100%; flex-wrap: wrap; gap: 10px;">
            <h2 style="color: var(--gold-soft); margin: 0;">道具屋・ショップ</h2>
            <div style="color: var(--gold-soft); font-weight: bold; font-size: 1.1rem;">所持金: ${gold} G</div>
            <button type="button" class="footer-btn" id="back-btn">拠点へ戻る</button>
          </div>
        </header>

        <div style="display: flex; gap: 8px; margin: 1rem 0; flex-wrap: wrap;">
          <button type="button" class="footer-btn category-btn" data-cat="all" style="${currentCategory === 'all' ? 'border-color: var(--gold-soft); color: #fff;' : 'opacity: 0.7;'}">すべて</button>
          <button type="button" class="footer-btn category-btn" data-cat="recovery" style="${currentCategory === 'recovery' ? 'border-color: var(--gold-soft); color: #fff;' : 'opacity: 0.7;'}">回復系</button>
          <button type="button" class="footer-btn category-btn" data-cat="buff" style="${currentCategory === 'buff' ? 'border-color: var(--gold-soft); color: #fff;' : 'opacity: 0.7;'}">戦闘バフ</button>
          <button type="button" class="footer-btn category-btn" data-cat="boost" style="${currentCategory === 'boost' ? 'border-color: var(--gold-soft); color: #fff;' : 'opacity: 0.7;'}">報酬ブースト</button>
          <button type="button" class="footer-btn category-btn" data-cat="special" style="${currentCategory === 'special' ? 'border-color: var(--gold-soft); color: #fff;' : 'opacity: 0.7;'}">永久強化</button>
        </div>

        <div class="location-grid" id="shop-grid">
          ${filteredItems.length === 0 ? `<p style="color: var(--mist); grid-column: 1/-1;">該当するアイテムがありません。</p>` : ""}
          ${filteredItems.map((item) => {
            const owned = save.consumables[item.id] || 0;
            const canAfford = gold >= item.price;

            return `
              <div class="location-card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.25rem;">
                    <strong style="color: var(--gold-soft); font-size: 1rem;">${item.name}</strong>
                    <span style="font-size: 0.8rem; color: #a1a1aa; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">所持: ${owned}</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--mist); margin: 0.5rem 0; min-height: 2.5rem; line-height: 1.3;">
                    ${item.description}
                  </p>
                </div>

                <div style="margin-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                    <span style="color: #fef08a; font-weight: bold;">${item.price} G</span>
                  </div>
                  <div style="display:flex; gap: 0.5rem;">
                    <button type="button" class="footer-btn buy-btn" data-id="${item.id}" data-amount="1" style="flex:1; font-size: 0.8rem; ${!canAfford ? 'opacity: 0.4; cursor: not-allowed;' : ''}" ${!canAfford ? 'disabled' : ''}>
                      1個購入
                    </button>
                    <button type="button" class="footer-btn buy-btn" data-id="${item.id}" data-amount="5" style="flex:1; font-size: 0.8rem; ${!canAfford ? 'opacity: 0.4; cursor: not-allowed;' : ''}" ${!canAfford ? 'disabled' : ''}>
                      5個購入
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    container.querySelector("#back-btn")?.addEventListener("click", () => {
      if (typeof handlers.onBack === "function") handlers.onBack();
    });

    container.querySelectorAll(".category-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentCategory = btn.dataset.cat;
        render();
      });
    });

    container.querySelectorAll(".buy-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const itemId = btn.dataset.id;
        const amount = parseInt(btn.dataset.amount, 10) || 1;
        const item = SHOP_ITEMS.find(i => i.id === itemId);

        if (!item) return;

        const totalPrice = item.price * amount;
        const currentGold = save.player?.gold ?? save.currency?.g ?? 0;

        if (currentGold >= totalPrice) {
          if (save.player) save.player.gold = currentGold - totalPrice;
          if (save.currency) save.currency.g = currentGold - totalPrice;

          save.consumables[itemId] = (save.consumables[itemId] || 0) + amount;

          if (typeof handlers.onSave === "function") handlers.onSave(save);
          render();
        } else {
          alert("ゴールドが足りません！");
        }
      });
    });
  }

  render();
}