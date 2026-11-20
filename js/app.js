/**
 * 诸子百家心理镜像测试 — 主控视图状态机与交互逻辑
 */
(function (root) {
  'use strict';

  var CN_NUMERALS = [
    '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾',
    '拾壹', '拾贰', '拾叁', '拾肆', '拾伍', '拾陆', '拾柒', '拾捌'
  ];

  document.addEventListener('DOMContentLoaded', function () {
    var DaoTest = root.DaoTest || {};
    var SCHOOLS = DaoTest.SCHOOLS;
    var SCHOOL_ORDER = DaoTest.SCHOOL_ORDER;
    var COMBO_INSIGHTS = DaoTest.COMBO_INSIGHTS;
    var EXTRA_SCHOOLS = DaoTest.EXTRA_SCHOOLS;
    var QUESTIONS = DaoTest.QUESTIONS;
    var Scoring = DaoTest.Scoring;
    var Visuals = DaoTest.Visuals;

    if (!SCHOOLS || !QUESTIONS || !Scoring || !Visuals) {
      return;
    }

    // 应用核心状态
    var state = {
      currentView: 'home',
      currentIndex: 0,
      answers: new Array(QUESTIONS.length).fill(null),
      result: null,
      isTransitioning: false,
      activeCodexTab: 'ru',
      toastTimer: null
    };

    // DOM 引用缓存
    var views = {
      home: document.getElementById('view-home'),
      quiz: document.getElementById('view-quiz'),
      loading: document.getElementById('view-loading'),
      result: document.getElementById('view-result')
    };

    var dom = {
      btnStartQuiz: document.getElementById('btn-start-quiz'),
      btnOpenCodexHome: document.getElementById('btn-open-codex-home'),
      btnHome: document.getElementById('btn-home'),
      btnPrev: document.getElementById('btn-prev'),
      quizProgressText: document.getElementById('quiz-progress-text'),
      quizProgressFill: document.getElementById('quiz-progress-fill'),
      quizChapter: document.getElementById('quiz-chapter'),
      quizEpigraph: document.getElementById('quiz-epigraph'),
      quizScenario: document.getElementById('quiz-scenario'),
      quizOptions: document.getElementById('quiz-options'),

      resArtImg: document.getElementById('res-art-img'),
      resBadge: document.getElementById('res-badge'),
      resHeadline: document.getElementById('res-headline'),
      resSeal: document.getElementById('res-seal'),
      resArchetype: document.getElementById('res-archetype'),
      resVerdict: document.getElementById('res-verdict'),
      resKeywords: document.getElementById('res-keywords'),
      resRadarContainer: document.getElementById('res-radar-container'),
      resBarsContainer: document.getElementById('res-bars-container'),
      resStoryRep: document.getElementById('res-story-rep'),
      resStoryTitle: document.getElementById('res-story-title'),
      resStoryBody: document.getElementById('res-story-body'),
      resQuote: document.getElementById('res-quote'),
      resQuoteAuthor: document.getElementById('res-quote-author'),
      resQuoteModern: document.getElementById('res-quote-modern'),
      resClassicsList: document.getElementById('res-classics-list'),
      resBooksList: document.getElementById('res-books-list'),
      resSceneSubtitle: document.getElementById('res-scene-subtitle'),
      resSceneGuides: document.getElementById('res-scene-guides'),
      resStrength: document.getElementById('res-strength'),
      resBalance: document.getElementById('res-balance'),
      resShadow: document.getElementById('res-shadow'),
      resAction: document.getElementById('res-action'),
      resDecisionChecklist: document.getElementById('res-decision-checklist'),
      resRoadmap: document.getElementById('res-roadmap'),

      btnGenPoster: document.getElementById('btn-gen-poster'),
      btnCopyResult: document.getElementById('btn-copy-result'),
      btnOpenCodexResult: document.getElementById('btn-open-codex-result'),
      btnRestart: document.getElementById('btn-restart'),

      modalCodex: document.getElementById('modal-codex'),
      codexTabs: document.getElementById('codex-tabs'),
      codexContent: document.getElementById('codex-content'),

      modalPoster: document.getElementById('modal-poster'),
      posterPreviewImg: document.getElementById('poster-preview-img'),
      btnDownloadPoster: document.getElementById('btn-download-poster'),

      toastMsg: document.getElementById('toast-msg')
    };

    /**
     * 安全切换主视图并滚回顶部
     */
    function switchView(viewName) {
      state.currentView = viewName;
      Object.keys(views).forEach(function (key) {
        if (views[key]) {
          views[key].classList.toggle('view-active', key === viewName);
        }
      });
      root.scrollTo(0, 0);
    }

    /**
     * 显示轻提示 Toast
     */
    function showToast(msg) {
      if (!dom.toastMsg) return;
      dom.toastMsg.textContent = msg;
      dom.toastMsg.classList.add('is-visible');
      if (state.toastTimer) {
        clearTimeout(state.toastTimer);
      }
      state.toastTimer = setTimeout(function () {
        dom.toastMsg.classList.remove('is-visible');
      }, 2400);
    }

    /**
     * 渲染当前题目卡片与作答状态
     */
    function renderQuestion() {
      var idx = state.currentIndex;
      var q = QUESTIONS[idx];
      var total = QUESTIONS.length;
      var selectedIdx = state.answers[idx];

      dom.quizProgressText.textContent = '第 ' + (CN_NUMERALS[idx] || idx + 1) + ' / ' + CN_NUMERALS[total - 1] + ' 问';
      dom.quizProgressFill.style.width = (((idx + 1) / total) * 100).toFixed(2) + '%';
      dom.quizChapter.textContent = q.chapter;
      if (dom.quizEpigraph) {
        dom.quizEpigraph.textContent = q.epigraph || '';
        dom.quizEpigraph.style.display = q.epigraph ? 'block' : 'none';
      }
      dom.quizScenario.textContent = q.scenario;

      dom.btnPrev.style.visibility = idx === 0 ? 'hidden' : 'visible';
      dom.btnPrev.disabled = idx === 0;

      // 生成四个选项按钮
      dom.quizOptions.innerHTML = '';
      q.options.forEach(function (opt, optIdx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn' + (selectedIdx === optIdx ? ' is-selected' : '');
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', selectedIdx === optIdx ? 'true' : 'false');

        var stamp = document.createElement('span');
        stamp.className = 'option-stamp';
        stamp.textContent = opt.label;

        var textSpan = document.createElement('span');
        textSpan.textContent = opt.text;

        btn.appendChild(stamp);
        btn.appendChild(textSpan);

        btn.addEventListener('click', function () {
          handleOptionSelect(optIdx);
        });
        dom.quizOptions.appendChild(btn);
      });
    }

    /**
     * 处理答题选项点击，短暂展示墨晕高亮后平滑前进
     */
    function handleOptionSelect(optIdx) {
      if (state.isTransitioning) return;
      state.isTransitioning = true;
      state.answers[state.currentIndex] = optIdx;

      // 立即更新选中高亮反馈
      var optionButtons = dom.quizOptions.querySelectorAll('.option-btn');
      optionButtons.forEach(function (btn, idx) {
        var active = idx === optIdx;
        btn.classList.toggle('is-selected', active);
        btn.setAttribute('aria-checked', active ? 'true' : 'false');
      });

      setTimeout(function () {
        if (state.currentIndex < QUESTIONS.length - 1) {
          state.currentIndex += 1;
          renderQuestion();
          state.isTransitioning = false;
        } else {
          finishQuizAndRenderResult();
        }
      }, 260);
    }

    /**
     * 完成全部 12 题后进入研墨推演并展示结果长卷
     */
    function finishQuizAndRenderResult() {
      switchView('loading');
      try {
        state.result = Scoring.calculateResult(state.answers, QUESTIONS, SCHOOL_ORDER);
      } catch (err) {
        state.isTransitioning = false;
        showToast('推演遇到意外，请检查作答后重试。');
        switchView('quiz');
        return;
      }

      setTimeout(function () {
        renderResult(state.result);
        switchView('result');
        state.isTransitioning = false;
      }, 820);
    }

    /**
     * 渲染四字竖排传统方印（右列先读，左列后读）
     */
    function renderSealChars(sealEl, sealText) {
      var chars = Array.from(String(sealText || '寻道')).slice(0, 4);
      sealEl.innerHTML = '';
      if (chars.length === 4) {
        // CSS grid 为 2x2 从左到右排布，因此先左列(chars[2], chars[3])再右列(chars[0], chars[1])
        var ordered = [chars[2], chars[0], chars[3], chars[1]];
        ordered.forEach(function (ch) {
          var span = document.createElement('span');
          span.textContent = ch;
          sealEl.appendChild(span);
        });
      } else {
        sealEl.textContent = chars.join('');
      }
    }

    /**
     * 渲染结果页面所有核心区块
     */
    function renderResult(result) {
      var top1School = SCHOOLS[result.top1.id];
      var top2School = SCHOOLS[result.top2.id];
      var insight = COMBO_INSIGHTS[result.comboKey] || {
        archetype: top1School.daoTitle,
        verdict: top1School.coreSummary,
        balanceAdvice: top1School.actionNow
      };

      // 卷首画像卡
      dom.resArtImg.src = top1School.image;
      dom.resArtImg.alt = top1School.name + '水墨意象图';
      dom.resBadge.textContent = result.isPure ? '纯粹之道 · 专注本心' : '主辅双道 · 互参破局';
      dom.resHeadline.textContent = result.isPure
        ? '你最契合：' + result.top1.percent + '% ' + top1School.name
        : '你最契合：' + result.top1.percent + '% ' + top1School.name + ' · ' + result.top2.percent + '% ' + top2School.name;

      renderSealChars(dom.resSeal, top1School.sealText);
      dom.resArchetype.textContent = insight.archetype;
      dom.resVerdict.textContent = insight.verdict;

      // 关键词标签（合并主道 3 个与辅道 1 个特色词）
      dom.resKeywords.innerHTML = '';
      var tags = top1School.keywords.slice(0, 3);
      if (!result.isPure && top2School.keywords.length > 0) {
        tags.push(top2School.keywords[0]);
      } else if (top1School.keywords[3]) {
        tags.push(top1School.keywords[3]);
      }
      tags.forEach(function (kw) {
        var chip = document.createElement('span');
        chip.className = 'keyword-chip';
        chip.textContent = '# ' + kw;
        dom.resKeywords.appendChild(chip);
      });

      // 渲染六维 SVG 雷达图
      Visuals.renderInkRadarSVG(dom.resRadarContainer, result, SCHOOLS, SCHOOL_ORDER);

      // 渲染六家降序百分比条形榜（默认展开第一名）
      dom.resBarsContainer.innerHTML = '';
      var maxBarRef = Math.max(45, result.top1.percent);
      result.ranked.forEach(function (item, idx) {
        var s = SCHOOLS[item.id];
        var isTop2 = idx < 2;

        var row = document.createElement('div');
        row.className = 'bar-item' + (isTop2 ? ' is-top' : '') + (idx === 0 ? ' is-open' : '');
        row.setAttribute('role', 'button');
        row.setAttribute('tabindex', '0');
        row.setAttribute('aria-expanded', idx === 0 ? 'true' : 'false');

        var rankLabel = idx === 0 ? '主道' : idx === 1 ? '辅道' : '';
        var rankBadgeHtml = rankLabel ? '<span class="bar-rank-tag">' + rankLabel + '</span>' : '';

        var barWidth = Math.max(4, Math.min(100, Math.round((item.percent / maxBarRef) * 100)));

        row.innerHTML =
          '<div class="bar-header">' +
            '<span class="bar-name-group">' + escapeHtml(s.name) + rankBadgeHtml + '</span>' +
            '<span class="bar-percent">' + item.percent + '%</span>' +
          '</div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + barWidth + '%"></div></div>' +
          '<div class="bar-detail">' +
            '<div><strong>为何与你契合：</strong>' + escapeHtml(s.matchTrait) + '</div>' +
            '<div style="margin-top:4px;"><strong>代表先贤：</strong>' + escapeHtml(s.representatives) + ' ｜ 「' + escapeHtml(s.quote) + '」</div>' +
          '</div>';

        function toggleBarDetail() {
          var willOpen = !row.classList.contains('is-open');
          row.classList.toggle('is-open', willOpen);
          row.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        }

        row.addEventListener('click', toggleBarDetail);
        row.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            toggleBarDetail();
          }
        });

        dom.resBarsContainer.appendChild(row);
      });

      // 古人也曾迷茫 · 历史镜像与本命原典精读
      dom.resStoryRep.textContent = top1School.name + ' · ' + top1School.representatives;
      dom.resStoryTitle.textContent = top1School.ancientStoryTitle;
      dom.resStoryBody.textContent = top1School.ancientStory;
      dom.resQuote.textContent = '“' + top1School.quote + '”';
      dom.resQuoteAuthor.textContent = '—— ' + top1School.quoteAuthor;
      dom.resQuoteModern.textContent = '现代破局解意：' + top1School.quoteModern;

      // 本命与调和原典摘录（纯粹态展示主道 4 则；合参态展示主道 3 则 + 辅道 1 则）
      if (dom.resClassicsList) {
        var excerptItems = [];
        var primaryList = Array.isArray(top1School.classicExcerpts) ? top1School.classicExcerpts : [];
        if (result.isPure || !top2School.classicExcerpts || top2School.classicExcerpts.length === 0) {
          primaryList.slice(0, 4).forEach(function (ex) {
            excerptItems.push({ prefix: top1School.name + ' · ', item: ex });
          });
        } else {
          primaryList.slice(0, 3).forEach(function (ex) {
            excerptItems.push({ prefix: '主道 · ', item: ex });
          });
          excerptItems.push({ prefix: '辅道调和(' + top2School.name + ') · ', item: top2School.classicExcerpts[0] });
        }

        dom.resClassicsList.innerHTML = excerptItems
          .map(function (entry) {
            var ex = entry.item;
            return (
              '<div class="classic-item">' +
                '<div class="classic-item-head">' +
                  '<span class="classic-tag">' + escapeHtml(entry.prefix + ex.tag) + '</span>' +
                  '<span class="classic-source">' + escapeHtml(ex.source) + '</span>' +
                '</div>' +
                '<p class="classic-text">“' + escapeHtml(ex.text) + '”</p>' +
                '<p class="classic-note">' + escapeHtml(ex.note) + '</p>' +
              '</div>'
            );
          })
          .join('');
      }

      // 枕边推荐典籍书单（补齐至 3 本呈现均衡三列）
      if (dom.resBooksList) {
        var books = (top1School.recommendedBooks || []).slice(0, 3);
        if (books.length < 3 && top2School.recommendedBooks && top2School.recommendedBooks.length > 0) {
          books.push(top2School.recommendedBooks[0]);
        }
        dom.resBooksList.innerHTML = books
          .map(function (bk) {
            return (
              '<div class="book-card">' +
                '<div class="book-title">' + escapeHtml(bk.title) + '</div>' +
                '<div class="book-chapter">优先篇目：' + escapeHtml(bk.chapter) + '</div>' +
                '<p class="book-reason">' + escapeHtml(bk.reason) + '</p>' +
              '</div>'
            );
          })
          .join('');
      }

      // 分场景迷茫破局指引
      if (dom.resSceneSubtitle) {
        dom.resSceneSubtitle.textContent = result.isPure
          ? '以' + top1School.name + '立骨，直面当下四重现实关口'
          : '以' + top1School.name + '立骨 · 借' + top2School.name + '调和，照见当下破局路';
      }
      if (dom.resSceneGuides) {
        var guides = top1School.sceneGuides || [];
        dom.resSceneGuides.innerHTML = guides
          .map(function (g) {
            return (
              '<div class="scene-card">' +
                '<span class="scene-badge">' + escapeHtml(g.scene) + '</span>' +
                '<h4 class="scene-title">' + escapeHtml(g.title) + '</h4>' +
                '<p class="scene-guide">' + escapeHtml(g.guide) + '</p>' +
              '</div>'
            );
          })
          .join('');
      }

      // 寻道破局行动蓝图
      dom.resStrength.textContent = top1School.strength;
      dom.resBalance.textContent = insight.balanceAdvice;
      dom.resShadow.textContent = top1School.shadow;
      dom.resAction.textContent = top1School.actionNow;

      // 重大抉择自检三问
      if (dom.resDecisionChecklist) {
        var checks = top1School.decisionChecklist || [];
        dom.resDecisionChecklist.innerHTML = checks
          .map(function (item) {
            return '<li>' + escapeHtml(item) + '</li>';
          })
          .join('');
      }

      // 三阶落地行动路线图
      if (dom.resRoadmap && top1School.roadmap) {
        var rm = top1School.roadmap;
        var steps = [
          { tag: '一 · 今日破冰（24小时内）', text: rm.today, cls: 'step-today' },
          { tag: '二 · 七日定心（本周锚点）', text: rm.week, cls: '' },
          { tag: '三 · 一月成势（长期根基）', text: rm.month, cls: '' }
        ];
        dom.resRoadmap.innerHTML = steps
          .map(function (st) {
            return (
              '<div class="roadmap-step ' + st.cls + '">' +
                '<div class="roadmap-step-tag">' + escapeHtml(st.tag) + '</div>' +
                '<p>' + escapeHtml(st.text) + '</p>' +
              '</div>'
            );
          })
          .join('');
      }
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    /**
     * 渲染百家典籍弹窗内容
     */
    function renderCodexModal(activeKey) {
      state.activeCodexTab = activeKey || 'ru';
      var tabs = SCHOOL_ORDER.map(function (id) {
        return { key: id, label: SCHOOLS[id].name };
      });
      tabs.push({ key: 'extra', label: '其余四家（农·名·阴阳·杂）' });

      dom.codexTabs.innerHTML = '';
      tabs.forEach(function (tab) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'codex-tab' + (tab.key === state.activeCodexTab ? ' is-active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', tab.key === state.activeCodexTab ? 'true' : 'false');
        btn.textContent = tab.label;
        btn.addEventListener('click', function () {
          renderCodexModal(tab.key);
        });
        dom.codexTabs.appendChild(btn);
      });

      if (state.activeCodexTab === 'extra') {
        var extraHtml = '<div class="codex-extra-grid">';
        EXTRA_SCHOOLS.forEach(function (item) {
          var extraQuotesHtml = (item.classicExcerpts || [])
            .map(function (ex) {
              return (
                '<div style="margin-top:8px;padding:8px 10px;background:rgba(245,242,235,0.65);border-radius:4px;font-size:13px;">' +
                  '<div style="font-weight:600;color:var(--ink-heavy);">“' + escapeHtml(ex.text) + '” <span style="font-weight:400;color:var(--ink-light);">—— ' + escapeHtml(ex.source) + '</span></div>' +
                  '<div style="color:var(--ink-mid);margin-top:3px;">' + escapeHtml(ex.note) + '</div>' +
                '</div>'
              );
            })
            .join('');

          extraHtml +=
            '<div class="codex-extra-card">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
                '<strong style="font-size:18px;">' + escapeHtml(item.name) + ' · ' + escapeHtml(item.daoTitle) + '</strong>' +
                '<span class="seal-badge">' + escapeHtml(item.sealText) + '</span>' +
              '</div>' +
              '<div style="font-size:13px;color:var(--ink-light);margin-bottom:8px;">代表人物：' + escapeHtml(item.representatives) + '</div>' +
              '<p style="margin:0 0 8px;font-size:14.5px;color:var(--ink-mid);">' + escapeHtml(item.coreSummary) + '</p>' +
              '<div style="font-size:13.5px;padding:8px 12px;background:rgba(235,229,217,0.5);border-left:3px solid var(--seal-red);margin-bottom:8px;">' +
                '“' + escapeHtml(item.quote) + '” <span style="color:var(--ink-light);">—— ' + escapeHtml(item.quoteAuthor) + '</span>' +
              '</div>' +
              '<p style="margin:0;font-size:13.5px;color:var(--ink-heavy);"><strong>现代迷茫解药：</strong>' + escapeHtml(item.modernRemedy) + '</p>' +
              extraQuotesHtml +
            '</div>';
        });
        extraHtml += '</div>';
        dom.codexContent.innerHTML = extraHtml;
      } else {
        var s = SCHOOLS[state.activeCodexTab] || SCHOOLS.ru;
        var classicsHtml = (s.classicExcerpts || [])
          .map(function (ex) {
            return (
              '<div class="classic-item">' +
                '<div class="classic-item-head">' +
                  '<span class="classic-tag">' + escapeHtml(ex.tag) + '</span>' +
                  '<span class="classic-source">' + escapeHtml(ex.source) + '</span>' +
                '</div>' +
                '<p class="classic-text">“' + escapeHtml(ex.text) + '”</p>' +
                '<p class="classic-note">' + escapeHtml(ex.note) + '</p>' +
              '</div>'
            );
          })
          .join('');

        var booksHtml = (s.recommendedBooks || [])
          .map(function (bk) {
            return (
              '<div class="book-card">' +
                '<div class="book-title">' + escapeHtml(bk.title) + '</div>' +
                '<div class="book-chapter">优先篇目：' + escapeHtml(bk.chapter) + '</div>' +
                '<p class="book-reason">' + escapeHtml(bk.reason) + '</p>' +
              '</div>'
            );
          })
          .join('');

        dom.codexContent.innerHTML =
          '<div class="codex-detail-head">' +
            '<img class="codex-art" src="' + escapeHtml(s.image) + '" alt="' + escapeHtml(s.name) + '水墨插画">' +
            '<div>' +
              '<span class="seal-badge">' + escapeHtml(s.sealText) + '</span>' +
              '<h4 style="margin:8px 0 4px;font-size:22px;">' + escapeHtml(s.name) + ' · ' + escapeHtml(s.daoTitle) + '</h4>' +
              '<div style="font-size:13.5px;color:var(--ink-light);">代表人物：' + escapeHtml(s.representatives) + '</div>' +
            '</div>' +
          '</div>' +
          '<p style="margin:0 0 14px;color:var(--ink-mid);">' + escapeHtml(s.coreSummary) + '</p>' +
          '<blockquote class="quote-block" style="margin:0 0 16px;">' +
            '<p class="quote-text">“' + escapeHtml(s.quote) + '”</p>' +
            '<div class="quote-author">—— ' + escapeHtml(s.quoteAuthor) + '</div>' +
            '<p class="quote-modern">' + escapeHtml(s.quoteModern) + '</p>' +
          '</blockquote>' +
          '<div style="padding:14px 16px;background:rgba(255,253,248,0.8);border:1px solid var(--ink-line);border-radius:6px;margin-bottom:16px;">' +
            '<strong style="display:block;margin-bottom:6px;">古人寻道镜像：' + escapeHtml(s.ancientStoryTitle) + '</strong>' +
            '<p style="margin:0;font-size:14.5px;color:var(--ink-mid);">' + escapeHtml(s.ancientStory) + '</p>' +
          '</div>' +
          '<h5 class="subsection-title" style="margin:16px 0 10px;">经典原典精选</h5>' +
          '<div class="classics-grid" style="margin-bottom:16px;">' + classicsHtml + '</div>' +
          '<h5 class="subsection-title" style="margin:14px 0 10px;">推荐精读古籍</h5>' +
          '<div class="books-row">' + booksHtml + '</div>';
      }
    }

    function openModal(modalId) {
      var el = document.getElementById(modalId);
      if (el) {
        el.classList.add('is-open');
      }
    }

    function closeModal(modalId) {
      var el = document.getElementById(modalId);
      if (el) {
        el.classList.remove('is-open');
      }
    }

    /**
     * 开始/重开测试
     */
    function startQuizFresh() {
      state.answers = new Array(QUESTIONS.length).fill(null);
      state.currentIndex = 0;
      state.result = null;
      state.isTransitioning = false;
      renderQuestion();
      switchView('quiz');
    }

    /**
     * 复制测试结果总结文案（含优雅降级方案）
     */
    function copyResultText() {
      if (!state.result) return;
      var r = state.result;
      var s1 = SCHOOLS[r.top1.id];
      var s2 = SCHOOLS[r.top2.id];
      var insight = COMBO_INSIGHTS[r.comboKey];
      var distLine = r.ranked
        .map(function (item) {
          return SCHOOLS[item.id].name + item.percent + '%';
        })
        .join(' · ');

      var extraClassic = s1.classicExcerpts && s1.classicExcerpts[0]
        ? '典籍印证：“' + s1.classicExcerpts[0].text + '”（' + s1.classicExcerpts[0].source + '）'
        : '';

      var text = [
        '【迷茫时候看看古人是怎么找到适合自己的道的？】',
        r.isPure
          ? '我的本命道途：纯粹 · ' + s1.name + ' ' + r.top1.percent + '%'
          : '我的主辅道途：' + s1.name + ' ' + r.top1.percent + '% + ' + s2.name + ' ' + r.top2.percent + '%',
        '心性雅号：' + (insight ? insight.archetype : s1.daoTitle),
        '六家契合：' + distLine,
        '古人镜像名言：“' + s1.quote + '”——' + s1.quoteAuthor,
        extraClassic,
        s1.roadmap ? s1.roadmap.today : '今日立行：' + s1.actionNow,
        s1.roadmap ? s1.roadmap.week : ''
      ].filter(Boolean).join('\n');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(function () {
            showToast('已复制你的百家寻道结果文案');
          })
          .catch(function () {
            fallbackCopyText(text);
          });
      } else {
        fallbackCopyText(text);
      }
    }

    function fallbackCopyText(text) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('已复制你的百家寻道结果文案');
      } catch (e) {
        showToast('复制未成功，请长按截图或保存长图分享');
      }
    }

    // ==================== 事件绑定 ====================
    dom.btnStartQuiz.addEventListener('click', startQuizFresh);

    dom.btnOpenCodexHome.addEventListener('click', function () {
      renderCodexModal('ru');
      openModal('modal-codex');
    });

    dom.btnOpenCodexResult.addEventListener('click', function () {
      var defaultKey = state.result ? state.result.top1.id : 'ru';
      renderCodexModal(defaultKey);
      openModal('modal-codex');
    });

    // 首页六家印记快捷入口
    document.querySelectorAll('[data-codex-tab]').forEach(function (pill) {
      pill.addEventListener('click', function () {
        var key = pill.getAttribute('data-codex-tab') || 'ru';
        renderCodexModal(key);
        openModal('modal-codex');
      });
    });

    dom.btnHome.addEventListener('click', function () {
      switchView('home');
    });

    dom.btnPrev.addEventListener('click', function () {
      if (state.isTransitioning || state.currentIndex === 0) return;
      state.currentIndex -= 1;
      renderQuestion();
    });

    dom.btnRestart.addEventListener('click', startQuizFresh);

    dom.btnCopyResult.addEventListener('click', copyResultText);

    dom.btnGenPoster.addEventListener('click', function () {
      if (!state.result) return;
      try {
        var dataUrl = Visuals.generateSharePosterDataURL(state.result, SCHOOLS, COMBO_INSIGHTS);
        dom.posterPreviewImg.src = dataUrl;
        dom.btnDownloadPoster.href = dataUrl;
        var topName = SCHOOLS[state.result.top1.id].name;
        dom.btnDownloadPoster.setAttribute('download', '诸子百家镜像签_' + topName + state.result.top1.percent + '%.png');
        openModal('modal-poster');
      } catch (err) {
        showToast('长图绘制遇到异常，请刷新重试');
      }
    });

    // 统一关闭模态窗：关闭按钮、遮罩层点击、ESC 键
    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeModal(btn.getAttribute('data-close-modal'));
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(function (backdrop) {
      backdrop.addEventListener('click', function (ev) {
        if (ev.target === backdrop) {
          backdrop.classList.remove('is-open');
        }
      });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        closeModal('modal-codex');
        closeModal('modal-poster');
      }
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
