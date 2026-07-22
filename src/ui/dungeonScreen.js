// dungeonScreen.js
import {
  getDungeon,
  getProgress,
  isDifficultyUnlocked,
  isFloorUnlocked,
} from "../dungeon/dungeonManager.js";

export function createDungeonScreen(container, save, dungeonId, handlers = {}) {
  const dungeon = getDungeon(dungeonId);
  const progress = getProgress(save, dungeonId);

  const unlockedDiffs = dungeon.difficulties.filter((d) =>
    isDifficultyUnlocked(save, dungeonId, d)
  );
  let currentDifficulty = unlockedDiffs[unlockedDiffs.length - 1];

  function render() {
    const floors = Array.from({ length: dungeon.floorsPerDifficulty }, (_, i) => i + 1);

    container.innerHTML = `
      <div class="dungeon-screen">
        <header class="dungeon-header">
          <h2 class="dungeon-title">${dungeon.name}</h2>
          <button type="button" class="footer-btn" data-action="back">戻る</button>
        </header>

        <div class="difficulty-tabs" role="tablist">
          ${dungeon.difficulties
            .map((d) => {
              const unlocked = isDifficultyUnlocked(save, dungeonId, d);
              const active = d === currentDifficulty;
              return `<button type="button" class="difficulty-tab ${active ? "active" : ""}" data-difficulty="${d}" ${unlocked ? "" : "disabled"} role="tab">${d.toUpperCase()}</button>`;
            })
            .join("")}
        </div>

        <div class="floor-grid">
          ${floors
            .map((f) => {
              const unlocked = isFloorUnlocked(save, dungeonId, currentDifficulty, f);
              const cleared = progress.clearedFloors[currentDifficulty] >= f;
              return `<button type="button" class="floor-card ${cleared ? "cleared" : ""}" data-floor="${f}" ${unlocked ? "" : "disabled"}>${currentDifficulty.slice(0, 1).toUpperCase()}-${f}</button>`;
            })
            .join("")}
        </div>
      </div>
    `;

    container.querySelector('[data-action="back"]').addEventListener("click", () => {
      if (typeof handlers.onBack === "function") handlers.onBack();
    });

    container.querySelectorAll(".difficulty-tab:not(:disabled)").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentDifficulty = btn.dataset.difficulty;
        render();
      });
    });

    container.querySelectorAll(".floor-card:not(:disabled)").forEach((btn) => {
      btn.addEventListener("click", () => {
        const floorNumber = Number(btn.dataset.floor);
        if (typeof handlers.onEnterFloor === "function") {
          handlers.onEnterFloor({ dungeonId, difficulty: currentDifficulty, floorNumber });
        }
      });
    });
  }

  render();
}