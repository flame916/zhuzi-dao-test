/**
 * 诸子百家心理镜像测试 — 下卷 · 心性自省量表（12 则）
 * 说明：
 * 1. 采用“情境判断（上卷 18 问）+ 自评量表（下卷 12 则）”双重测量，两种方法相互印证，提高结果可信度。
 * 2. 每家各 2 则陈述，打乱排列，避免作答者猜到归属。
 * 3. 采用四级强迫选择（无“说不清”中间项），符合“答案不模棱两可”的设计要求。
 */
(function (root) {
  'use strict';

  var DaoTest = (root.DaoTest = root.DaoTest || {});

  // 四级选项：分值 1~4
  var SCALE_LEVELS = [
    { label: '完全不像我', value: 1 },
    { label: '不太像我', value: 2 },
    { label: '比较像我', value: 3 },
    { label: '完全是我', value: 4 }
  ];

  var SCALE_ITEMS = [
    { id: 's1', school: 'ru', text: '即使没人监督，答应别人的事我也会尽力做到问心无愧。' },
    { id: 's2', school: 'dao', text: '事情不顺时，我倾向于先松下来、等局势自然明朗，而不是强行推动。' },
    { id: 's3', school: 'fa', text: '我认为白纸黑字的规则与约定，比人情和默契更可靠。' },
    { id: 's4', school: 'mo', text: '与其讨论很久，我更愿意先动手做出一个能用的东西来验证。' },
    { id: 's5', school: 'bing', text: '做重要决定前，我习惯先想清楚最坏结果和退路。' },
    { id: 's6', school: 'zong', text: '我很容易察觉别人话里没说出口的顾虑和真实诉求。' },
    { id: 's7', school: 'zong', text: '遇到僵局，我第一反应是找人、借资源、换个说法去打通，而不是独自硬扛。' },
    { id: 's8', school: 'bing', text: '没有把握时，我宁愿忍一时、等更好的时机，也不愿贸然出手。' },
    { id: 's9', school: 'mo', text: '看到别人遇到实际困难，我会忍不住伸手帮忙，哪怕自己要多付出不少。' },
    { id: 's10', school: 'fa', text: '评价一件事，我更看重可衡量的结果，而不是动机和态度。' },
    { id: 's11', school: 'dao', text: '比起世俗意义上的成功，我更在意内心自在、生活节奏不被打乱。' },
    { id: 's12', school: 'ru', text: '我觉得一个人的分量，很大程度体现在他为家人和身边人担起了多少责任。' }
  ];

  DaoTest.SCALE_LEVELS = SCALE_LEVELS;
  DaoTest.SCALE_ITEMS = SCALE_ITEMS;
})(typeof window !== 'undefined' ? window : globalThis);
