// dungeonListScreen.js
import { getDungeons } from "../dungeon/dungeonManager.js";

export function createDungeonListScreen(container, handlers = {}) {
  const dungeons = getDungeons();

  container.innerHTML = `
    <div class="dungeon-list-screen">
      <header class="dungeon-header">
        <h2 class="dungeon-title">ダンジョン選択</h2>
        <button type="button" class="footer-btn" data-action="back">戻る</button>
      </header>
      <div class="dungeon-list">
        ${dungeons
          .map(
            (d) =>
              `<button type="button" class="location-card" data-id="${d.id}">${d.name}</button>`
          )
          .join("")}
      </div>
    </div>
  `;

  container.querySelector('[data-action="back"]').addEventListener("click", () => {
    if (typeof handlers.onBack === "function") handlers.onBack();
  });

  container.querySelectorAll(".dungeon-list [data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof handlers.onSelectDungeon === "function") {
        handlers.onSelectDungeon(btn.dataset.id);
      }
    });
  });
}