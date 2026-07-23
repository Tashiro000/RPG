// src/battle/battleManager.js

import monsterData from "../../data/monsters.json";

export class BattleManager {
  constructor(dungeonId, difficulty, floorNumber, playerParty) {
    this.dungeonId = dungeonId;
    this.difficulty = difficulty;
    this.floorNumber = floorNumber;
    this.playerParty = playerParty;
    
    const monsterKey = floorNumber === 10 ? "boss_1_10" : "mob_1_1";
    this.enemy = { ...monsterData[monsterKey] };
    this.isOver = false;
  }

  getEnemyState() {
    return this.enemy;
  }

  //  playerAttack 関数の中に return を正しく配置する
  playerAttack(targetMonster) {
    if (this.isOver) return null;

    const damage = Math.max(1, 10 - targetMonster.def);
    targetMonster.hp = Math.max(0, targetMonster.hp - damage);

    // 勝利時の処理（ここが playerAttack の中にある必要があります）
    if (targetMonster.hp === 0) {
      this.isOver = true;
      return { 
        action: "attack", 
        damage, 
        status: "victory",
        rewards: {
          exp: targetMonster.exp || 10,
          gold: targetMonster.gold || 15
        }
      };
    }

    return { action: "attack", damage, status: "ongoing" };
  } //  playerAttack の閉じ括弧
}