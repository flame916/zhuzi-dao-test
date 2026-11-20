/**
 * 诸子百家心理镜像测试 — 计分与百分比归一化引擎
 * 说明：采用主项 +3、次项 +1 计分，并使用最大余额法确保六大流派百分比之和严格等于 100。
 */
(function (root) {
  'use strict';

  var DaoTest = (root.DaoTest = root.DaoTest || {});

  var PRIMARY_WEIGHT = 3;
  var SECONDARY_WEIGHT = 1;
  var DEFAULT_ORDER = ['ru', 'dao', 'fa', 'mo', 'bing', 'zong'];

  /**
   * 比较器：先按主排序数值，再依次按原始分、主命中次数、末次命中题序、默认流派序确定顺序。
   * @param {Object} a
   * @param {Object} b
   * @param {string} primaryField - 'percent' 或 'rawScore'
   * @returns {number}
   */
  function compareScores(a, b, primaryField) {
    if (b[primaryField] !== a[primaryField]) {
      return b[primaryField] - a[primaryField];
    }
    if (b.rawScore !== a.rawScore) {
      return b.rawScore - a.rawScore;
    }
    if (b.primaryCount !== a.primaryCount) {
      return b.primaryCount - a.primaryCount;
    }
    if (b.lastHitIndex !== a.lastHitIndex) {
      return b.lastHitIndex - a.lastHitIndex;
    }
    return DEFAULT_ORDER.indexOf(a.id) - DEFAULT_ORDER.indexOf(b.id);
  }

  /**
   * 计算 12 道测试题的六家契合百分比及主辅道结论
   * @param {Array<number>} answers - 长度等于 questions.length 的选项下标数组（0~3）
   * @param {Array<Object>} questions - 题库数组
   * @param {Array<string>} [schoolOrder] - 流派顺序数组
   * @returns {Object} 结果对象 { ranked, byId, top1, top2, isPure, comboKey, totalScore }
   */
  function calculateResult(answers, questions, schoolOrder) {
    var order = Array.isArray(schoolOrder) && schoolOrder.length ? schoolOrder : DEFAULT_ORDER;

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('题库数据为空，无法进行推演。');
    }
    if (!Array.isArray(answers) || answers.length !== questions.length) {
      throw new Error('作答数量与题库总数不匹配。');
    }

    // 初始化各流派统计容器
    var statsMap = {};
    order.forEach(function (id) {
      statsMap[id] = {
        id: id,
        rawScore: 0,
        primaryCount: 0,
        secondaryCount: 0,
        lastHitIndex: -1,
        exactPercent: 0,
        percent: 0,
        remainder: 0
      };
    });

    var totalScore = 0;

    // 累加每题所选主次权重
    for (var qIndex = 0; qIndex < questions.length; qIndex++) {
      var q = questions[qIndex];
      var optIndex = answers[qIndex];
      if (
        typeof optIndex !== 'number' ||
        !Number.isInteger(optIndex) ||
        optIndex < 0 ||
        optIndex >= q.options.length
      ) {
        throw new Error('第 ' + (qIndex + 1) + ' 题存在无效选项：' + optIndex);
      }

      var opt = q.options[optIndex];
      var pStat = statsMap[opt.primary];
      var sStat = statsMap[opt.secondary];

      if (!pStat || !sStat) {
        throw new Error('第 ' + (qIndex + 1) + ' 题选项关联了未知流派。');
      }

      pStat.rawScore += PRIMARY_WEIGHT;
      pStat.primaryCount += 1;
      pStat.lastHitIndex = qIndex;

      sStat.rawScore += SECONDARY_WEIGHT;
      sStat.secondaryCount += 1;
      sStat.lastHitIndex = qIndex;

      totalScore += PRIMARY_WEIGHT + SECONDARY_WEIGHT;
    }

    var list = order.map(function (id) {
      return statsMap[id];
    });

    // 最大余额法（Largest Remainder Method）进行整数百分比归一化
    var floorSum = 0;
    list.forEach(function (item) {
      item.exactPercent = totalScore > 0 ? (item.rawScore / totalScore) * 100 : 0;
      item.percent = Math.floor(item.exactPercent);
      item.remainder = item.exactPercent - item.percent;
      floorSum += item.percent;
    });

    var diff = 100 - floorSum;
    if (diff > 0) {
      var byRemainder = list.slice().sort(function (a, b) {
        if (Math.abs(b.remainder - a.remainder) > 1e-12) {
          return b.remainder - a.remainder;
        }
        return compareScores(a, b, 'rawScore');
      });
      for (var i = 0; i < diff; i++) {
        byRemainder[i % byRemainder.length].percent += 1;
      }
    }

    // 按最终百分比与决胜规则降序排列
    var ranked = list.slice().sort(function (a, b) {
      return compareScores(a, b, 'percent');
    });

    var top1 = ranked[0];
    var top2 = ranked[1];

    // 当首位流派占比 >= 42% 且领先第二位 >= 15% 时，归为“纯粹之道”，否则为“双道合参”
    var isPure = top1.percent >= 42 && top1.percent - top2.percent >= 15;
    var comboKey = isPure ? top1.id + '_' + top1.id : top1.id + '_' + top2.id;

    return {
      ranked: ranked,
      byId: statsMap,
      top1: top1,
      top2: top2,
      isPure: isPure,
      comboKey: comboKey,
      totalScore: totalScore
    };
  }

  DaoTest.Scoring = {
    PRIMARY_WEIGHT: PRIMARY_WEIGHT,
    SECONDARY_WEIGHT: SECONDARY_WEIGHT,
    DEFAULT_ORDER: DEFAULT_ORDER,
    calculateResult: calculateResult
  };
})(typeof window !== 'undefined' ? window : globalThis);
