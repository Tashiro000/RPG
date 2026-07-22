import monsterData from "../../data/monsters.json";

export class BattleManager {
  constructor(dungeonId, difficulty, floorNumber, playerParty) {
    this.dungeonId = dungeonId;
    this.difficulty = difficulty;
    this.floorNumber = floorNumber;
    this.playerParty = playerParty;
    
    // 該当階層のモンスターをセットアップ（現状はダミーデータ呼び出し）
    const monsterKey = floorNumber === 10 ? "boss_1_10" : "mob_1_1";
    this.enemy = { ...monsterData[monsterKey] };
    this.isOver = false;
  }

  /**
   * 敵の現在の状態を取得
   */
  getEnemyState() {
    return this.enemy;
  }

  /**
   * プレイヤーの攻撃処理（簡易例）
   */
  playerAttack(targetMonster) {
    if (this.isOver) return null;

    const damage = Math.max(1, 10 - targetMonster.def);
    targetMonster.hp = Math.max(0, targetMonster.hp - damage);

    if (targetMonster.hp === 0) {
      this.isOver = true;
      return { action: "attack", damage, status: "victory" };
    }

    return { action: "attack", damage, status: "ongoing" };
  }
}