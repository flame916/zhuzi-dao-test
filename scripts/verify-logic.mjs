/**
 * 诸子百家心理镜像测试 — 核心题库对称性与计分引擎自动化校验脚本
 * 运行方式：node scripts/verify-logic.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 在隔离沙箱上下文中顺序加载普通浏览器脚本
const sandbox = {
  console,
  Math,
  Number,
  Array,
  Object,
  Error
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const filesToLoad = [
  'js/data-schools.js',
  'js/data-questions.js',
  'js/scoring.js'
];

for (const relPath of filesToLoad) {
  const fullPath = path.join(ROOT_DIR, relPath);
  const code = fs.readFileSync(fullPath, 'utf-8');
  vm.runInContext(code, sandbox, { filename: relPath });
}

const { SCHOOL_ORDER, SCHOOLS, COMBO_INSIGHTS, EXTRA_SCHOOLS, QUESTIONS, Scoring } = sandbox.DaoTest;

console.log('1. 校验六大流派、四家补充流派与 36 种组合判词完整性...');
assert.equal(SCHOOL_ORDER.length, 6, '核心流派数应为 6');
for (const id of SCHOOL_ORDER) {
  const s = SCHOOLS[id];
  assert.ok(s, `缺少流派数据: ${id}`);
  assert.ok(s.name && s.daoTitle && s.sealText && s.image, `${id} 基础字段缺失`);
  assert.ok(s.quote && s.quoteAuthor && s.quoteModern, `${id} 名言字段缺失`);
  assert.ok(s.ancientStoryTitle && s.ancientStory, `${id} 古人故事字段缺失`);
  assert.ok(s.matchTrait && s.strength && s.shadow && s.actionNow, `${id} 导向字段缺失`);
}
assert.equal(EXTRA_SCHOOLS.length, 4, '补充流派数应为 4');

for (const a of SCHOOL_ORDER) {
  for (const b of SCHOOL_ORDER) {
    const key = `${a}_${b}`;
    const insight = COMBO_INSIGHTS[key];
    assert.ok(insight, `缺少组合判词: ${key}`);
    assert.ok(insight.archetype && insight.verdict && insight.balanceAdvice, `组合 ${key} 字段不完整`);
  }
}

console.log('2. 校验 12 道测试题结构与严格对称权重矩阵...');
assert.equal(QUESTIONS.length, 12, '题目数量必须为 12');

const primaryCounts = Object.fromEntries(SCHOOL_ORDER.map((id) => [id, 0]));
const secondaryCounts = Object.fromEntries(SCHOOL_ORDER.map((id) => [id, 0]));

for (const q of QUESTIONS) {
  assert.ok(q.chapter && q.scenario, `第 ${q.id} 题题干不完整`);
  assert.equal(q.options.length, 4, `第 ${q.id} 题选项数必须为 4`);

  const primariesInQuestion = new Set();
  for (const opt of q.options) {
    assert.ok(opt.label && opt.text && opt.text.trim().length >= 12, `第 ${q.id} 题选项文案过短`);
    assert.ok(SCHOOLS[opt.primary], `第 ${q.id} 题存在未知主权重: ${opt.primary}`);
    assert.ok(SCHOOLS[opt.secondary], `第 ${q.id} 题存在未知次权重: ${opt.secondary}`);
    assert.notEqual(opt.primary, opt.secondary, `第 ${q.id} 题同选项主次流派不能相同`);
    assert.ok(!primariesInQuestion.has(opt.primary), `第 ${q.id} 题内部出现重复主权重 ${opt.primary}`);
    primariesInQuestion.add(opt.primary);

    primaryCounts[opt.primary] += 1;
    secondaryCounts[opt.secondary] += 1;
  }
}

for (const id of SCHOOL_ORDER) {
  assert.equal(primaryCounts[id], 8, `流派 ${id} 的主权重出现次数应为 8，实际为 ${primaryCounts[id]}`);
  assert.equal(secondaryCounts[id], 8, `流派 ${id} 的次权重出现次数应为 8，实际为 ${secondaryCounts[id]}`);
}
console.log('   权重分布验算通过：每家 primary=8 次，secondary=8 次。');

console.log('3. 校验极端单流派定向作答（预期主道稳居第一且 >= 45%）...');
for (const targetId of SCHOOL_ORDER) {
  const answers = QUESTIONS.map((q) => {
    const pIdx = q.options.findIndex((o) => o.primary === targetId);
    if (pIdx !== -1) return pIdx;
    const sIdx = q.options.findIndex((o) => o.secondary === targetId);
    if (sIdx !== -1) return sIdx;
    return 0;
  });

  const res = Scoring.calculateResult(answers, QUESTIONS, SCHOOL_ORDER);
  const sum = res.ranked.reduce((acc, item) => acc + item.percent, 0);
  assert.equal(sum, 100, `${targetId} 极端作答百分比总和必须为 100`);
  assert.equal(res.top1.id, targetId, `${targetId} 极端作答未排第一，实际第一为 ${res.top1.id}`);
  assert.ok(res.top1.percent >= 45, `${targetId} 极端作答占比应 >= 45%，实际为 ${res.top1.percent}%`);
  assert.ok(COMBO_INSIGHTS[res.comboKey], `未命中组合键 ${res.comboKey}`);
  console.log(
    `   [${SCHOOLS[targetId].name}] 极端作答 -> 第一: ${SCHOOLS[res.top1.id].name} (${res.top1.percent}%), 第二: ${SCHOOLS[res.top2.id].name} (${res.top2.percent}%), 纯粹态=${res.isPure}`
  );
}

console.log('4. 运行 5000 次随机答题压力测试...');
for (let i = 0; i < 5000; i++) {
  const randAnswers = QUESTIONS.map(() => Math.floor(Math.random() * 4));
  const res = Scoring.calculateResult(randAnswers, QUESTIONS, SCHOOL_ORDER);
  assert.equal(res.totalScore, 48, '12 题总权重应恒为 48');
  let sum = 0;
  for (const item of res.ranked) {
    assert.ok(Number.isInteger(item.percent), '百分比必须为整数');
    assert.ok(item.percent >= 0 && item.percent <= 100, '百分比范围必须在 0..100');
    sum += item.percent;
  }
  assert.equal(sum, 100, `第 ${i} 次随机作答总和不为 100，实际为 ${sum}`);
  assert.ok(COMBO_INSIGHTS[res.comboKey], `第 ${i} 次随机作答未命中组合键 ${res.comboKey}`);
}

console.log('全部校验均已通过！');
