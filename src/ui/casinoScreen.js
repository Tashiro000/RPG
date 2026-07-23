// src/ui/casinoScreen.js

export function createCasinoScreen(container, save, { onBack, onSave }) {
  if (!save.player) save.player = { gold: 0 };

  let currentCard = Math.floor(Math.random() * 13) + 1;

  container.innerHTML = `
    <div class="casino-screen">
      <header class="dungeon-header">
        <h2 class="dungeon-title">カジノ</h2>
        <div class="currency">
          <span class="currency-item gold">所持金: <strong id="casino-gold">${save.player.gold}</strong> G</span>
        </div>
      </header>

      <!-- ゲーム切替タブ -->
      <div class="difficulty-tabs" style="justify-content: center; margin-top: 1rem;">
        <button id="tab-highlow" class="difficulty-tab active">HIGH & LOW</button>
        <button id="tab-roulette" class="difficulty-tab">ルーレット</button>
        <button id="tab-slot" class="difficulty-tab">スロット</button>
      </div>

      <!-- HIGH & LOW コンテンツ -->
      <main id="game-highlow" class="casino-body" style="text-align: center; margin-top: 1.5rem;">
        <p style="color: var(--mist);">次のカードが現在の数字より「高い(HIGH)」か「低い(LOW)」かを予想してください。</p>
        
        <div class="card-display" style="font-size: 3.5rem; margin: 1.5rem 0; color: var(--gold-soft); font-family: var(--font-display);">
          <span id="current-card-val">${currentCard}</span>
        </div>

        <div class="casino-controls" style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <label style="color: var(--mist); font-size: 0.9rem;">賭け金:</label>
          <input type="number" id="hl-bet" value="100" min="10" max="${save.player.gold}" style="padding: 0.5rem; width: 100px; background: var(--bg-stone); color: var(--parchment); border: 1px solid var(--gold);" />
          <button id="btn-high" class="equip-btn">HIGH (高い)</button>
          <button id="btn-low" class="equip-btn">LOW (低い)</button>
        </div>

        <p id="hl-result" style="height: 1.5rem; color: var(--parchment); font-weight: bold;"></p>
      </main>

      <!-- ルーレット コンテンツ -->
      <main id="game-roulette" class="casino-body" style="text-align: center; margin-top: 1.5rem; display: none;">
        <p style="color: var(--mist);">賭ける対象を選んで「スピン」を押してください。（赤/黒: 2倍、数字直撃: 36倍）</p>

        <div style="margin: 1.5rem 0;">
          <div id="roulette-wheel" style="font-size: 3.5rem; color: var(--gold-soft); font-family: var(--font-display);">
            [ <span id="roulette-num">?</span> ]
          </div>
        </div>

        <div class="roulette-controls" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <label style="color: var(--mist); font-size: 0.9rem;">賭け金:</label>
            <input type="number" id="r-bet" value="100" min="10" max="${save.player.gold}" style="padding: 0.5rem; width: 100px; background: var(--bg-stone); color: var(--parchment); border: 1px solid var(--gold);" />
          </div>

          <div style="display: flex; gap: 0.8rem; flex-wrap: wrap; justify-content: center;">
            <button class="equip-btn r-type-btn active" data-type="red">赤 (2倍)</button>
            <button class="equip-btn r-type-btn" data-type="black">黒 (2倍)</button>
            <button class="equip-btn r-type-btn" data-type="number">数字直撃 (36倍)</button>
          </div>

          <div id="number-select-wrapper" style="display: none; align-items: center; gap: 0.5rem;">
            <label style="color: var(--mist); font-size: 0.9rem;">対象の数字 (0-36):</label>
            <input type="number" id="r-target-num" value="7" min="0" max="36" style="padding: 0.4rem; width: 70px; background: var(--bg-stone); color: var(--parchment); border: 1px solid var(--gold);" />
          </div>

          <button id="btn-spin" class="equip-btn" style="padding: 0.6rem 2rem; font-size: 1.1rem; background: var(--gold); color: var(--bg-void);">スピン！</button>
        </div>

        <p id="r-result" style="height: 1.5rem; color: var(--parchment); font-weight: bold;"></p>
      </main>

      <!-- スロット コンテンツ -->
      <main id="game-slot" class="casino-body" style="text-align: center; margin-top: 1.5rem; display: none;">
        <p style="color: var(--mist);">絵柄を3つ揃えて大当りを狙え！（7: 100倍 / BAR: 30倍 / 🍒: 10倍 / 💎: 5倍 / 🔄: リトライ）</p>

        <div style="display: flex; justify-content: center; gap: 1rem; margin: 1.5rem 0;">
          <div class="slot-reel" style="width: 70px; height: 80px; background: var(--bg-stone); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--gold-soft); border-radius: 6px;"><span id="reel-0">7</span></div>
          <div class="slot-reel" style="width: 70px; height: 80px; background: var(--bg-stone); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--gold-soft); border-radius: 6px;"><span id="reel-1">7</span></div>
          <div class="slot-reel" style="width: 70px; height: 80px; background: var(--bg-stone); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--gold-soft); border-radius: 6px;"><span id="reel-2">7</span></div>
        </div>

        <div class="slot-controls" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <label style="color: var(--mist); font-size: 0.9rem;">賭け金:</label>
            <input type="number" id="s-bet" value="100" min="10" max="${save.player.gold}" style="padding: 0.5rem; width: 100px; background: var(--bg-stone); color: var(--parchment); border: 1px solid var(--gold);" />
          </div>

          <button id="btn-slot-start" class="equip-btn" style="padding: 0.6rem 2.5rem; font-size: 1.1rem; background: var(--gold); color: var(--bg-void);">スロット回す！</button>
        </div>

        <p id="s-result" style="height: 1.5rem; color: var(--parchment); font-weight: bold;"></p>
      </main>

      <footer class="main-footer">
        <button id="btn-back" class="footer-btn">戻る</button>
      </footer>
    </div>
  `;

  // --- 要素取得 ---
  const goldEl = container.querySelector("#casino-gold");
  const tabHl = container.querySelector("#tab-highlow");
  const tabR = container.querySelector("#tab-roulette");
  const tabS = container.querySelector("#tab-slot");
  const gameHl = container.querySelector("#game-highlow");
  const gameR = container.querySelector("#game-roulette");
  const gameS = container.querySelector("#game-slot");

  const switchTab = (activeTab, activeGame) => {
    [tabHl, tabR, tabS].forEach((t) => t.classList.remove("active"));
    [gameHl, gameR, gameS].forEach((g) => (g.style.display = "none"));
    activeTab.classList.add("active");
    activeGame.style.display = "block";
  };

  tabHl.addEventListener("click", () => switchTab(tabHl, gameHl));
  tabR.addEventListener("click", () => switchTab(tabR, gameR));
  tabS.addEventListener("click", () => switchTab(tabS, gameS));

  // --- HIGH & LOW Logic ---
  const cardValEl = container.querySelector("#current-card-val");
  const hlResultEl = container.querySelector("#hl-result");
  const hlBetInput = container.querySelector("#hl-bet");

  const playHighLow = (isHigh) => {
    const bet = parseInt(hlBetInput.value, 10);
    if (isNaN(bet) || bet <= 0 || bet > save.player.gold) {
      hlResultEl.textContent = "賭け金が不正です。";
      return;
    }

    const nextCard = Math.floor(Math.random() * 13) + 1;
    const win = isHigh ? nextCard >= currentCard : nextCard <= currentCard;

    if (win) {
      save.player.gold += bet;
      hlResultEl.textContent = `正解！ (${currentCard} -> ${nextCard}) +${bet} G`;
      hlResultEl.style.color = "var(--gold-soft)";
    } else {
      save.player.gold -= bet;
      hlResultEl.textContent = `不正解... (${currentCard} -> ${nextCard}) -${bet} G`;
      hlResultEl.style.color = "var(--ember)";
    }

    currentCard = nextCard;
    cardValEl.textContent = currentCard;
    goldEl.textContent = save.player.gold;
    if (onSave) onSave(save);
  };

  container.querySelector("#btn-high").addEventListener("click", () => playHighLow(true));
  container.querySelector("#btn-low").addEventListener("click", () => playHighLow(false));

  // --- ルーレット Logic ---
  let selectedBetType = "red";
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  
  const rBetInput = container.querySelector("#r-bet");
  const rResultEl = container.querySelector("#r-result");
  const rNumEl = container.querySelector("#roulette-num");
  const numSelectWrapper = container.querySelector("#number-select-wrapper");
  const targetNumInput = container.querySelector("#r-target-num");
  const spinBtn = container.querySelector("#btn-spin");

  container.querySelectorAll(".r-type-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      container.querySelectorAll(".r-type-btn").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      selectedBetType = e.target.dataset.type;
      numSelectWrapper.style.display = selectedBetType === "number" ? "flex" : "none";
    });
  });

  spinBtn.addEventListener("click", () => {
    const bet = parseInt(rBetInput.value, 10);
    if (isNaN(bet) || bet <= 0 || bet > save.player.gold) {
      rResultEl.textContent = "賭け金が不正です。";
      return;
    }

    spinBtn.disabled = true;
    rResultEl.textContent = "スピン中...";

    let counter = 0;
    const interval = setInterval(() => {
      rNumEl.textContent = Math.floor(Math.random() * 37);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        
        const hitNum = Math.floor(Math.random() * 37);
        rNumEl.textContent = hitNum;

        let win = false;
        let payoutMultiplier = 0;

        if (selectedBetType === "red" && redNumbers.includes(hitNum)) {
          win = true;
          payoutMultiplier = 2;
        } else if (selectedBetType === "black" && hitNum !== 0 && !redNumbers.includes(hitNum)) {
          win = true;
          payoutMultiplier = 2;
        } else if (selectedBetType === "number") {
          const target = parseInt(targetNumInput.value, 10);
          if (hitNum === target) {
            win = true;
            payoutMultiplier = 36;
          }
        }

        if (win) {
          const reward = bet * (payoutMultiplier - 1);
          save.player.gold += reward;
          rResultEl.textContent = `大当たり！ [${hitNum}] +${reward} G`;
          rResultEl.style.color = "var(--gold-soft)";
        } else {
          save.player.gold -= bet;
          rResultEl.textContent = `はずれ... [${hitNum}] -${bet} G`;
          rResultEl.style.color = "var(--ember)";
        }

        goldEl.textContent = save.player.gold;
        spinBtn.disabled = false;
        if (onSave) onSave(save);
      }
    }, 80);
  });

  // --- スロット Logic (重み付き抽選) ---
  // 小さい役ほど出現頻度(weight)が高い
  const weightedSymbols = [
    { name: "7", weight: 1 },    // 7 (超激レア)
    { name: "BAR", weight: 2 },  // BAR
    { name: "🍒", weight: 3 },   // チェリー
    { name: "💎", weight: 4 },   // ダイヤ
    { name: "🔄", weight: 5 },   // リトライ (高頻度)
    { name: "💀", weight: 6 }    // ドクロ (ハズレ用)
  ];

  const totalWeight = weightedSymbols.reduce((sum, s) => sum + s.weight, 0);

  // 重みに基づいてランダムに1つの絵柄を選択する関数
  const getRandomSymbol = () => {
    let rand = Math.random() * totalWeight;
    for (const sym of weightedSymbols) {
      if (rand < sym.weight) return sym.name;
      rand -= sym.weight;
    }
    return "💀";
  };

  const sBetInput = container.querySelector("#s-bet");
  const sResultEl = container.querySelector("#s-result");
  const slotBtn = container.querySelector("#btn-slot-start");
  const reelEls = [
    container.querySelector("#reel-0"),
    container.querySelector("#reel-1"),
    container.querySelector("#reel-2"),
  ];

  slotBtn.addEventListener("click", () => {
    const bet = parseInt(sBetInput.value, 10);
    if (isNaN(bet) || bet <= 0 || bet > save.player.gold) {
      sResultEl.textContent = "賭け金が不正です。";
      return;
    }

    slotBtn.disabled = true;
    sResultEl.textContent = "スロット回転中...";

    const results = ["", "", ""];
    let step = 0;

    const interval = setInterval(() => {
      for (let i = step; i < 3; i++) {
        reelEls[i].textContent = getRandomSymbol();
      }
    }, 60);

    const stopReel = (index) => {
      setTimeout(() => {
        results[index] = getRandomSymbol();
        reelEls[index].textContent = results[index];
        step++;

        if (index === 2) {
          clearInterval(interval);
          
          const [r1, r2, r3] = results;

          if (r1 === r2 && r2 === r3) {
            if (r1 === "7") {
              const winGold = bet * 100;
              save.player.gold += winGold;
              sResultEl.textContent = `【7】揃い！ JACKPOT!! +${winGold} G!`;
              sResultEl.style.color = "var(--gold-soft)";
            } else if (r1 === "BAR") {
              const winGold = bet * 30;
              save.player.gold += winGold;
              sResultEl.textContent = `【BAR】揃い！ 大当り +${winGold} G!`;
              sResultEl.style.color = "var(--gold-soft)";
            } else if (r1 === "🍒") {
              const winGold = bet * 10;
              save.player.gold += winGold;
              sResultEl.textContent = `【🍒】揃い！ 当たり +${winGold} G!`;
              sResultEl.style.color = "var(--gold-soft)";
            } else if (r1 === "💎") {
              const winGold = bet * 5;
              save.player.gold += winGold;
              sResultEl.textContent = `【💎】揃い！ 小当たり +${winGold} G!`;
              sResultEl.style.color = "var(--gold-soft)";
            } else if (r1 === "🔄") {
              sResultEl.textContent = "【🔄】リトライ！ 賭け金消費なし（もう1回！）";
              sResultEl.style.color = "var(--gold-soft)";
            } else {
              save.player.gold -= bet;
              sResultEl.textContent = `残念、はずれ... -${bet} G`;
              sResultEl.style.color = "var(--ember)";
            }
          } else {
            save.player.gold -= bet;
            sResultEl.textContent = `残念、はずれ... -${bet} G`;
            sResultEl.style.color = "var(--ember)";
          }

          goldEl.textContent = save.player.gold;
          slotBtn.disabled = false;
          if (onSave) onSave(save);
        } else {
          stopReel(index + 1);
        }
      }, 600);
    };

    stopReel(0);
  });

  container.querySelector("#btn-back").addEventListener("click", onBack);
}