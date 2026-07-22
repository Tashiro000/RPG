// worldSeed.js
// ワールドシードの生成と、シードに基づく決定的な乱数生成器(PRNG)を提供する。

/**
 * 新しいワールドシードを生成する。
 * 表示用に読みやすい英数字8桁の文字列にする。
 */
export function generateSeed() {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  const raw = array[0].toString(36) + array[1].toString(36);
  return raw.toUpperCase().slice(0, 8).padEnd(8, "0");
}

/**
 * 文字列シードを32bit整数にハッシュ化する(cyrb53の簡易版)。
 */
function hashSeed(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  return (h1 ^ h2) >>> 0;
}

/**
 * シード(文字列 or 数値)から決定的な乱数生成関数を作る(mulberry32)。
 * 同じシードなら常に同じ乱数列を返す。
 *
 * 使い方:
 *   const rng = createRng(save.seed);
 *   const value = rng(); // 0以上1未満の浮動小数点数
 */
export function createRng(seed) {
  let a = typeof seed === "string" ? hashSeed(seed) : seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * rng()を使って min以上max未満の整数を返すヘルパー。
 * ダンジョン生成やドロップ抽選などで使う想定。
 */
export function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min)) + min;
}