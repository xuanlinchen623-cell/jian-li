(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menu = $('#site-nav'), toggle = $('#menu-toggle');
  function closeMenu() { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', '打开导航'); }
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; menu.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航'); });
  $$('#site-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width:641px)').addEventListener('change', closeMenu);
  if ('IntersectionObserver' in window) {
    if (!reduceMotion) {
      document.documentElement.classList.add('js-motion');
      const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: .08 });
      $$('.reveal').forEach(el => reveal.observe(el));
    }
    const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) $$('#site-nav a').forEach(a => { const active = a.hash === '#' + entry.target.id; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }), { rootMargin: '-15% 0px -60% 0px' });
    $$('section[id]').forEach(el => navObserver.observe(el));
  }
  let scrolling = false;
  function progress() { const max = document.documentElement.scrollHeight - innerHeight; $('.reading-progress').style.width = (max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0) + '%'; scrolling = false; }
  addEventListener('scroll', () => { if (!scrolling) { scrolling = true; requestAnimationFrame(progress); } }, { passive: true });
  addEventListener('resize', progress); progress();
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    $$('.project-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; if (!card.hidden) card.classList.add('visible'); });
    requestAnimationFrame(progress);
  }));
  const methods = {
    insight: { en: 'START WITH PEOPLE', icon: '◎', title: '先找到需求，<br>再找到表达。', description: '从县城生活与真实购房场景中寻找选题，关注返乡置业、学区与刚需等具体问题，让内容建立在对本地用户的理解上。', tags: ['本地乡土人情', '真实购房痛点', '用户视角'], example: '在房地产视频号项目中，以本土购房需求作为差异化内容的切入口。' },
    create: { en: 'TURN INSIGHTS INTO STORIES', icon: '✦', title: '把一个想法，<br>变成完整内容。', description: '从选题策划到短视频文案编写、文稿核对与拍摄配合，跟进内容落地。在个人策划作品中，进一步整理封面模板、标题公式与周度排期。', tags: ['文案编写', '封面与标题', '内容排期'], example: '独立完成地产短视频文案；个人策划案沉淀36条选题与三套封面模板。' },
    collaborate: { en: 'KEEP THE SYSTEM MOVING', icon: '⊞', title: '让每个环节，<br>都能顺利向前。', description: '参与17个视频号的矩阵管理，维护官方账号与粉丝互动，配合资质对接；协同设计、市场团队协调资源，保证账号稳定更新与执行衔接。', tags: ['17个矩阵账号', '跨部门协作', '日常运营'], example: '在永盛地产实习期间支撑矩阵账号持续输出，跟进选题到发布的落地执行。' },
    review: { en: 'LEARN, REFINE, REPEAT', icon: '↻', title: '让每次发布，<br>都留下下一步。', description: '定期查看后台数据，调整选题与运营方向。在策划作品中，搭建覆盖曝光、互动率、完播率、涨粉与转化的指标体系及日、周、月复盘模板。', tags: ['核心指标', '定期复盘', '迭代验证'], example: '以“发布 → 复盘 → 优化 → 验证”形成闭环，让内容方向有据可依。' }
  };
  function activateMethod(button, moveFocus = false) {
    const data = methods[button.dataset.method];
    $$('[role="tab"]').forEach(b => { const active = b === button; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; });
    $('#method-en').textContent = data.en; $('#method-icon').textContent = data.icon;
    $('#method-title').innerHTML = data.title; $('#method-description').textContent = data.description;
    $('#method-tags').replaceChildren(...data.tags.map(text => { const span = document.createElement('span'); span.textContent = text; return span; }));
    $('#method-example').textContent = data.example;
    const panel = $('#method-panel'); panel.setAttribute('aria-labelledby', button.id);
    panel.classList.remove('switching'); void panel.offsetWidth; panel.classList.add('switching');
    if (moveFocus) button.focus();
  }
  const tabs = $$('[role="tab"]');
  tabs.forEach((button, index) => { button.addEventListener('click', () => activateMethod(button)); button.addEventListener('keydown', e => {
    let target;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') target = (index + 1) % tabs.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
    if (e.key === 'Home') target = 0; if (e.key === 'End') target = tabs.length - 1;
    if (target !== undefined) { e.preventDefault(); activateMethod(tabs[target], true); }
  }); });
  const projects = {
    estate: `<h2 id="dialog-title">县城房地产<br>多账号视频号矩阵运营</h2><p class="dialog-subtitle">项目主要负责人 · 2026.06 — 2026.10</p><p class="dialog-lead">立足本地乡土人情，在县城房地产赛道挖掘差异化内容。让线上表达回应真实的购房需求，并衔接咨询与线下看房。</p><div class="dialog-stats"><div class="dialog-stat"><strong>17 个</strong><span>参与运营的矩阵账号</span></div><div class="dialog-stat"><strong>500+</strong><span>项目吸引线下看房人数</span></div><div class="dialog-stat"><strong>上千次</strong><span>单账号日浏览量可达</span></div></div><section class="dialog-section"><h3>项目切入点</h3><p>深耕县城本地化内容，围绕返乡置业、学区与刚需等购房痛点寻找选题，以乡土人情增强内容的相关性与共鸣。</p></section><section class="dialog-section"><h3>我负责的工作</h3><ul><li><strong>内容策划与制作：</strong>独立编写短视频文案、核对文稿，完成选题策划并配合拍摄。</li><li><strong>账号运营：</strong>参与17个视频号矩阵管理，维护官方账号、处理粉丝互动与资质对接，保障稳定更新。</li><li><strong>协作推进：</strong>与设计、市场团队协调资源，跟进内容从策划到发布的执行过程。</li><li><strong>数据复盘：</strong>定期查看后台表现，调整内容方向，优化流量与获客能力。</li></ul></section><section class="dialog-section"><h3>实践收获</h3><p>跑通选题、出稿、发布、互动与复盘的完整链路，将本地用户需求转化为可执行的内容方向，并理解多账号协作对稳定交付的要求。</p></section><p class="dialog-note">成果及职责据个人简历整理。500+指项目吸引的线下看房人数。页面封面为内容视觉概念。</p>`,
    plan: `<h2 id="dialog-title">新媒体账号运营策划案</h2><p class="dialog-subtitle">个人作品集 · 独立策划 · 2026.10</p><p class="dialog-lead">围绕生活记录赛道，从账号定位、竞品拆解到内容排期与数据复盘，搭建一套从0到1的内容运营框架。</p><div class="dialog-stats"><div class="dialog-stat"><strong>36 条</strong><span>可复用选题</span></div><div class="dialog-stat"><strong>3 套</strong><span>封面模板</span></div><div class="dialog-stat"><strong>3 平台</strong><span>差异化策略规划</span></div></div><section class="dialog-section"><h3>从竞品分析中提炼方法</h3><p>拆解房琪kiki、papi酱、李子柒等账号，从选题方向、封面风格、标题结构与互动话术四个维度梳理规律，提炼五大可复用打法。</p></section><section class="dialog-section"><h3>建立持续创作的内容系统</h3><ul><li><strong>选题库：</strong>围绕成长干货、生活记录、情感共鸣与互动栏目四大板块，沉淀36条可复用选题。</li><li><strong>账号定位：</strong>明确人设与内容板块，为小红书、抖音与视频号规划差异化策略。</li><li><strong>制作与排期：</strong>设计三套封面模板，整理标题公式与周度排期表。</li><li><strong>复盘框架：</strong>覆盖曝光、互动率、完播率、涨粉与转化，配套日、周、月复盘模板。</li></ul></section><section class="dialog-section"><h3>让框架形成闭环</h3><p>从“发布 → 复盘 → 优化 → 验证”建立迭代机制。策划的重点是把零散创意变成可以持续执行、反复调整的工作流程。</p></section><p class="dialog-note">本页为简历所述策划成果的结构化介绍。页面封面为视觉概念；未展示原始选题文档或账号后台。</p>`
  };
  const dialog = $('#project-dialog'); let opener = null, oldOverflow = '';
  $$('.project-open').forEach(button => button.addEventListener('click', () => {
    opener = button; $('#dialog-content').innerHTML = projects[button.dataset.project];
    oldOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    dialog.showModal(); dialog.scrollTop = 0; $('.dialog-close').focus({ preventScroll: true });
  }));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = oldOverflow; if (opener) opener.focus({ preventScroll: true }); });
  let toastTimer;
  function toast(message) { clearTimeout(toastTimer); const node = $('#toast'); node.textContent = message; node.classList.add('visible'); toastTimer = setTimeout(() => node.classList.remove('visible'), 3500); }
  $('#copy-email').addEventListener('click', async () => {
    const email = 'xuanlinchen623@gmail.com';
    try {
      let copied = false;
      if (navigator.clipboard && window.isSecureContext) { try { await navigator.clipboard.writeText(email); copied = true; } catch (_) {} }
      if (!copied) { const input = document.createElement('textarea'); input.value = email; input.setAttribute('readonly', ''); input.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.append(input); input.select(); try { copied = document.execCommand('copy'); } finally { input.remove(); $('#copy-email').focus({ preventScroll: true }); } }
      if (!copied) throw new Error('Clipboard unavailable');
      toast('邮箱已复制，期待与你交流。');
    } catch (_) { toast('请长按或选中页面邮箱进行复制。'); }
  });
  $('#year').textContent = String(new Date().getFullYear());
})();
