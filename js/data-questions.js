/**
 * 诸子百家心理镜像测试 — 18 道明确情境测试题库（附先秦典籍微引）
 * 说明：
 * 1. 每道题附一条与场景呼应的中性先秦古籍微引（epigraph），增强文史沉浸感而不泄露流派倾向。
 * 2. 每道题设置 4 个明确、可落地的行为或价值抉择，避免模棱两可与道德说教。
 * 3. 六大流派（ru/dao/fa/mo/bing/zong）在 72 个选项中各占 12 次主权重(+3) 与 12 次次权重(+1)，
 *    且每题内 4 项主权重流派互不相同，单选项内主次流派互不相同，保证计分完全对称公平。
 */
(function (root) {
  'use strict';

  var DaoTest = (root.DaoTest = root.DaoTest || {});

  var QUESTIONS = [
    {
      id: 1,
      chapter: '第一问 · 世事突生变故',
      epigraph: '“日中则昃，月盈则食，天地盈虚，与时消息。” ——《周易·丰卦》',
      scenario: '做了半年的项目突然叫停。明早大家还要照常碰面，今晚你先做哪件事？',
      options: [
        {
          label: '甲',
          text: '把已有的材料列张清单，标出哪些还能用、哪些开支可以停。',
          primary: 'fa',
          secondary: 'bing'
        },
        {
          label: '乙',
          text: '约同伴出去走走，等消息明朗了，再商量下一步。',
          primary: 'dao',
          secondary: 'zong'
        },
        {
          label: '丙',
          text: '给一起赶工的人逐个发消息，把还欠谁的交代说清楚。',
          primary: 'ru',
          secondary: 'mo'
        },
        {
          label: '丁',
          text: '找合作方问问，原来做好的东西有没有别处用得上。',
          primary: 'zong',
          secondary: 'fa'
        }
      ]
    },
    {
      id: 2,
      chapter: '第二问 · 团队松散拖延',
      epigraph: '“其身正，不令而行。” ——《论语·子路》',
      scenario: '小组已经连续两次错过交稿日。今天由你接手，第一次碰头会怎么开？',
      options: [
        {
          label: '甲',
          text: '先分别问几位同伴卡在哪里，看看谁能和谁搭把手。',
          primary: 'zong',
          secondary: 'ru'
        },
        {
          label: '乙',
          text: '把每一项由谁负责、何时算交付写下来，让大家一起确认。',
          primary: 'fa',
          secondary: 'mo'
        },
        {
          label: '丙',
          text: '找出会拖住全组的那一项，先把人手集中到那里。',
          primary: 'bing',
          secondary: 'fa'
        },
        {
          label: '丁',
          text: '挑最难起头的一段，亲手做个样稿给大家接着改。',
          primary: 'mo',
          secondary: 'ru'
        }
      ]
    },
    {
      id: 3,
      chapter: '第三问 · 挚友开口借钱',
      epigraph: '“轻诺必寡信，多易必多难。” ——《道德经·第六十三章》',
      scenario: '十年的朋友来借钱，数目约是你积蓄的三成。他坦白说，还款日期暂时定不下来。你怎么答复？',
      options: [
        {
          label: '甲',
          text: '想到过去互相照应的情分，先商量借给他一部分救急。',
          primary: 'ru',
          secondary: 'dao'
        },
        {
          label: '乙',
          text: '算好自己能借的上限，再把借款和还款约定写清楚。',
          primary: 'fa',
          secondary: 'bing'
        },
        {
          label: '丙',
          text: '先约他坐下来理账，看看我能帮他解决哪一笔眼前的难处。',
          primary: 'mo',
          secondary: 'ru'
        },
        {
          label: '丁',
          text: '按最坏的情况算一遍，只拿出收不回来也能承受的数目。',
          primary: 'bing',
          secondary: 'fa'
        }
      ]
    },
    {
      id: 4,
      chapter: '第四问 · 无端遭人非议',
      epigraph: '“众恶之，必察焉；众好之，必察焉。” ——《论语·卫灵公》',
      scenario: '会上有人截取你邮件里的半句话，听起来像是你推掉了责任。轮到你说话了。',
      options: [
        {
          label: '甲',
          text: '请大家看那封邮件的上下文，按当时的记录还原事情。',
          primary: 'fa',
          secondary: 'mo'
        },
        {
          label: '乙',
          text: '先听完这场讨论，会后再找当事人聊，给彼此一点余地。',
          primary: 'dao',
          secondary: 'ru'
        },
        {
          label: '丙',
          text: '把我答应过的事讲清楚，也当面认下确实该我做的部分。',
          primary: 'ru',
          secondary: 'fa'
        },
        {
          label: '丁',
          text: '先问对方现在最担心什么，把讨论拉回大家要解决的问题。',
          primary: 'zong',
          secondary: 'bing'
        }
      ]
    },
    {
      id: 5,
      chapter: '第五问 · 七天无人长假',
      epigraph: '“一张一弛，文武之道也。” ——《礼记·杂记下》',
      scenario: '突然空出七天，没有工作消息，也没人等你交代行程。你最想怎样度过？',
      options: [
        {
          label: '甲',
          text: '找个安静地方住几晚，不排日程，想走时就出去走走。',
          primary: 'dao',
          secondary: 'zong'
        },
        {
          label: '乙',
          text: '回家看看长辈，带上那本读了半截的书，留几页读书笔记。',
          primary: 'ru',
          secondary: 'dao'
        },
        {
          label: '丙',
          text: '把搁在家里的旧东西修好，再去帮邻居做一件实事。',
          primary: 'mo',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '摊开过去半年的安排，想想下半年该给哪件事多留时间。',
          primary: 'bing',
          secondary: 'fa'
        }
      ]
    },
    {
      id: 6,
      chapter: '第六问 · 稀缺机会拍板',
      epigraph: '“君子不以言举人，不以人废言。” ——《论语·卫灵公》',
      scenario: '有一个进修名额，四位同伴都愿意去。你会把票投给谁？',
      options: [
        {
          label: '甲',
          text: '选常常补上最后一道工序、能把大家的想法做出来的人。',
          primary: 'mo',
          secondary: 'fa'
        },
        {
          label: '乙',
          text: '选能预先看出麻烦，也能在临时变动时排好轻重的人。',
          primary: 'bing',
          secondary: 'zong'
        },
        {
          label: '丙',
          text: '选擅长联络外部伙伴、能给全组带回合作机会的人。',
          primary: 'zong',
          secondary: 'ru'
        },
        {
          label: '丁',
          text: '按事先约好的评选办法，把票投给符合条件且得分最高的人。',
          primary: 'fa',
          secondary: 'bing'
        }
      ]
    },
    {
      id: 7,
      chapter: '第七问 · 重大职业岔路',
      epigraph: '“不患无位，患所以立。” ——《论语·里仁》',
      scenario: '一份工作收入高、工时波动大，另一份收入普通、下班时间稳定。什么最影响你的决定？',
      options: [
        {
          label: '甲',
          text: '先算好两份工作的储备和退路，看看分别能承受多少波动。',
          primary: 'bing',
          secondary: 'dao'
        },
        {
          label: '乙',
          text: '把一周的日子想一遍，选能留住睡眠、散步和独处时间的。',
          primary: 'dao',
          secondary: 'mo'
        },
        {
          label: '丙',
          text: '看看各自能认识哪些人，哪边有机会一起尝试新的事情。',
          primary: 'zong',
          secondary: 'bing'
        },
        {
          label: '丁',
          text: '和家人谈谈眼下的责任，选一条能长期兑现承诺的路。',
          primary: 'ru',
          secondary: 'bing'
        }
      ]
    },
    {
      id: 8,
      chapter: '第八问 · 目睹隐秘不公',
      epigraph: '“当仁，不让于师。” ——《论语·卫灵公》',
      scenario: '小组公布成果时，一位同伴做的工作又一次记在别人名下。你会先做什么？',
      options: [
        {
          label: '甲',
          text: '在下一次碰头时说清楚，那一部分是谁完成的。',
          primary: 'ru',
          secondary: 'mo'
        },
        {
          label: '乙',
          text: '先问同伴想怎么处理，再把几次分工和提交记录找齐。',
          primary: 'bing',
          secondary: 'zong'
        },
        {
          label: '丙',
          text: '坚持在我负责的部分写明贡献，考虑以后换个小组合作。',
          primary: 'dao',
          secondary: 'bing'
        },
        {
          label: '丁',
          text: '帮同伴补上这次的署名，并做一张以后大家都能查的记录表。',
          primary: 'mo',
          secondary: 'fa'
        }
      ]
    },
    {
      id: 9,
      chapter: '第九问 · 游说保守拍板人',
      epigraph: '“凡说之难，在知所说之心，可以吾说当之。” ——《韩非子·说难》',
      scenario: '你提了一个新方案，负责人刚听了开头就摇头。接下来呢？',
      options: [
        {
          label: '甲',
          text: '暂时把它搁一搁，看看还有没有更适合尝试的时机或场合。',
          primary: 'dao',
          secondary: 'zong'
        },
        {
          label: '乙',
          text: '约半天时间做个小样，下次带着能用的东西去谈。',
          primary: 'mo',
          secondary: 'fa'
        },
        {
          label: '丙',
          text: '请他具体讲讲担心哪一步，围绕那件事重新说一遍方案。',
          primary: 'zong',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '写下一次小试要花多少、由谁负责、用什么结果判断去留。',
          primary: 'fa',
          secondary: 'zong'
        }
      ]
    },
    {
      id: 10,
      chapter: '第十问 · 深陷漫长低谷',
      epigraph: '“尺蠖之屈，以求信也；龙蛇之蛰，以存身也。” ——《周易·系辞下》',
      scenario: '练习了几个月，看起来还是没什么起色。这周你愿意先试哪件事？',
      options: [
        {
          label: '甲',
          text: '给每天固定一小段练习时间，做完就在日历上记一笔。',
          primary: 'fa',
          secondary: 'ru'
        },
        {
          label: '乙',
          text: '留一个空晚上出去走走，暂时把和别人比较的事放下。',
          primary: 'dao',
          secondary: 'ru'
        },
        {
          label: '丙',
          text: '帮身边的人解决一个做得到的小问题，看看手上已有的本事。',
          primary: 'mo',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '翻出最近一次尝试，找出最费力却没进展的一步，下回改它。',
          primary: 'bing',
          secondary: 'mo'
        }
      ]
    },
    {
      id: 11,
      chapter: '第十一问 · 看待人情世故',
      epigraph: '“君子矜而不争，群而不党。” ——《论语·卫灵公》',
      scenario: '要和熟人长期共事，你最愿意在开头就养成哪个习惯？',
      options: [
        {
          label: '甲',
          text: '记下别人替我分担过的事，有机会就实实在在地帮回去。',
          primary: 'mo',
          secondary: 'ru'
        },
        {
          label: '乙',
          text: '答应的事准时交代，碰到对方不方便的地方留些分寸。',
          primary: 'ru',
          secondary: 'zong'
        },
        {
          label: '丙',
          text: '先说清费用、期限和责任，让以后接手的人也有据可查。',
          primary: 'fa',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '留心彼此眼下在乎什么，有分歧时给下次谈话留个开头。',
          primary: 'zong',
          secondary: 'mo'
        }
      ]
    },
    {
      id: 12,
      chapter: '第十二问 · 晚年回望无憾',
      epigraph: '“朝闻道，夕死可矣！” ——《论语·里仁》',
      scenario: '多年以后回看今天，哪段回忆会让你觉得这一程走得值得？',
      options: [
        {
          label: '甲',
          text: '几次局面很乱的时候，我辨清轻重，替大家保住了退路。',
          primary: 'bing',
          secondary: 'zong'
        },
        {
          label: '乙',
          text: '有人记得我守过的承诺，也曾从我做的事里得到照应。',
          primary: 'ru',
          secondary: 'mo'
        },
        {
          label: '丙',
          text: '和很不一样的人打过交道，促成过原本难以发生的合作。',
          primary: 'zong',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '在几次岔路口，我都给真正想过的生活留出了位置。',
          primary: 'dao',
          secondary: 'bing'
        }
      ]
    },
    {
      id: 13,
      chapter: '第十三问 · 跨界新机试水',
      epigraph: '“易，穷则变，变则通，通则久。” ——《周易·系辞下》',
      scenario: '有人邀你试试一个陌生行业，头几个月收入没把握。你怎么迈出第一步？',
      options: [
        {
          label: '甲',
          text: '划出一小笔预算和固定的空闲时间，先试两周再看结果。',
          primary: 'bing',
          secondary: 'fa'
        },
        {
          label: '乙',
          text: '找位从业者商量跟做一次，把一项真实任务从头做到尾。',
          primary: 'mo',
          secondary: 'bing'
        },
        {
          label: '丙',
          text: '约几位不同角色的人聊聊，看自己的经验能接上哪桩合作。',
          primary: 'zong',
          secondary: 'dao'
        },
        {
          label: '丁',
          text: '先想想没人催、也没有额外收入时，我还愿不愿意学这件事。',
          primary: 'dao',
          secondary: 'ru'
        }
      ]
    },
    {
      id: 14,
      chapter: '第十四问 · 至亲期望冲突',
      epigraph: '“事父母几谏。” ——《论语·里仁》',
      scenario: '长辈为你安排了一份安稳的工作，你已经另有打算。晚饭桌上又说起这件事。',
      options: [
        {
          label: '甲',
          text: '听完他们最挂心的地方，再把自己的安排一件件讲给他们听。',
          primary: 'ru',
          secondary: 'bing'
        },
        {
          label: '乙',
          text: '把由我承担的开支和决定写清楚，让长辈知道责任落在哪里。',
          primary: 'fa',
          secondary: 'dao'
        },
        {
          label: '丙',
          text: '问问他们信赖的亲友，能否一起谈谈两条路各自的生活。',
          primary: 'zong',
          secondary: 'bing'
        },
        {
          label: '丁',
          text: '先把自己选的工作做出一件成果，下次带回家给他们看。',
          primary: 'mo',
          secondary: 'ru'
        }
      ]
    },
    {
      id: 15,
      chapter: '第十五问 · 以弱敌强破局',
      epigraph: '“善战者，求之于势，不责于人。” ——《孙子兵法·势篇》',
      scenario: '附近新来一家资源充足的同行，你的小店预算有限。下一周先把工夫花在哪里？',
      options: [
        {
          label: '甲',
          text: '去听一听哪些客人的需要还没人顾上，挑其中一项试做。',
          primary: 'bing',
          secondary: 'zong'
        },
        {
          label: '乙',
          text: '跟着一位老顾客走一遍使用过程，把最不方便的细节改好。',
          primary: 'mo',
          secondary: 'fa'
        },
        {
          label: '丙',
          text: '翻一遍采购、交付和返工记录，先省下最可惜的一笔开支。',
          primary: 'fa',
          secondary: 'mo'
        },
        {
          label: '丁',
          text: '给常来的客人回访，把之前答应过他们的事一件件做好。',
          primary: 'ru',
          secondary: 'dao'
        }
      ]
    },
    {
      id: 16,
      chapter: '第十六问 · 顺境意外走红',
      epigraph: '“傲不可长，欲不可纵，志不可满，乐不可极。” ——《礼记·曲礼上》',
      scenario: '一件作品意外走红，合作邀约挤满收件箱。你打开第一封邮件前会做什么？',
      options: [
        {
          label: '甲',
          text: '想想热度退下去以后还剩哪些承诺，把能承受的上限定下来。',
          primary: 'bing',
          secondary: 'ru'
        },
        {
          label: '乙',
          text: '按合作方向整理来信，约几位可能长期合拍的人先认识一下。',
          primary: 'zong',
          secondary: 'fa'
        },
        {
          label: '丙',
          text: '把接下来几天的创作时间留出来，只挑真正想做的邀约看。',
          primary: 'dao',
          secondary: 'zong'
        },
        {
          label: '丁',
          text: '把接单条件、报价和交付时间写下来，以后照同一套标准回复。',
          primary: 'fa',
          secondary: 'bing'
        }
      ]
    },
    {
      id: 17,
      chapter: '第十七问 · 至交背道而驰',
      epigraph: '“君子之交淡若水，小人之交甘若醴。” ——《庄子·山木》',
      scenario: '多年的好友和你看事情越来越不同，每次聚会都绕回同一场争论。你想怎样相处？',
      options: [
        {
          label: '甲',
          text: '把见面间隔拉长一点，允许这段关系有自己的变化。',
          primary: 'dao',
          secondary: 'mo'
        },
        {
          label: '乙',
          text: '挑两人都喜欢的事一起做，对方遇到要紧事我仍愿意帮忙。',
          primary: 'ru',
          secondary: 'mo'
        },
        {
          label: '丙',
          text: '找个安静的时候谈清彼此的底线，再决定哪些事还适合一起做。',
          primary: 'fa',
          secondary: 'ru'
        },
        {
          label: '丁',
          text: '把来往放在仍能谈得拢的事上，遇到共同需要再约他合作。',
          primary: 'zong',
          secondary: 'dao'
        }
      ]
    },
    {
      id: 18,
      chapter: '第十八问 · 面对时代焦虑',
      epigraph: '“居安思危，思则有备，有备无患。” ——《左传·襄公十一年》',
      scenario: '周围人纷纷报班学新技能。关掉手机，什么最能让你定下心来？',
      options: [
        {
          label: '甲',
          text: '翻翻自己的安排，给想学的事留时间，也允许进度跟别人不同。',
          primary: 'dao',
          secondary: 'zong'
        },
        {
          label: '乙',
          text: '想起最近确实替人解决过的难题，知道手上还有用得着的本事。',
          primary: 'mo',
          secondary: 'fa'
        },
        {
          label: '丙',
          text: '看看现有的储备和备选计划，清楚遇到变化时第一步能做什么。',
          primary: 'bing',
          secondary: 'mo'
        },
        {
          label: '丁',
          text: '想起几位可以彼此商量的人，以及我每天仍然做得到的本分。',
          primary: 'ru',
          secondary: 'zong'
        }
      ]
    }
  ];

  DaoTest.QUESTIONS = QUESTIONS;
})(typeof window !== 'undefined' ? window : globalThis);
