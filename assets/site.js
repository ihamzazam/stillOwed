(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };

  var LABELS = ['will-pay', 'dispute', 'hardship', 'wants-plan', 'hostile'];
  var LABELS_EVT = ['bounce', 'auto-reply', 'out-of-office', 'will-pay', 'hostile'];

  var CASES = [
    {
      invoice: 'INV-2041', target: '$4,800',
      events: [
        { id: 'open', t: 300, day: 0, ts: 'DAY 0 · 09:14', type: 'info', log: 'Case opened: INV-2041 received from BrightSpark Marketing.' },
        { id: 'parse1', t: 1500, day: 0 },
        { id: 'parse2', t: 2000, day: 0 },
        { id: 'parse3', t: 2500, day: 0 },
        { id: 'parse4', t: 3000, day: 0, ts: 'DAY 0 · 09:14', type: 'action', log: 'Parsed invoice: $4,800 · Gulf Coast HVAC LLC · due Mar 30 · 73 days overdue.' },
        { id: 'check1', t: 4200, day: 0, ts: 'DAY 0 · 09:15', type: 'action', log: 'Intake: debtor verified as a business, a 40-person HVAC contractor. B2B only; consumers are out of scope.' },
        { id: 'check2', t: 5200, day: 0, ts: 'DAY 0 · 09:15', type: 'action', log: 'Intake: invoice age 73 days, inside the 60–180 day window.' },
        { id: 'check3', t: 6200, day: 0, ts: 'DAY 0 · 09:15', type: 'action', log: 'Intake: no active dispute on record. Case accepted.' },
        { id: 'plan', t: 7600, day: 0, ts: 'DAY 0 · 09:16', type: 'info', log: 'Outreach planned: Day 1 email → Day 4 email → Day 8 SMS. Sender: Sarah Chen (the client’s own name). Tone: friendly, zero pressure.' },
        { id: 'email1', t: 9200, day: 1, ts: 'DAY 1 · 10:02', type: 'action', log: 'Email 1 sent in the client’s name. Friendly check-in, no pressure language.' },
        { id: 'email2', t: 15200, day: 4, ts: 'DAY 4 · 09:40', type: 'action', log: 'No reply for 72h. Email 2 sent with the invoice PDF attached; offered to redirect to whoever handles AP.' },
        { id: 'sms', t: 20800, day: 8, ts: 'DAY 8 · 14:05', type: 'action', log: 'Emails unanswered. One short, courteous SMS sent. Frequency cap active: no further contact before Day 11.' },
        { id: 'reply', t: 25800, day: 11, ts: 'DAY 11 · 11:21', type: 'inbound', log: 'Inbound reply from Dana Whitfield (Controller, Gulf Coast HVAC). All outreach paused while the reply is processed.' },
        { id: 'classifyStart', t: 28600, day: 11, cyc: 'start' },
        { id: 'classifyDone', t: 31200, day: 11, cyc: 'stop', ts: 'DAY 11 · 11:21', type: 'action', log: 'Reply classified wants-plan (0.96). Not a dispute, so negotiation may continue.' },
        { id: 'auth1', t: 32600, day: 11 },
        { id: 'auth2', t: 33800, day: 11 },
        { id: 'authVerdict', t: 35000, day: 11, ts: 'DAY 11 · 11:22', type: 'action', log: 'Proposal: 50% now, 50% in 30 days. Plan length ≤ 3-month limit ✓ · discount 0% ≤ 10% limit ✓. Within authority, accepting without human review.' },
        { id: 'draft', t: 36800, day: 11, ts: 'DAY 11 · 11:22', type: 'action', log: 'Acceptance drafted in the client’s voice. Dates and amounts confirmed in writing.' },
        { id: 'pay1', t: 42000, day: 12, payTo: 2400, ts: 'DAY 12 · 16:48', type: 'money', log: 'Payment 1 of 2: $2,400 deposited to BrightSpark’s account. Platform received a webhook confirmation, never the funds.' },
        { id: 'pay2', t: 47200, day: 42, payTo: 4800, ts: 'DAY 42 · 10:15', type: 'money', log: 'Payment 2 of 2: $2,400 received on schedule. INV-2041 recovered in full.' },
        { id: 'split', t: 50600, day: 42, ts: 'DAY 42 · 10:15', type: 'money', log: 'Case closed. Recovered $4,800 · client keeps $3,840 · fee $960 (20%).' },
        { id: 'closing', t: 54000, day: 42, end: true, ts: 'DAY 42 · 10:16', type: 'info', log: 'INV-2041: written off → paid in full, 42 days after handover.' }
      ],
      pills: [
        { el: 'pills-a', start: 'classifyStart', done: 'classifyDone', labels: LABELS, final: 'wants-plan', conf: 96 }
      ]
    },
    {
      invoice: 'INV-0388', target: '$12,500',
      events: [
        { id: 'open', t: 300, day: 0, ts: 'DAY 0 · 08:50', type: 'info', log: 'Case opened: INV-0388 received from Meridian Staffing Group.' },
        { id: 'parse1', t: 1400, day: 0 },
        { id: 'parse2', t: 1900, day: 0 },
        { id: 'parse3', t: 2400, day: 0 },
        { id: 'parse4', t: 2900, day: 0, ts: 'DAY 0 · 08:50', type: 'action', log: 'Parsed invoice: $12,500 · Harbor Point Logistics · due Mar 9 · 94 days overdue.' },
        { id: 'check1', t: 3900, day: 0, ts: 'DAY 0 · 08:51', type: 'action', log: 'Intake: debtor verified as a business, a 120-person logistics company.' },
        { id: 'check2', t: 4700, day: 0, ts: 'DAY 0 · 08:51', type: 'action', log: 'Intake: invoice age 94 days, inside the 60–180 day window.' },
        { id: 'check3', t: 5500, day: 0, ts: 'DAY 0 · 08:51', type: 'action', log: 'Intake: no active dispute on record. Case accepted.' },
        { id: 'priority', t: 6700, day: 0, ts: 'DAY 0 · 08:52', type: 'highlight', log: 'High value: $12,500. Priority sequencing.' },
        { id: 'email1', t: 8400, day: 1, ts: 'DAY 1 · 09:31', type: 'action', log: 'Email 1 sent in the client’s name to the original contact (Mark, hiring manager).' },
        { id: 'bounce', t: 11800, day: 1, ts: 'DAY 1 · 09:31', type: 'inbound', log: 'Delivery failure received: 550, mailbox unavailable.' },
        { id: 'cls1Start', t: 13200, day: 1, cyc: 'start' },
        { id: 'cls1Done', t: 15000, day: 1, cyc: 'stop', ts: 'DAY 1 · 09:32', type: 'action', log: 'Event classified bounce (0.99). Contact invalid; locating accounts payable.' },
        { id: 'reroute', t: 17200, day: 2, ts: 'DAY 2 · 10:15', type: 'action', log: 'One short, polite note sent to the company’s general AP address. No pressure, just a routing question.' },
        { id: 'apReply', t: 20200, day: 2, ts: 'DAY 2 · 13:02', type: 'inbound', log: 'Front office replied; rerouted to Dana in AP.' },
        { id: 'reply', t: 23400, day: 5, ts: 'DAY 5 · 15:48', type: 'inbound', log: 'Inbound reply from Dana Ferreira (AP). The invoice was never entered after the original contact left. Processing promised by Friday.' },
        { id: 'cls2Start', t: 25600, day: 5, cyc: 'start' },
        { id: 'cls2Done', t: 27400, day: 5, cyc: 'stop', ts: 'DAY 5 · 15:49', type: 'action', log: 'Reply classified will-pay (0.97). Nothing to negotiate.' },
        { id: 'restraint', t: 29400, day: 5, ts: 'DAY 5 · 15:49', type: 'highlight', log: 'No action needed. Courtesy confirmation scheduled Day 9. All further reminders suppressed.' },
        { id: 'pay', t: 33400, day: 9, payTo: 12500, ts: 'DAY 9 · 11:27', type: 'money', log: 'Payment: $12,500 deposited to Meridian’s account. Platform received a webhook confirmation, never the funds.' },
        { id: 'split', t: 36800, day: 9, ts: 'DAY 9 · 11:28', type: 'money', log: 'Case closed. Recovered $12,500 · client keeps $10,000 · fee $2,500 (20%).' },
        { id: 'epilogue', t: 39400, day: 9, ts: 'DAY 9 · 11:30', type: 'info', log: 'Meridian adds Standing Watch: every future invoice monitored from day 1 · $99/mo.' },
        { id: 'lesson', t: 41800, day: 9, end: true, ts: 'DAY 9', type: 'info', log: 'INV-0388: it wasn’t refused. It was lost. The agent’s only superpower is that it never forgets.' }
      ],
      pills: [
        { el: 'pills-b1', start: 'cls1Start', done: 'cls1Done', labels: LABELS_EVT, final: 'bounce', conf: 99 },
        { el: 'pills-b2', start: 'cls2Start', done: 'cls2Done', labels: LABELS, final: 'will-pay', conf: 97 }
      ]
    },
    {
      invoice: 'INV-1126', target: '$4,600',
      events: [
        { id: 'open', t: 300, day: 0, ts: 'DAY 0 · 10:05', type: 'info', log: 'Case opened: INV-1126 received from Cobalt IT Services.' },
        { id: 'parse1', t: 1400, day: 0 },
        { id: 'parse2', t: 1900, day: 0 },
        { id: 'parse3', t: 2400, day: 0 },
        { id: 'parse4', t: 2900, day: 0, ts: 'DAY 0 · 10:05', type: 'action', log: 'Parsed invoice: $5,200 · Pinecrest Insurance Brokers · due Apr 11 · 61 days overdue.' },
        { id: 'check1', t: 3900, day: 0, ts: 'DAY 0 · 10:06', type: 'action', log: 'Intake: debtor verified as a business, a 30-person insurance brokerage.' },
        { id: 'check2', t: 4700, day: 0, ts: 'DAY 0 · 10:06', type: 'action', log: 'Intake: invoice age 61 days, inside the 60–180 day window.' },
        { id: 'check3', t: 5500, day: 0, ts: 'DAY 0 · 10:06', type: 'action', log: 'Intake: no active dispute on record. Case accepted.' },
        { id: 'email1', t: 7600, day: 1, ts: 'DAY 1 · 09:18', type: 'action', log: 'Email 1 sent in the client’s name. Friendly check-in, no pressure language.' },
        { id: 'email2', t: 11800, day: 4, ts: 'DAY 4 · 10:05', type: 'action', log: 'No reply for 72h. Email 2 sent with the invoice PDF attached.' },
        { id: 'reply', t: 15800, day: 6, ts: 'DAY 6 · 14:32', type: 'inbound', log: 'Inbound reply from Teresa Lam (Office Manager). Payment held: possible double-billing on March onsite visits.' },
        { id: 'clsStart', t: 17800, day: 6, cyc: 'start' },
        { id: 'clsDone', t: 19000, day: 6, cyc: 'stop', ts: 'DAY 6 · 14:32', type: 'action', log: 'Reply classified dispute (0.98).' },
        { id: 'freeze', t: 20000, day: 6, ts: 'DAY 6 · 14:32', type: 'alert', log: 'Dispute detected. All outreach halted. The AI will not argue. Routed to human queue. Client notified. Time to freeze: 4 seconds.' },
        { id: 'human', t: 23600, day: 6, ts: 'DAY 6 · 16:40', type: 'human', log: 'Human review: J. Alvarez (ops) + Marcus Webb (client) pulled the March records: the Mar 12 onsite visit was entered twice. A $600 duplicate. The debtor is right.' },
        { id: 'decision', t: 27200, day: 7, ts: 'DAY 7 · 09:05', type: 'human', log: 'Client decision card issued: corrected invoice ($4,600) + apology. Approve?' },
        { id: 'approved', t: 29200, day: 7, ts: 'DAY 7 · 09:12', type: 'human', log: 'Resolution decided by humans. AI resumes only on client instruction, in approve-mode for this thread.' },
        { id: 'repair', t: 32000, day: 8, ts: 'DAY 8 · 11:06', type: 'action', log: 'Repair email sent in the client’s voice, drafted by agent and approved by human. Corrected invoice attached.' },
        { id: 'reply2', t: 35000, day: 11, ts: 'DAY 11 · 09:44', type: 'inbound', log: 'Inbound reply: “Appreciate the quick fix, processing today.”' },
        { id: 'cls2Start', t: 36400, day: 11, cyc: 'start' },
        { id: 'cls2Done', t: 37600, day: 11, cyc: 'stop', ts: 'DAY 11 · 09:45', type: 'action', log: 'Reply classified will-pay (0.96). Standing down.' },
        { id: 'pay', t: 39400, day: 12, payTo: 4600, ts: 'DAY 12 · 15:20', type: 'money', log: 'Payment: $4,600 deposited to Cobalt’s account, the corrected amount. Platform received a webhook confirmation, never the funds.' },
        { id: 'split', t: 41600, day: 12, ts: 'DAY 12 · 15:21', type: 'money', log: 'Case closed. Recovered $4,600 · client keeps $3,680 · fee $920 (20%).' },
        { id: 'lesson', t: 43800, day: 12, end: true, ts: 'DAY 12', type: 'info', log: 'INV-1126: dispute frozen in seconds, decided by humans, repaired in the client’s voice, paid in full.' }
      ],
      pills: [
        { el: 'pills-c1', start: 'clsStart', done: 'clsDone', labels: LABELS, final: 'dispute', conf: 98 },
        { el: 'pills-c2', start: 'cls2Start', done: 'cls2Done', labels: LABELS, final: 'will-pay', conf: 96 }
      ]
    }
  ];

  var DCHOICES = [
    {
      label: 'will-pay', conf: 97, freeze: false,
      rows: [
        { mark: '✓', ok: true, text: 'nothing to negotiate; promised date logged' },
        { mark: '✓', ok: true, text: 'gentle receipt-check scheduled for Monday' }
      ],
      reply: 'Thanks so much, Friday works perfectly. I’ll keep an eye out for it and send a quick confirmation as soon as it lands. Appreciate you sorting this out!'
    },
    {
      label: 'wants-plan', conf: 94, freeze: false,
      rows: [
        { mark: '✓', ok: true, text: 'plan length 3 months ≤ 3-month limit' },
        { mark: '✓', ok: true, text: 'discount 0% ≤ 10% limit' },
        { mark: '→', ok: true, text: 'WITHIN AUTHORITY · ACCEPTING' }
      ],
      reply: 'Happy to make this easy: how about three equal payments of $1,600 on the 15th of each month, starting this month? I’ll send a short confirmation with the exact dates.'
    },
    {
      label: 'dispute', conf: 98, freeze: true,
      rows: [
        { mark: '!', ok: false, text: 'dispute detected; negotiation authority: none' },
        { mark: '→', ok: false, text: 'OUTSIDE AUTHORITY · INSTANT ESCALATION' }
      ],
      freezeNote: 'No reply sent. Outreach frozen for this debtor. Case flagged to a human reviewer and to your inbox within minutes.'
    },
    {
      label: 'hostile', conf: 95, freeze: true,
      rows: [
        { mark: '!', ok: false, text: 'stop request detected; opt-out recorded' },
        { mark: '→', ok: false, text: 'ALL CONTACT HALTED · ESCALATING TO HUMAN' }
      ],
      freezeNote: 'Contact stops immediately on every channel. Opt-out is permanent unless the debtor re-engages on their own.'
    }
  ];

  /* ── state ── */
  var active = 0;
  var playing = false;
  var cycleIdx = 0;
  var fired = [0, 0, 0];
  var elapsed = [0, 0, 0];
  var day = [0, 0, 0];
  var started = [false, false, false];
  var done = [false, false, false];
  var rec = [0, 0, 0];
  var lastTs = Date.now();
  var rafs = {};
  var settles = {};
  var cycleT = null;
  var autoStarted = false;
  var logCount = 0;

  var feedEl = $('#feed');
  var logEl = $('#log');
  var logItemsEl = $('#log-items');
  var logPlaceholderEl = $('#log-placeholder');

  var LOG_COLORS = { info: '#6B7686', action: '#3D4754', inbound: '#9A6B1F', money: '#1E6F4C', alert: '#9A6B1F', human: '#7C5A38', highlight: '#16395B' };
  var DOT_COLORS = { money: '#1E6F4C', inbound: '#C99A3A', alert: '#C99A3A', human: '#7C5A38', highlight: '#16395B', action: '#16395B', info: '#C6CDD4' };

  function flagsFor(a) {
    var v = {};
    CASES[a].events.slice(0, fired[a]).forEach(function (e) { v[e.id] = true; });
    return v;
  }

  function makePills(labels, activeIdx, finalLabel, conf) {
    return labels.map(function (l, i) {
      if (finalLabel && l === finalLabel) {
        var amber = finalLabel === 'dispute' || finalLabel === 'hostile' || finalLabel === 'bounce';
        return '<span class="cls-pill ' + (amber ? 'final-amber' : 'final-green') + '">' + l + ' · ' + conf + '%</span>';
      }
      if (!finalLabel && i === activeIdx % labels.length) {
        return '<span class="cls-pill on">' + l + '</span>';
      }
      return '<span class="cls-pill">' + l + '</span>';
    }).join('');
  }

  function renderCasePills() {
    var flags = flagsFor(active);
    CASES[active].pills.forEach(function (p) {
      var el = document.getElementById(p.el);
      if (!el) return;
      if (!flags[p.start]) { el.innerHTML = ''; return; }
      el.innerHTML = flags[p.done] ? makePills(p.labels, -1, p.final, p.conf) : makePills(p.labels, cycleIdx, null, p.conf);
    });
  }

  function cyclingActive(a) {
    var on = false;
    CASES[a].events.slice(0, fired[a]).forEach(function (e) {
      if (e.cyc === 'start') on = true;
      if (e.cyc === 'stop') on = false;
    });
    return on;
  }

  function startCycle() {
    clearInterval(cycleT);
    cycleT = setInterval(function () { cycleIdx += 1; renderCasePills(); }, 220);
  }
  function stopCycle() { clearInterval(cycleT); }

  function logEntryNode(e) {
    var em = e.type === 'alert' || e.type === 'highlight';
    var wrap = document.createElement('div');
    wrap.className = 'log-entry' + (e.type === 'alert' ? ' em-alert' : e.type === 'highlight' ? ' em-highlight' : '');
    var dot = document.createElement('span');
    dot.className = 'log-dot' + (e.type === 'human' ? ' sq' : '');
    dot.style.background = DOT_COLORS[e.type] || '#C6CDD4';
    var body = document.createElement('div');
    body.className = 'log-entry-body';
    var ts = document.createElement('div');
    ts.className = 'log-ts';
    ts.textContent = e.ts;
    var text = document.createElement('div');
    text.className = 'log-text';
    text.style.color = LOG_COLORS[e.type] || '#6B7686';
    text.style.fontWeight = (e.type === 'money' || em) ? '600' : '400';
    text.textContent = e.log;
    body.appendChild(ts);
    body.appendChild(text);
    wrap.appendChild(dot);
    wrap.appendChild(body);
    return wrap;
  }

  function rebuildLog(noAnim) {
    logItemsEl.innerHTML = '';
    var entries = CASES[active].events.slice(0, fired[active]).filter(function (e) { return e.log; });
    entries.forEach(function (e) {
      var node = logEntryNode(e);
      if (noAnim) node.style.animation = 'none';
      logItemsEl.appendChild(node);
    });
    logCount = entries.length;
    logPlaceholderEl.hidden = entries.length > 0;
  }

  function appendLog(e) {
    if (!e.log) return;
    logItemsEl.appendChild(logEntryNode(e));
    logCount += 1;
    logPlaceholderEl.hidden = true;
  }

  function scrollFeeds() {
    requestAnimationFrame(function () {
      setTimeout(function () {
        [feedEl, logEl].forEach(function (el) {
          if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        });
      }, 60);
    });
  }

  function setRec(a, val) {
    rec[a] = val;
    syncMoney();
  }

  function tweenRec(a, to, ms) {
    var key = 'rec' + a;
    cancelAnimationFrame(rafs[key]);
    clearTimeout(settles[key]);
    settles[key] = setTimeout(function () { setRec(a, to); }, ms + 80);
    var from = rec[a];
    var t0 = performance.now();
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    var stepFn = function (now) {
      var p = Math.min(1, (now - t0) / ms);
      setRec(a, from + (to - from) * ease(p));
      if (p < 1) rafs[key] = requestAnimationFrame(stepFn);
    };
    rafs[key] = requestAnimationFrame(stepFn);
  }

  function syncMoney() {
    var total = rec[0] + rec[1] + rec[2];
    $('#port-total').textContent = fmt(total);
    $('#port-clients').textContent = fmt(total * 0.8);
    $('#port-fees').textContent = fmt(total * 0.2);
    $('#case-recovered').textContent = fmt(rec[active]);
  }

  function sync() {
    var flags = [flagsFor(0), flagsFor(1), flagsFor(2)];

    // feeds visible
    $$('.case-feed').forEach(function (f) { f.hidden = +f.dataset.case !== active; });

    // stamps
    $$('.case-feed').forEach(function (f) {
      var a = +f.dataset.case;
      var paid = a === 0 ? flags[0].pay2 : a === 1 ? flags[1].pay : flags[2].pay;
      var off = $('[data-stamp="off"]', f);
      var pd = $('[data-stamp="paid"]', f);
      if (off) off.hidden = !!paid;
      if (pd) pd.hidden = !paid;
    });

    // frozen banner (case C): freeze fired, repair not yet
    var fb = $('#frozen-banner');
    if (fb) fb.hidden = !(flags[2].freeze && !flags[2].repair);

    // approve swap
    var aw = $('#approve-wait'), ad = $('#approve-done');
    if (aw) aw.hidden = !(flags[2].decision && !flags[2].approved);
    if (ad) ad.hidden = !flags[2].approved;

    // tabs
    $$('.case-tab').forEach(function (tab) {
      var i = +tab.dataset.pick;
      tab.classList.toggle('active', i === active);
      var hint = $('.tab-hint', tab);
      var txt = done[i] ? 'WATCHED · CLICK TO REVIEW'
        : started[i] ? (i === active && playing ? 'PLAYING…' : 'IN PROGRESS')
        : (i === 0 ? 'AUTO-PLAYS ON VIEW' : 'PLAYS ON CLICK');
      hint.textContent = txt;
      hint.classList.toggle('playing', i === active && playing);
    });

    // controls
    $('#btn-pause').hidden = !playing;
    $('#btn-play').hidden = playing;
    $('#play-label').textContent = done[active] ? 'REPLAY' : (started[active] ? 'RESUME' : 'PLAY');
    $('#day-num').textContent = day[active];
    $('#sim-status').textContent = done[active] ? 'CASE CLOSED'
      : playing ? 'RUNNING · TIME-COMPRESSED'
      : started[active] ? 'PAUSED'
      : (active === 0 ? 'AUTO-PLAYS ON VIEW' : 'PLAYS ON CLICK');

    // stage head
    $('#case-invoice').textContent = CASES[active].invoice;
    $('#case-target').textContent = CASES[active].target;

    syncMoney();
    renderCasePills();
  }

  function reveal(e, a) {
    $$('.case-feed[data-case="' + a + '"] [data-ev="' + e.id + '"]').forEach(function (el) { el.hidden = false; });
  }

  function fire(e, a, noCycle) {
    day[a] = e.day;
    if (e.end) { done[a] = true; playing = false; }
    reveal(e, a);
    if (e.cyc === 'start' && !noCycle) startCycle();
    if (e.cyc === 'stop') stopCycle();
    if (e.payTo != null) tweenRec(a, e.payTo, 1100);
    if (a === active) appendLog(e);
    sync();
    scrollFeeds();
  }

  function tick() {
    if (!playing) return;
    var evs = CASES[active].events;
    var now = Date.now();
    var dt = Math.min(now - lastTs, 400);
    lastTs = now;
    elapsed[active] += dt;
    while (fired[active] < evs.length && evs[fired[active]].t <= elapsed[active]) {
      var e = evs[fired[active]];
      fired[active] += 1;
      fire(e, active);
    }
  }

  function play() {
    if (done[active]) { replay(); return; }
    lastTs = Date.now();
    started[active] = true;
    playing = true;
    if (cyclingActive(active)) startCycle();
    sync();
  }

  function pause() {
    playing = false;
    stopCycle();
    sync();
  }

  function stepOnce() {
    var evs = CASES[active].events;
    if (fired[active] >= evs.length) return;
    var e = evs[fired[active]];
    fired[active] += 1;
    elapsed[active] = e.t;
    lastTs = Date.now();
    started[active] = true;
    fire(e, active, !playing);
  }

  function replay() {
    var a = active;
    stopCycle();
    cancelAnimationFrame(rafs['rec' + a]);
    clearTimeout(settles['rec' + a]);
    fired[a] = 0;
    elapsed[a] = 0;
    day[a] = 0;
    done[a] = false;
    started[a] = true;
    rec[a] = 0;
    playing = true;
    cycleIdx = 0;
    lastTs = Date.now();
    $$('.case-feed[data-case="' + a + '"] [data-ev]').forEach(function (el) { el.hidden = true; });
    CASES[a].pills.forEach(function (p) {
      var el = document.getElementById(p.el);
      if (el) el.innerHTML = '';
    });
    rebuildLog(false);
    sync();
    requestAnimationFrame(function () {
      [feedEl, logEl].forEach(function (el) { if (el) el.scrollTo({ top: 0 }); });
    });
  }

  function pickCase(i) {
    if (i === active) return;
    stopCycle();
    var fresh = !started[i];
    lastTs = Date.now();
    active = i;
    if (fresh) { started[i] = true; playing = true; } else { playing = false; }
    rebuildLog(true);
    sync();
    requestAnimationFrame(function () {
      setTimeout(function () {
        [feedEl, logEl].forEach(function (el) {
          if (el) el.scrollTo({ top: fresh ? 0 : el.scrollHeight });
        });
      }, 60);
    });
  }

  setInterval(tick, 90);

  $$('.case-tab').forEach(function (tab) {
    tab.addEventListener('click', function () { pickCase(+tab.dataset.pick); });
  });
  $('#btn-play').addEventListener('click', play);
  $('#btn-pause').addEventListener('click', pause);
  $('#btn-step').addEventListener('click', stepOnce);
  $('#btn-replay').addEventListener('click', replay);
  $$('.js-replay').forEach(function (b) { b.addEventListener('click', replay); });

  try {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !autoStarted) {
          autoStarted = true;
          if (active === 0 && !started[0]) play();
        }
      });
    }, { threshold: [0.35] });
    io.observe($('#sim'));
  } catch (e) { /* no-op */ }

  sync();

  /* ── you be the debtor ── */
  var dTimers = [];
  var dCycleT = null;
  var dChoice = null;
  var dCycle = 0;
  var dDone = false;

  function renderDPills() {
    if (dChoice == null) return;
    var dc = DCHOICES[dChoice];
    $('#d-pills').innerHTML = dDone ? makePills(LABELS, -1, dc.label, dc.conf) : makePills(LABELS, dCycle, null, dc.conf);
  }

  function pickDebtor(i) {
    dTimers.forEach(clearTimeout);
    dTimers = [];
    clearInterval(dCycleT);
    dChoice = i;
    dCycle = 0;
    dDone = false;

    $$('.choice').forEach(function (b) { b.classList.toggle('selected', +b.dataset.choice === i); });

    var dc = DCHOICES[i];
    $('#d-idle').hidden = true;
    $('#d-chip').hidden = false;
    $('#d-check').hidden = true;
    $('#d-outcome-reply').hidden = true;
    $('#d-outcome-freeze').hidden = true;
    renderDPills();

    dCycleT = setInterval(function () { dCycle = (dCycle + 1) % 5; renderDPills(); }, 190);
    dTimers.push(setTimeout(function () {
      clearInterval(dCycleT);
      dDone = true;
      renderDPills();
    }, 1250));
    dTimers.push(setTimeout(function () {
      var rowsEl = $('#d-check-rows');
      rowsEl.innerHTML = '';
      dc.rows.forEach(function (r) {
        var row = document.createElement('div');
        row.className = 'auth-row';
        var mark = document.createElement('span');
        mark.className = 'mark';
        mark.style.color = r.ok ? '#1E6F4C' : '#9A6B1F';
        mark.textContent = r.mark;
        var text = document.createElement('span');
        text.textContent = r.text;
        row.appendChild(mark);
        row.appendChild(text);
        rowsEl.appendChild(row);
      });
      $('#d-check').hidden = false;
    }, 2000));
    dTimers.push(setTimeout(function () {
      if (dc.freeze) {
        $('#d-freeze-note').textContent = dc.freezeNote;
        $('#d-outcome-freeze').hidden = false;
      } else {
        $('#d-reply-text').textContent = dc.reply;
        $('#d-outcome-reply').hidden = false;
      }
    }, 3000));
  }

  $$('.choice').forEach(function (b) {
    b.addEventListener('click', function () { pickDebtor(+b.dataset.choice); });
  });

  /* ── ROI slider ── */
  var roiRange = $('#roi-range');
  function syncRoi() {
    var roi = +roiRange.value;
    $('#roi-val').textContent = fmt(roi);
    $('#roi-rec').textContent = fmt(roi * 0.15) + ' – ' + fmt(roi * 0.25);
    $('#roi-net').textContent = fmt(roi * 0.12) + ' – ' + fmt(roi * 0.20);
  }
  roiRange.addEventListener('input', syncRoi);
  roiRange.addEventListener('change', syncRoi);
  syncRoi();

  /* ── FAQ accordion ── */
  $$('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ── early access forms (Formspree) ── */
  $$('.js-ea-form').forEach(function (form) {
    var btn = $('button[type="submit"]', form);
    var errEl = form.parentElement.querySelector('.ea-error');
    var originalLabel = btn.textContent;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      errEl.hidden = true;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          var ok = document.createElement('div');
          ok.className = form.classList.contains('capture-pill') ? 'capture-success' : 'intake-success';
          ok.innerHTML = '<span class="ck">✓</span><span>You’re on the list. We’ll be in touch before the July cohort.</span>';
          form.replaceWith(ok);
        } else {
          return res.json().then(function (data) {
            var m = (data && data.errors && data.errors.length)
              ? data.errors.map(function (e) { return e.message; }).join(', ')
              : 'Something went wrong. Please try again.';
            showError(m);
          }).catch(function () { showError('Something went wrong. Please try again.'); });
        }
      }).catch(function () {
        showError('Network problem. Please check your connection and try again.');
      });

      function showError(message) {
        errEl.textContent = message;
        errEl.hidden = false;
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
    });
  });
})();
