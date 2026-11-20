/**
 * 诸子百家心理镜像测试 — 视觉渲染引擎
 * 包含：
 * 1. renderInkRadarSVG: 生成黑白水墨六维道盘 SVG 雷达图
 * 2. generateSharePosterDataURL: 纯 Canvas 程序化绘制 1080x1920 竖版水墨签文长图（无外部跨域图片，兼容 file:// 双击运行）
 */
(function (root) {
  'use strict';

  var DaoTest = (root.DaoTest = root.DaoTest || {});

  var FONT_SERIF = '"Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "SimSun", serif';
  var FONT_CALLIGRAPHY = '"Ma Shan Zheng", "Kaiti SC", "STKaiti", "KaiTi", "Noto Serif SC", serif';

  /**
   * 渲染六维水墨道盘 SVG 雷达图
   * @param {HTMLElement} containerEl - 容器 DOM 元素
   * @param {Object} result - calculateResult 返回的结果对象
   * @param {Object} schoolsMap - SCHOOLS 字典
   * @param {Array<string>} schoolOrder - 6 家顺时针顺序
   */
  function renderInkRadarSVG(containerEl, result, schoolsMap, schoolOrder) {
    if (!containerEl || !result || !schoolsMap) return;

    var order = Array.isArray(schoolOrder) && schoolOrder.length === 6
      ? schoolOrder
      : ['ru', 'dao', 'fa', 'mo', 'bing', 'zong'];

    var cx = 190;
    var cy = 190;
    var maxR = 112;
    var top1Id = result.top1.id;
    var top2Id = result.top2.id;
    var scaleMax = Math.max(45, result.top1.percent + 5);

    // 计算第 i 个顶点（从正上方 -90 度起顺时针）坐标
    function getPoint(index, radius) {
      var angle = -Math.PI / 2 + (index * Math.PI * 2) / 6;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        angle: angle
      };
    }

    var svgParts = [];
    svgParts.push(
      '<svg class="ink-radar-svg" viewBox="0 0 380 380" role="img" aria-label="诸子百家六维契合度水墨雷达图" xmlns="http://www.w3.org/2000/svg">'
    );
    svgParts.push(
      '<defs>' +
        '<filter id="radar-ink-filter" x="-12%" y="-12%" width="124%" height="124%">' +
          '<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="9" result="noise"/>' +
          '<feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>' +
        '</filter>' +
        '<radialGradient id="radar-poly-fill" cx="50%" cy="50%" r="55%">' +
          '<stop offset="0%" stop-color="#1a1a1a" stop-opacity="0.08"/>' +
          '<stop offset="100%" stop-color="#1a1a1a" stop-opacity="0.22"/>' +
        '</radialGradient>' +
      '</defs>'
    );

    // 绘制 3 层同心六边形参考网格
    var levels = [0.33, 0.67, 1.0];
    levels.forEach(function (ratio, idx) {
      var pts = [];
      for (var i = 0; i < 6; i++) {
        var p = getPoint(i, maxR * ratio);
        pts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1));
      }
      var isOuter = idx === levels.length - 1;
      svgParts.push(
        '<polygon points="' + pts.join(' ') + '" ' +
          'fill="none" ' +
          'stroke="' + (isOuter ? '#b8b1a3' : '#d5cfc4') + '" ' +
          'stroke-width="' + (isOuter ? '1.3' : '1') + '" ' +
          (isOuter ? '' : 'stroke-dasharray="4 3" ') +
        '/>'
      );
    });

    // 绘制中心到六顶点的淡墨经线
    for (var i = 0; i < 6; i++) {
      var endP = getPoint(i, maxR);
      svgParts.push(
        '<line x1="' + cx + '" y1="' + cy + '" x2="' + endP.x.toFixed(1) + '" y2="' + endP.y.toFixed(1) + '" ' +
          'stroke="#cfc8ba" stroke-width="1"/>'
      );
    }

    // 中心微小太极圆心点
    svgParts.push('<circle cx="' + cx + '" cy="' + cy + '" r="2.2" fill="#8b8478"/>');

    // 计算用户数据多边形各顶点
    var dataPoints = order.map(function (id, idx) {
      var stat = result.byId[id];
      var pct = stat ? stat.percent : 0;
      var ratio = pct / scaleMax;
      var pt = getPoint(idx, maxR * ratio);
      return {
        id: id,
        pct: pct,
        x: pt.x,
        y: pt.y
      };
    });

    var polyStr = dataPoints
      .map(function (pt) {
        return pt.x.toFixed(1) + ',' + pt.y.toFixed(1);
      })
      .join(' ');

    // 数据多边形（带轻微水墨边缘滤镜）
    svgParts.push(
      '<polygon points="' + polyStr + '" ' +
        'fill="url(#radar-poly-fill)" ' +
        'stroke="#1a1a1a" stroke-width="2.2" stroke-linejoin="round" ' +
        'filter="url(#radar-ink-filter)"/>'
    );

    // 各顶点高亮点与流派名称+百分比标注
    dataPoints.forEach(function (pt, idx) {
      var isTop = pt.id === top1Id || pt.id === top2Id;
      var isPrimary = pt.id === top1Id;
      var dotColor = isTop ? '#a62c2b' : '#2a2a2a';

      if (isTop) {
        svgParts.push(
          '<circle cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="' + (isPrimary ? '7.5' : '6') + '" fill="#a62c2b" fill-opacity="0.16"/>'
        );
      }
      svgParts.push(
        '<circle cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="' + (isPrimary ? '4.2' : isTop ? '3.5' : '2.8') + '" fill="' + dotColor + '" stroke="#f5f2eb" stroke-width="1"/>'
      );

      // 计算标签位置与对齐
      var labelPos = getPoint(idx, maxR + 24);
      var anchor = 'middle';
      var dyName = 0;
      if (idx === 0) {
        anchor = 'middle';
        dyName = -8;
      } else if (idx === 3) {
        anchor = 'middle';
        dyName = 10;
      } else if (idx === 1 || idx === 2) {
        anchor = 'start';
        labelPos.x -= 4;
      } else {
        anchor = 'end';
        labelPos.x += 4;
      }

      var school = schoolsMap[pt.id];
      var nameColor = isTop ? '#1a1a1a' : '#4a4742';
      var pctColor = isTop ? '#a62c2b' : '#6b6862';

      svgParts.push(
        '<text x="' + labelPos.x.toFixed(1) + '" y="' + (labelPos.y + dyName).toFixed(1) + '" ' +
          'text-anchor="' + anchor + '" ' +
          'font-family=\'' + FONT_SERIF + '\' ' +
          'font-size="' + (isPrimary ? '14' : '13') + '" ' +
          'font-weight="' + (isTop ? '700' : '500') + '" ' +
          'fill="' + nameColor + '">' +
          escapeXml(school.name) +
        '</text>'
      );
      svgParts.push(
        '<text x="' + labelPos.x.toFixed(1) + '" y="' + (labelPos.y + dyName + 16).toFixed(1) + '" ' +
          'text-anchor="' + anchor + '" ' +
          'font-family=\'' + FONT_SERIF + '\' ' +
          'font-size="12" ' +
          'font-weight="' + (isTop ? '700' : '500') + '" ' +
          'fill="' + pctColor + '">' +
          pt.pct + '%' +
        '</text>'
      );
    });

    svgParts.push('</svg>');
    containerEl.innerHTML = svgParts.join('');
  }

  function escapeXml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Canvas 文本自动换行工具（处理中文标点行首避头规则）
   */
  function wrapCanvasText(ctx, text, maxWidth) {
    var chars = Array.from(String(text || ''));
    var lines = [];
    var current = '';
    var noStartPunctuation = '，。、；：！？）》」』”’,.!?;:)';

    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      if (ch === '\n') {
        lines.push(current);
        current = '';
        continue;
      }
      var testLine = current + ch;
      if (ctx.measureText(testLine).width > maxWidth && current.length > 0) {
        if (noStartPunctuation.indexOf(ch) !== -1) {
          lines.push(current + ch);
          current = '';
        } else {
          lines.push(current);
          current = ch;
        }
      } else {
        current = testLine;
      }
    }
    if (current) {
      lines.push(current);
    }
    return lines;
  }

  /**
   * 在 Canvas 上绘制程序化水墨远山与宣纸纹理
   */
  function drawInkBackdrop(ctx, w, h) {
    // 宣纸暖底
    ctx.fillStyle = '#f5f2eb';
    ctx.fillRect(0, 0, w, h);

    // 微妙径向宣纸光照晕影
    var paperGrad = ctx.createRadialGradient(w * 0.5, h * 0.35, 100, w * 0.5, h * 0.5, w * 1.15);
    paperGrad.addColorStop(0, 'rgba(255, 253, 248, 0.45)');
    paperGrad.addColorStop(1, 'rgba(228, 220, 205, 0.35)');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, w, h);

    // 轻量宣纸纤维微纹
    ctx.save();
    ctx.strokeStyle = 'rgba(130, 120, 105, 0.045)';
    ctx.lineWidth = 1;
    for (var i = 0; i < 240; i++) {
      var rx = ((i * 197 + 31) % w);
      var ry = ((i * 313 + 73) % h);
      var len = 8 + (i % 18);
      var ang = ((i * 53) % 360) * (Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + Math.cos(ang) * len, ry + Math.sin(ang) * len);
      ctx.stroke();
    }
    ctx.restore();

    // 顶部极淡远山烟岚剪影
    ctx.save();
    var topMountGrad = ctx.createLinearGradient(0, 0, 0, 310);
    topMountGrad.addColorStop(0, 'rgba(34, 34, 34, 0.11)');
    topMountGrad.addColorStop(1, 'rgba(34, 34, 34, 0)');
    ctx.fillStyle = topMountGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, 220);
    ctx.bezierCurveTo(w * 0.78, 175, w * 0.62, 235, w * 0.46, 195);
    ctx.bezierCurveTo(w * 0.31, 160, w * 0.14, 210, 0, 170);
    ctx.closePath();
    ctx.fill();

    // 底部多层水墨远山与孤舟点缀
    var botGrad1 = ctx.createLinearGradient(0, h - 420, 0, h);
    botGrad1.addColorStop(0, 'rgba(38, 38, 38, 0.04)');
    botGrad1.addColorStop(0.55, 'rgba(30, 30, 30, 0.11)');
    botGrad1.addColorStop(1, 'rgba(26, 26, 26, 0.17)');
    ctx.fillStyle = botGrad1;
    ctx.beginPath();
    ctx.moveTo(0, h - 255);
    ctx.bezierCurveTo(180, h - 350, 320, h - 245, 510, h - 305);
    ctx.bezierCurveTo(690, h - 360, 860, h - 240, w, h - 295);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    var botGrad2 = ctx.createLinearGradient(0, h - 270, 0, h);
    botGrad2.addColorStop(0, 'rgba(24, 24, 24, 0.16)');
    botGrad2.addColorStop(1, 'rgba(24, 24, 24, 0.03)');
    ctx.fillStyle = botGrad2;
    ctx.beginPath();
    ctx.moveTo(0, h - 160);
    ctx.bezierCurveTo(220, h - 235, 410, h - 140, 620, h - 190);
    ctx.bezierCurveTo(810, h - 235, 950, h - 155, w, h - 185);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // 水面一叶小舟剪影
    ctx.fillStyle = 'rgba(26, 26, 26, 0.55)';
    ctx.beginPath();
    ctx.moveTo(760, h - 118);
    ctx.quadraticCurveTo(815, h - 104, 872, h - 118);
    ctx.quadraticCurveTo(816, h - 110, 760, h - 118);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(822, h - 121, 13, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.35)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(735, h - 104);
    ctx.lineTo(895, h - 104);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * 绘制古典双线边框与四角回纹
   */
  function drawClassicalBorder(ctx, w, h) {
    var m1 = 44;
    var m2 = 56;
    ctx.save();
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.72)';
    ctx.lineWidth = 2;
    ctx.strokeRect(m1, m1, w - m1 * 2, h - m1 * 2);

    ctx.strokeStyle = 'rgba(130, 122, 108, 0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(m2, m2, w - m2 * 2, h - m2 * 2);

    // 四角小方印折角装饰
    var cSize = 18;
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2.4;
    var corners = [
      [m1, m1, 1, 1],
      [w - m1, m1, -1, 1],
      [m1, h - m1, 1, -1],
      [w - m1, h - m1, -1, -1]
    ];
    corners.forEach(function (c) {
      ctx.beginPath();
      ctx.moveTo(c[0], c[1] + c[3] * cSize);
      ctx.lineTo(c[0], c[1]);
      ctx.lineTo(c[0] + c[2] * cSize, c[1]);
      ctx.stroke();
    });
    ctx.restore();
  }

  /**
   * 绘制朱砂红四字篆体印章
   */
  function drawSealStamp(ctx, x, y, size, sealText) {
    ctx.save();
    ctx.fillStyle = '#a62c2b';
    // 印泥微圆角方块
    var r = 6;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + size - r, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + r);
    ctx.lineTo(x + size, y + size - r);
    ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
    ctx.lineTo(x + r, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    // 内细白框
    ctx.strokeStyle = 'rgba(245, 242, 235, 0.72)';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x + 5, y + 5, size - 10, size - 10);

    var chars = Array.from(String(sealText || '寻道')).slice(0, 4);
    ctx.fillStyle = '#f5f2eb';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 ' + Math.round(size * 0.34) + 'px ' + FONT_CALLIGRAPHY;

    // 传统印章两列竖排（右列先读，左列后读）
    if (chars.length === 4) {
      ctx.fillText(chars[0], x + size * 0.68, y + size * 0.31);
      ctx.fillText(chars[1], x + size * 0.68, y + size * 0.69);
      ctx.fillText(chars[2], x + size * 0.32, y + size * 0.31);
      ctx.fillText(chars[3], x + size * 0.32, y + size * 0.69);
    } else {
      ctx.fillText(chars.join(''), x + size / 2, y + size / 2);
    }
    ctx.restore();
  }

  /**
   * 绘制圆角矩形路径
   */
  function fillRoundRect(ctx, x, y, w, h, r) {
    var radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * 生成 1080x1920 竖版黑白水墨签文长图 DataURL
   * @param {Object} result - 计分结果
   * @param {Object} schoolsMap - SCHOOLS 字典
   * @param {Object} comboInsights - COMBO_INSIGHTS 字典
   * @returns {string} image/png base64 DataURL
   */
  function generateSharePosterDataURL(result, schoolsMap, comboInsights) {
    var W = 1080;
    var H = 1920;
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');

    var top1School = schoolsMap[result.top1.id];
    var top2School = schoolsMap[result.top2.id];
    var insight = comboInsights[result.comboKey] || {
      archetype: top1School.daoTitle,
      verdict: top1School.coreSummary,
      balanceAdvice: top1School.actionNow
    };

    // 1. 底纸与水墨山水渲染
    drawInkBackdrop(ctx, W, H);
    drawClassicalBorder(ctx, W, H);

    var contentLeft = 106;
    var contentWidth = W - contentLeft * 2;
    var y = 128;

    // 2. 顶部雅签与主标题
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6b6862';
    ctx.font = '500 24px ' + FONT_SERIF;
    ctx.fillText('诸 子 百 家 心 性 镜 像 签', W / 2, y);

    y += 28;
    ctx.strokeStyle = 'rgba(166, 44, 43, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 44, y);
    ctx.lineTo(W / 2 + 44, y);
    ctx.stroke();

    y += 58;
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '700 42px ' + FONT_SERIF;
    ctx.fillText('迷茫时，问道于古人。', W / 2, y);
    y += 58;
    ctx.font = '400 24px ' + FONT_SERIF;
    ctx.fillText(result.mode === 'full' ? '三十问 · 情境与自省' : '十八问 · 日常情境', W / 2, y);

    // 3. 中央主卡片框
    y += 48;
    var cardY = y;
    var cardH = 448;
    ctx.save();
    ctx.fillStyle = 'rgba(253, 251, 246, 0.82)';
    fillRoundRect(ctx, contentLeft, cardY, contentWidth, cardH, 8);
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.24)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // 右上角朱砂红篆印章
    drawSealStamp(ctx, contentLeft + contentWidth - 134, cardY + 34, 96, top1School.sealText);

    // 主卡片文字区（左对齐，给右侧印章留白）
    var innerX = contentLeft + 44;
    var innerY = cardY + 58;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a62c2b';
    ctx.font = '600 24px ' + FONT_SERIF;
    ctx.fillText(result.isPure ? '这次选择最集中的一家' : '这次选择居前的两家', innerX, innerY);

    innerY += 64;
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '700 50px ' + FONT_SERIF;
    var headlineText = result.isPure
      ? top1School.name + ' ' + result.top1.percent + '%'
      : top1School.name + ' ' + result.top1.percent + '% · ' + top2School.name + ' ' + result.top2.percent + '%';
    ctx.fillText(headlineText, innerX, innerY, contentWidth - 194);

    // 雅号标签
    innerY += 46;
    ctx.font = '600 28px ' + FONT_SERIF;
    var badgeText = insight.archetype;
    var badgeW = ctx.measureText(badgeText).width + 40;
    ctx.fillStyle = 'rgba(26, 26, 26, 0.08)';
    fillRoundRect(ctx, innerX, innerY - 30, badgeW, 44, 4);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(badgeText, innerX + 20, innerY + 2);

    // 判词段落
    innerY += 56;
    ctx.fillStyle = '#33312e';
    ctx.font = '400 26px ' + FONT_SERIF;
    var verdictLines = wrapCanvasText(ctx, insight.verdict, contentWidth - 88);
    verdictLines.slice(0, 5).forEach(function (line, idx) {
      ctx.fillText(line, innerX, innerY + idx * 42);
    });

    var adviceY = innerY + verdictLines.length * 42 + 24;
    ctx.fillStyle = '#655f54';
    ctx.font = '400 23px ' + FONT_SERIF;
    wrapCanvasText(ctx, '试一试 · ' + insight.balanceAdvice, contentWidth - 88).slice(0, 2).forEach(function (line, idx) {
      ctx.fillText(line, innerX, adviceY + idx * 34);
    });

    // 4. 六家百分比水墨分布条形图
    y = cardY + cardH + 58;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '700 28px ' + FONT_SERIF;
    ctx.fillText('诸子百家六维契合度', contentLeft, y);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#757168';
    ctx.font = '400 22px ' + FONT_SERIF;
    ctx.fillText('六家占比总计 100%', contentLeft + contentWidth, y);

    y += 38;
    var barStartX = contentLeft + 128;
    var barMaxW = contentWidth - 220;

    result.ranked.forEach(function (item, idx) {
      var s = schoolsMap[item.id];
      var rowY = y + idx * 58;
      var isTop2 = idx < 2;

      // 流派名称
      ctx.textAlign = 'left';
      ctx.fillStyle = isTop2 ? '#1a1a1a' : '#57534c';
      ctx.font = (isTop2 ? '700' : '500') + ' 26px ' + FONT_SERIF;
      ctx.fillText(s.name, contentLeft, rowY + 8);

      // 背景底槽
      ctx.fillStyle = 'rgba(26, 26, 26, 0.09)';
      fillRoundRect(ctx, barStartX, rowY - 10, barMaxW, 20, 10);

      // 水墨墨迹进度条
      var ratio = item.percent / 100;
      var fillW = Math.round(barMaxW * Math.min(1, ratio));
      var barGrad = ctx.createLinearGradient(barStartX, 0, barStartX + fillW, 0);
      if (idx === 0) {
        barGrad.addColorStop(0, '#161616');
        barGrad.addColorStop(0.85, '#2b2b2b');
        barGrad.addColorStop(1, '#a62c2b');
      } else if (idx === 1) {
        barGrad.addColorStop(0, '#303030');
        barGrad.addColorStop(1, '#58544d');
      } else {
        barGrad.addColorStop(0, '#78746b');
        barGrad.addColorStop(1, '#9c968a');
      }
      ctx.fillStyle = barGrad;
      if (fillW > 0) fillRoundRect(ctx, barStartX, rowY - 10, fillW, 20, 10);

      // 右侧百分比数值
      ctx.textAlign = 'right';
      ctx.fillStyle = isTop2 ? '#a62c2b' : '#57534c';
      ctx.font = (isTop2 ? '700' : '500') + ' 26px ' + FONT_SERIF;
      ctx.fillText(item.percent + '%', contentLeft + contentWidth, rowY + 8);
    });

    // 5. 典籍名言与今日破局指引
    y += result.ranked.length * 58 + 26;
    var quoteBoxH = 216;
    ctx.save();
    ctx.fillStyle = 'rgba(240, 235, 224, 0.72)';
    fillRoundRect(ctx, contentLeft, y, contentWidth, quoteBoxH, 8);
    // 左侧朱砂竖杠
    ctx.fillStyle = '#a62c2b';
    ctx.fillRect(contentLeft, y + 18, 6, quoteBoxH - 36);
    ctx.restore();

    var qX = contentLeft + 34;
    var qY = y + 48;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '600 26px ' + FONT_SERIF;
    var reading = top1School.reading;
    var qLines = wrapCanvasText(ctx, '“' + reading.quote + '”', contentWidth - 64);
    qLines.slice(0, 2).forEach(function (line, i) {
      ctx.fillText(line, qX, qY + i * 38);
    });

    qY += Math.min(2, qLines.length) * 38 + 6;
    ctx.fillStyle = '#6b6862';
    ctx.font = '400 21px ' + FONT_SERIF;
    ctx.fillText('—— ' + reading.source, qX, qY);

    qY += 38;
    ctx.fillStyle = '#383632';
    ctx.font = '400 22px ' + FONT_SERIF;
    var modLines = wrapCanvasText(ctx, reading.gloss, contentWidth - 64);
    modLines.slice(0, 2).forEach(function (line, i) {
      ctx.fillText(line, qX, qY + i * 33);
    });

    // 今日破局指引框
    y += quoteBoxH + 24;
    var guideBoxH = 226;
    ctx.save();
    ctx.fillStyle = 'rgba(253, 251, 246, 0.85)';
    fillRoundRect(ctx, contentLeft, y, contentWidth, guideBoxH, 8);
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.16)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(contentLeft, y + 18, 6, guideBoxH - 36);
    ctx.restore();

    var gX = contentLeft + 34;
    var gY = y + 44;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a62c2b';
    ctx.font = '700 22px ' + FONT_SERIF;
    ctx.fillText('今天试一件小事', gX, gY);

    gY += 38;
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '400 22px ' + FONT_SERIF;
    var todayText = top1School.actionNow;
    var todayLines = wrapCanvasText(ctx, todayText, contentWidth - 64);
    todayLines.slice(0, 2).forEach(function (line, i) {
      ctx.fillText(line, gX, gY + i * 33);
    });

    gY += Math.min(2, todayLines.length) * 33 + 10;
    var checkItem = top1School.decisionChecklist && top1School.decisionChecklist[0]
      ? '决策自问：' + top1School.decisionChecklist[0]
      : '';
    if (checkItem) {
      ctx.fillStyle = '#4e4b45';
      ctx.font = '400 21px ' + FONT_SERIF;
      var checkLines = wrapCanvasText(ctx, checkItem, contentWidth - 64);
      checkLines.slice(0, 2).forEach(function (line, i) {
        ctx.fillText(line, gX, gY + i * 31);
      });
    }

    // 6. 底部结语落款
    var now = new Date();
    var dateStr = now.getFullYear() + '.' + String(now.getMonth() + 1).padStart(2, '0') + '.' + String(now.getDate()).padStart(2, '0');
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4e4b45';
    ctx.font = '500 24px ' + FONT_SERIF;
    ctx.fillText('愿你在千载墨香中，照见自己的破局之道', W / 2, H - 122);

    ctx.fillStyle = '#8b8579';
    ctx.font = '400 20px ' + FONT_SERIF;
    ctx.fillText('诸子百家心性镜像测试 · ' + dateStr, W / 2, H - 84);

    return canvas.toDataURL('image/png');
  }

  DaoTest.Visuals = {
    renderInkRadarSVG: renderInkRadarSVG,
    generateSharePosterDataURL: generateSharePosterDataURL
  };
})(typeof window !== 'undefined' ? window : globalThis);
