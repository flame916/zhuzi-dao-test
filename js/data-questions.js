/**
 * 诸子百家心理镜像测试 — 12 道明确情境测试题库
 * 说明：
 * 1. 每道题均设置 4 个明确、可落地的行为或价值抉择，避免模棱两可与道德说教。
 * 2. 六大流派（ru/dao/fa/mo/bing/zong）在 48 个选项中各占 8 次主权重(+3) 与 8 次次权重(+1)，
 *    且每题内 4 项主权重流派互不相同，单选项内主次流派互不相同，保证计分完全对称公平。
 */
(function (root) {
  'use strict';

  var DaoTest = (root.DaoTest = root.DaoTest || {});

  var QUESTIONS = [
    {
      id: 1,
      chapter: '第一问 · 世事突生变故',
      scenario: '你倾注半年心血推进的核心计划，因外部政策或大环境突变在一夜之间被彻底叫停。平复三秒后，你第一件立刻去做的事是：',
      options: [
        {
          label: '甲',
          text: '立刻盘点已沉淀的文档、物料与人脉资产，把它们拆解封存，算清还能止损或复用的部分。',
          primary: 'fa',
          secondary: 'bing'
        },
        {
          label: '乙',
          text: '合上电脑出门走走，承认大势已变，不再与不可逆转的客观环境较劲，先让自己睡个整觉。',
          primary: 'dao',
          secondary: 'zong'
        },
        {
          label: '丙',
          text: '先逐一安抚一起熬夜付出的同伴情绪，妥善交代善后事宜，确保收尾有始有终、不负彼此信任。',
          primary: 'ru',
          secondary: 'mo'
        },
        {
          label: '丁',
          text: '马上打听叫停背后的真实风向与新缺口，顺势调整说辞，把原本的资源转接到新风口上。',
          primary: 'zong',
          secondary: 'fa'
        }
      ]
    },
    {
      id: 2,
      chapter: '第二问 · 团队松散拖延',
      scenario: '你接手了一个新协作小组，大家表面一团和气，但关键节点屡屡拖延，前任负责人总是劝和了事。你接管后的第一板斧是：',
      options: [
        {
          label: '甲',
          text: '先私下摸清每个人的核心诉求与怕担的责任，用彼此需要交换的利益把各人重新绑定到一起。',
          primary: 'zong',
          secondary: 'ru'
        },
        {
          label: '乙',
          text: '废除口头约定，直接公布白纸黑字的权责表、交付标准与违约扣除细则，对事不对人严格执行。',
          primary: 'fa',
          secondary: 'mo'
        },
        {
          label: '丙',
          text: '先砍掉一半华而不实的目标，把关键卡点设为“一票决胜区”，集中精力攻破一个标杆任务立威。',
          primary: 'bing',
          secondary: 'fa'
        },
        {
          label: '丁',
          text: '自己挽起袖子接下最硬、最没人愿干的那一块，拿出一份实打实的样板带头做出来让大家跟进。',
          primary: 'mo',
          secondary: 'ru'
        }
      ]
    },
    {
      id: 3,
      chapter: '第三问 · 挚友开口借钱',
      scenario: '交情十年的老友创业受挫，深夜开口向你借一笔占你现存积蓄三成的资金，且坦白短期内归期未定。你的真实决断是：',
      options: [
        {
          label: '甲',
          text: '念及多年情义与对方当下难处，只要对方为人厚道，便尽力借出大部分，甚至不急着谈利息。',
          primary: 'ru',
          secondary: 'dao'
        },
        {
          label: '乙',
          text: '明确划清感情与金钱的边界，借可以，但必须按实际承担能力设定上限并白纸黑字立下借条。',
          primary: 'fa',
          secondary: 'bing'
        },
        {
          label: '丙',
          text: '不直接给现金兜底，而是花整晚帮他盘点账目、介绍靠谱人脉或直接帮他分担几项具体业务难题。',
          primary: 'mo',
          secondary: 'ru'
        },
        {
          label: '丁',
          text: '冷静评估他这摊生意的翻盘概率，只拿出一笔“即便彻底打水漂也不影响自己根基”的额度支援。',
          primary: 'bing',
          secondary: 'fa'
        }
      ]
    },
    {
      id: 4,
      chapter: '第四问 · 无端遭人非议',
      scenario: '在一场重要会议或公共场合中，竞争对手用断章取义的话暗中给你扣帽子，在场众人的眼神瞬间微妙起来。你当场的反应是：',
      options: [
        {
          label: '甲',
          text: '不动声色，直接调出完整的时间线与原始记录，用一条条铁证把曲解当场拍平。',
          primary: 'fa',
          secondary: 'mo'
        },
        {
          label: '乙',
          text: '微微一笑略过锋芒，不急着当众撕扯辩白，因为清者自清，时间与后续成果自会替你开口。',
          primary: 'dao',
          secondary: 'ru'
        },
        {
          label: '丙',
          text: '坦然站稳立场，不卑不亢重申自己做事的本心与原则，既守住体面，也不失君子之风。',
          primary: 'ru',
          secondary: 'fa'
        },
        {
          label: '丁',
          text: '顺着对方的逻辑把话题引向更高层或更关键的全局利益，让在场者一眼看穿对方的真正算盘。',
          primary: 'zong',
          secondary: 'bing'
        }
      ]
    },
    {
      id: 5,
      chapter: '第五问 · 七天无人长假',
      scenario: '你意外获得整整七天没有任何工作消息、也无人打扰的完全自由时间，不用向任何人汇报行踪。你最想把这七天度成什么样？',
      options: [
        {
          label: '甲',
          text: '去一个有山有水的地方住下，不设闹钟，看云吹风、漫无目的地散步发呆，把脑子彻底放空。',
          primary: 'dao',
          secondary: 'zong'
        },
        {
          label: '乙',
          text: '整理书桌静心读几本一直没啃完的经典，写几页手记，探望平时少有时间陪的家中长辈。',
          primary: 'ru',
          secondary: 'dao'
        },
        {
          label: '丙',
          text: '亲手修复家里积攒的小物件、研究一道费工夫的菜，或去参与一次踏实出力的公益/手作活动。',
          primary: 'mo',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '趁这七天没人打扰，把下半年的人生账本、技能短板与关键战役复盘一遍，推演下一步棋怎么走。',
          primary: 'bing',
          secondary: 'fa'
        }
      ]
    },
    {
      id: 6,
      chapter: '第六问 · 稀缺机会拍板',
      scenario: '手里只有一个极宝贵的晋升/核心资源名额，四位候选人各有千秋。由你一锤定音，你心里最重的那杆秤会倾向谁？',
      options: [
        {
          label: '甲',
          text: '选那个平时默默填坑、关键时刻永远顶得上、苦活脏活从来不推诿的实干派。',
          primary: 'mo',
          secondary: 'fa'
        },
        {
          label: '乙',
          text: '选那个抗压极强、总能提前预判风险、在最混乱局面里也能稳住全盘不出错的破局者。',
          primary: 'bing',
          secondary: 'zong'
        },
        {
          label: '丙',
          text: '选那个最懂向上借力、能把各方关系摆平、帮团队把外部蛋糕做大的人。',
          primary: 'zong',
          secondary: 'ru'
        },
        {
          label: '丁',
          text: '只认此前白纸黑字定下的量化业绩与硬性达标结果，谁分数最高就给谁，绝不破例开后门。',
          primary: 'fa',
          secondary: 'bing'
        }
      ]
    },
    {
      id: 7,
      chapter: '第七问 · 重大职业岔路',
      scenario: '面前摆着两条路：一边是高薪厚禄但需长期高压消耗、随时可能洗牌；另一边是收入平淡安稳但一眼望到头。深夜独处时，你拍板留下的真正依据是：',
      options: [
        {
          label: '甲',
          text: '算清两边的攻守赔率、现金流安全垫与退路底线，先确保“进能成势，退有保底”，不赌盲拳。',
          primary: 'bing',
          secondary: 'dao'
        },
        {
          label: '乙',
          text: '问自己哪一边更能留住内心的松弛、睡眠与自我掌控感，绝不为多余的身外物典当整个人生。',
          primary: 'dao',
          secondary: 'mo'
        },
        {
          label: '丙',
          text: '看哪一边天花板更高、能接触到更核心的圈层与杠杆资源，先去更广阔的牌桌搏一轮再说。',
          primary: 'zong',
          secondary: 'bing'
        },
        {
          label: '丁',
          text: '掂量自己对家人肩头的责任、专业上的长远尊严，选那条能稳妥扎根并留下长久价值的路。',
          primary: 'ru',
          secondary: 'bing'
        }
      ]
    },
    {
      id: 8,
      chapter: '第八问 · 目睹隐秘不公',
      scenario: '你发现在所处的组织或社群里，有人正利用隐秘的潜规则长期侵占老实人的劳动成果，而周围大多数人都选择睁一只眼闭一只眼。你会：',
      options: [
        {
          label: '甲',
          text: '忍无可忍时当面拍案直言，哪怕自己惹上麻烦或得罪人，也要替弱者把公道讨回来。',
          primary: 'ru',
          secondary: 'mo'
        },
        {
          label: '乙',
          text: '不打无准备的口水仗，先暗中收集完整证据链、摸清规则漏洞，等待最一击必中的时机再出手。',
          primary: 'bing',
          secondary: 'zong'
        },
        {
          label: '丙',
          text: '看透人世本多参差，自己绝不同流合污，若整体风气已不可救，便悄悄另寻更清明的去处。',
          primary: 'dao',
          secondary: 'bing'
        },
        {
          label: '丁',
          text: '着手搭建或推动一套透明公开的记录与分配机制，并亲自帮受损者把实际权益补救回来。',
          primary: 'mo',
          secondary: 'fa'
        }
      ]
    },
    {
      id: 9,
      chapter: '第九问 · 游说保守拍板人',
      scenario: '你有一个极看好的新点子或新方案，但手里握着决定权的那位老前辈性格极保守，刚听个开头就摆手拒绝。你接下来会：',
      options: [
        {
          label: '甲',
          text: '顺水推舟先搁下，若事物真有生命力，等时机更熟再提，或者另换一条不必求人的路径自己走。',
          primary: 'dao',
          secondary: 'zong'
        },
        {
          label: '乙',
          text: '不跟他空口争辩概念，利用业余时间直接做出一个可运行的小样本或原型，用真实效果说话。',
          primary: 'mo',
          secondary: 'fa'
        },
        {
          label: '丙',
          text: '换位揣摩他最担心的风险与最在乎的政绩，把你的方案重新包装成“替他兜底减负”的好事再去谈。',
          primary: 'zong',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '列出一份严谨的成本收益与风险隔离对照表，明确说明失败谁承担、成功如何量化，以制度说服他。',
          primary: 'fa',
          secondary: 'zong'
        }
      ]
    },
    {
      id: 10,
      chapter: '第十问 · 深陷漫长低谷',
      scenario: '当你连续几个月拼尽全力却颗粒无收，看着同龄人纷纷领先，陷入深深的自我怀疑。此时最能把你从泥潭里拉起来的念头或做法是：',
      options: [
        {
          label: '甲',
          text: '定下几条铁一般硬性的每日作息与推进清单，不去想远大宏图，只机械而严格地把今日事做完。',
          primary: 'fa',
          secondary: 'ru'
        },
        {
          label: '乙',
          text: '告诉自己万物皆有冬藏与春生，暂时允许自己慢下来退一步，在独处与自然里把心神养回来。',
          primary: 'dao',
          secondary: 'ru'
        },
        {
          label: '丙',
          text: '去干一件具体而微小的实事——扫屋、修补、帮人解决一个小麻烦，从实实在在的产出感里找回力量。',
          primary: 'mo',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '像战败的将军一样冷酷复盘：哪里判断失误？哪里资源错配？把情绪剥离，只修补下一轮战术。',
          primary: 'bing',
          secondary: 'mo'
        }
      ]
    },
    {
      id: 11,
      chapter: '第十一问 · 看待人情世故',
      scenario: '在复杂的职场与日常往来中，历经几番起伏后，你内心深处最笃信下面哪一条处世准则？',
      options: [
        {
          label: '甲',
          text: '真挚比圆滑更重要，少玩弄心眼，谁在我难时雪中送炭，我便用十倍的实在行动去回报他。',
          primary: 'mo',
          secondary: 'ru'
        },
        {
          label: '乙',
          text: '人情再好也要讲礼数、守分寸，对长幼亲疏各有敬重与底线，久交靠的终究是人品与信义。',
          primary: 'ru',
          secondary: 'zong'
        },
        {
          label: '丙',
          text: '丑话当先、利益说清、权责分明，靠规则约束的关系反而最省心、最能走得长久。',
          primary: 'fa',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '世事没有绝对的敌友，看懂各人背后的顾虑与立场，留三分余地与话头，才能在变局中进退自如。',
          primary: 'zong',
          secondary: 'mo'
        }
      ]
    },
    {
      id: 12,
      chapter: '第十二问 · 晚年回望无憾',
      scenario: '假如人生走到晚年，可以自由回望这一生，下面哪一种生命的归宿感会让你最觉得“此生无憾”？',
      options: [
        {
          label: '甲',
          text: '这一生进退有度、危难时稳住过大事，即便经历波澜也能全身而退，活成了一个清醒的定海神针。',
          primary: 'bing',
          secondary: 'zong'
        },
        {
          label: '乙',
          text: '这一生对得起良心与身后亲友，曾替后人留下过体面、温情或立得住的建树，受人敬重追念。',
          primary: 'ru',
          secondary: 'mo'
        },
        {
          label: '丙',
          text: '这一生见过大世面、结交过各路豪杰，在复杂风云里淋漓尽致地博弈并施展过自己的才华。',
          primary: 'zong',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '这一生少受世俗羁绊，忠实按自己的节奏活过、看过人间山水，临了内心依然通透安宁、自在无愧。',
          primary: 'dao',
          secondary: 'bing'
        }
      ]
    }
  ];

  DaoTest.QUESTIONS = QUESTIONS;
})(typeof window !== 'undefined' ? window : globalThis);
