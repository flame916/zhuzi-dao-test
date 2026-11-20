/**
 * 诸子百家心理镜像测试 — 计分、融合与可信度引擎
 * 说明：
 * 1. 上卷情境题：主项 +3、次项 +1。
 * 2. 下卷自评量表（可选）：每家 2 则，四级计分，归一化后与情境题按 6:4 融合。
 * 3. 使用最大余额法确保六家百分比之和严格等于 100。
 * 4. 可信度：计算“情境判断”与“自评量表”两种测量的斯皮尔曼等级相关系数，并结合作答区分度给出等级。
 */
(function (root) {
  'use strict';

  var DaoTest = (root.DaoTest = root.DaoTest || {});

  var PRIMARY_WEIGHT = 3;
  var SECONDARY_WEIGHT = 1;
  var SJT_RATIO = 0.6; // 情境判断权重
  var SCALE_RATIO = 0.4; // 自评量表权重
  var DEFAULT_ORDER = ['ru', 'dao', 'fa', 'mo', 'bing', 'zong'];

  /**
   * 比较器：先按主排序字段，再依次按综合精确值、原始分、主命中次数、末次命中题序、默认流派序确定顺序。
   */
  function compareScores(a, b, primaryField) {
    if (b[primaryField] !== a[primaryField]) {
      return b[primaryField] - a[primaryField];
    }
    if (Math.abs(b.exactPercent - a.exactPercent) > 1e-9) {
      return b.exactPercent - a.exactPercent;
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
   * 计算平均秩（处理并列）
   * @param {Array<number>} values
   * @returns {Array<number>}
   */
  function averageRanks(values) {
    var indexed = values.map(function (v, i) {
      return { v: v, i: i };
    });
    indexed.sort(function (a, b) {
      return a.v - b.v;
    });
    var ranks = new Array(values.length);
    var k = 0;
    while (k < indexed.length) {
      var j = k;
      while (j + 1 < indexed.length && indexed[j + 1].v === indexed[k].v) {
        j++;
      }
      var avg = (k + j) / 2 + 1;
      for (var t = k; t <= j; t++) {
        ranks[indexed[t].i] = avg;
      }
      k = j + 1;
    }
    return ranks;
  }

  /**
   * 斯皮尔曼等级相关系数（基于平均秩的皮尔逊相关）
   * 若任一序列完全无差异，返回 null（无法判断）。
   */
  function spearman(xs, ys) {
    var rx = averageRanks(xs);
    var ry = averageRanks(ys);
    var n = rx.length;
    var mx = 0;
    var my = 0;
    for (var i = 0; i < n; i++) {
      mx += rx[i];
      my += ry[i];
    }
    mx /= n;
    my /= n;
    var num = 0;
    var dx = 0;
    var dy = 0;
    for (var j = 0; j < n; j++) {
      num += (rx[j] - mx) * (ry[j] - my);
      dx += (rx[j] - mx) * (rx[j] - mx);
      dy += (ry[j] - my) * (ry[j] - my);
    }
    if (dx === 0 || dy === 0) return null;
    return num / Math.sqrt(dx * dy);
  }

  /**
   * 计算六家契合百分比及主辅道结论
   * @param {Array<number>} answers - 情境题选项下标数组（0~3）
   * @param {Array<Object>} questions - 情境题库
   * @param {Array<string>} [schoolOrder] - 流派顺序
   * @param {Object} [options] - { scaleAnswers: Array<number 1~4>, scaleItems: Array<Object> }
   * @returns {Object} { ranked, byId, top1, top2, isPure, comboKey, totalScore, mode, reliability }
   */
  function calculateResult(answers, questions, schoolOrder, options) {
    var order = Array.isArray(schoolOrder) && schoolOrder.length ? schoolOrder : DEFAULT_ORDER;
    var opts = options || {};

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('题库数据为空，无法进行推演。');
    }
    if (!Array.isArray(answers) || answers.length !== questions.length) {
      throw new Error('作答数量与题库总数不匹配。');
    }

    var statsMap = {};
    order.forEach(function (id) {
      statsMap[id] = {
        id: id,
        rawScore: 0,
        primaryCount: 0,
        secondaryCount: 0,
        lastHitIndex: -1,
        scaleScore: null,
        sjtShare: 0,
        scaleShare: null,
        exactPercent: 0,
        percent: 0,
        remainder: 0
      };
    });

    var totalScore = 0;

    // 1. 累加情境题权重
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

    list.forEach(function (item) {
      item.sjtShare = totalScore > 0 ? item.rawScore / totalScore : 0;
    });

    // 2. 处理自评量表（精测模式）
    var hasScale =
      Array.isArray(opts.scaleAnswers) &&
      Array.isArray(opts.scaleItems) &&
      opts.scaleItems.length > 0 &&
      opts.scaleAnswers.length === opts.scaleItems.length;

    var reliability = null;

    if (hasScale) {
      var scaleSum = {};
      var scaleCount = {};
      order.forEach(function (id) {
        scaleSum[id] = 0;
        scaleCount[id] = 0;
      });

      opts.scaleItems.forEach(function (item, i) {
        var v = opts.scaleAnswers[i];
        if (typeof v !== 'number' || v < 1 || v > 4 || !Number.isInteger(v)) {
          throw new Error('第 ' + (i + 1) + ' 则自评存在无效作答：' + v);
        }
        if (scaleSum[item.school] === undefined) {
          throw new Error('自评条目关联了未知流派：' + item.school);
        }
        scaleSum[item.school] += v;
        scaleCount[item.school] += 1;
      });

      // 每家归一化到 0~1（平均分 1~4 映射到 0~1），并加入小平滑项避免全零
      var smooth = 0.05;
      var normSum = 0;
      list.forEach(function (item) {
        var cnt = scaleCount[item.id] || 1;
        var avg = scaleSum[item.id] / cnt;
        item.scaleScore = (avg - 1) / 3;
        normSum += item.scaleScore + smooth;
      });
      list.forEach(function (item) {
        item.scaleShare = (item.scaleScore + smooth) / normSum;
        item.exactPercent = (SJT_RATIO * item.sjtShare + SCALE_RATIO * item.scaleShare) * 100;
      });

      // 可信度：两种测量的等级相关 + 自评作答区分度
      var rho = spearman(
        list.map(function (it) {
          return it.rawScore;
        }),
        list.map(function (it) {
          return it.scaleScore;
        })
      );

      var mean = 0;
      opts.scaleAnswers.forEach(function (v) {
        mean += v;
      });
      mean /= opts.scaleAnswers.length;
      var variance = 0;
      opts.scaleAnswers.forEach(function (v) {
        variance += (v - mean) * (v - mean);
      });
      var scaleStd = Math.sqrt(variance / opts.scaleAnswers.length);

      var level;
      var note;
      if (rho === null || scaleStd < 0.35) {
        level = '低';
        note = '两卷的分数排序缺少可分辨的差异，可回到具体选项对照阅读。';
      } else if (rho >= 0.6) {
        level = '高';
        note = '情境卷与自省卷给六家的排序较为接近。';
      } else if (rho >= 0.2) {
        level = '中';
        note = '两卷有一些相近的倾向，也有排位不同的流派。';
      } else {
        level = '低';
        note = '两卷的排序重合较少。可以选一个熟悉的场景，看看当时的条件怎样影响了你的选择。';
      }

      reliability = {
        consistency: rho,
        scaleStd: scaleStd,
        level: level,
        note: note
      };
    } else {
      list.forEach(function (item) {
        item.exactPercent = item.sjtShare * 100;
      });
    }

    // 3. 最大余额法整数归一化
    var floorSum = 0;
    list.forEach(function (item) {
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

    var ranked = list.slice().sort(function (a, b) {
      return compareScores(a, b, 'percent');
    });

    var top1 = ranked[0];
    var top2 = ranked[1];

    var isPure = top1.percent >= 42 && top1.percent - top2.percent >= 15;
    var comboKey = isPure ? top1.id + '_' + top1.id : top1.id + '_' + top2.id;

    // 主道区分度：首位与次位的差距
    var gap = top1.percent - top2.percent;
    var clarityLevel = gap >= 10 ? '清晰' : gap >= 4 ? '较清晰' : '双道交织';

    return {
      ranked: ranked,
      byId: statsMap,
      top1: top1,
      top2: top2,
      isPure: isPure,
      comboKey: comboKey,
      totalScore: totalScore,
      mode: hasScale ? 'full' : 'quick',
      clarity: { gap: gap, level: clarityLevel },
      reliability: reliability
    };
  }

  DaoTest.Scoring = {
    PRIMARY_WEIGHT: PRIMARY_WEIGHT,
    SECONDARY_WEIGHT: SECONDARY_WEIGHT,
    SJT_RATIO: SJT_RATIO,
    SCALE_RATIO: SCALE_RATIO,
    DEFAULT_ORDER: DEFAULT_ORDER,
    spearman: spearman,
    calculateResult: calculateResult
  };
})(typeof window !== 'undefined' ? window : globalThis);
