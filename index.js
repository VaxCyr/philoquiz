let DATA = {};
let QUIZ_QS = [];
let DEFINITIONS = {};
let CITATIONS = [];
let REMEDES = [];
let DESIRES = [];
let PHILOSOPHES_DEVOIR = [];
let PHILOSOPHES_ETAT = [];
let PHILOSOPHES_CONSCIENCE = [];
let PHILOSOPHES_LIBERTE_TEMPS = [];
let REPERES_DEFS = {};
let DEFINITIONS_KEYWORDS = {};

// ─────────────────────────────────────────────────────────────
// POOL DE RÉVISION
// ─────────────────────────────────────────────────────────────
// Règle simple et déterministe pour inclure une question dans le mode révision :
//   - La question DOIT avoir un champ "revMot" présent ET non-null
//   - revMot === ""   → le mot affiché = q.correct
//   - revMot !== ""   → le mot affiché = revMot (override explicite)
//   - La définition   = q.defText si présent, sinon q.correct
// Aucune heuristique sur le contenu de la question n'est utilisée.
// ─────────────────────────────────────────────────────────────

function buildRevisionPool() {
  const pool = [];
  const selectedChapters = Array.from(
    document.querySelectorAll('input[name="chapters"]:checked')
  ).map(cb => cb.value);
  const hasRepereChapter = selectedChapters.includes('reperes');

  // 1. Définitions standards (termes du dictionnaire)
  Object.entries(DEFINITIONS).forEach(([term, def]) => {
    if (REPERES_DEFS[term] && !hasRepereChapter) return;
    pool.push({
      mot: term.replace(/_/g, ' '),
      def: def,
      keywords: DEFINITIONS_KEYWORDS[term] || null,
      source: 'definition'
    });
  });

  // 2. Questions de quiz avec revMot défini et non-null
  QUIZ_QS.forEach(q => {
    if (q.multi) return;
    if (!('revMot' in q) || q.revMot === null || q.revMot === undefined) return;

    const mot = q.revMot === '' ? q.correct : q.revMot;
    const def = q.defText || q.correct;
    const keywords = Array.isArray(q.keywords) ? q.keywords : null;

    // Éviter les doublons avec les définitions standards
    const motNorm = mot.toLowerCase().replace(/_/g, ' ');
    const alreadyIn = pool.some(
      item => item.mot.toLowerCase() === motNorm && item.source === 'definition'
    );
    if (alreadyIn) return;

    pool.push({ mot, def, keywords, source: 'quiz' });
  });

  return pool;
}

// ─────────────────────────────────────────────────────────────
// CHARGEMENT
// ─────────────────────────────────────────────────────────────

async function loadData() {
  try {
    document.getElementById('chapter-selection').style.display = 'flex';
    try {
      const repRes = await fetch('reperes.json');
      if (repRes.ok) {
        const repData = await repRes.json();
        REPERES_DEFS = repData.definitions || {};
      }
    } catch (e) { console.warn('reperes.json:', e); }
    initializeApp();
  } catch (error) {
    console.error('Erreur init:', error);
  }
}

async function loadChapterData(chapters) {
  QUIZ_QS = []; DEFINITIONS = {}; CITATIONS = []; REMEDES = []; DESIRES = [];
  PHILOSOPHES_DEVOIR = []; PHILOSOPHES_ETAT = []; PHILOSOPHES_CONSCIENCE = [];
  PHILOSOPHES_LIBERTE_TEMPS = []; DEFINITIONS_KEYWORDS = {};

  const chapterData = await Promise.all(chapters.map(async chapter => {
    try {
      const r = await fetch(`chapitre_${chapter}.json`);
      if (!r.ok) throw new Error(`Chapter ${chapter} not found`);
      return r.json();
    } catch (e) { console.warn(`Could not load ${chapter}:`, e); return null; }
  }));

  chapterData.forEach((data, i) => {
    if (!data) return;
    const chapter = chapters[i];
    if (data.quiz_questions) QUIZ_QS.push(...data.quiz_questions.map(q => ({ ...q, chapter })));
    if (data.definitions) Object.assign(DEFINITIONS, data.definitions);
    if (data.definitions_keywords) Object.assign(DEFINITIONS_KEYWORDS, data.definitions_keywords);
    if (data.citations) CITATIONS.push(...data.citations);
    if (chapter === 'bonheur') { if (data.remedes) REMEDES.push(...data.remedes); if (data.desires) DESIRES.push(...data.desires); }
    else if (chapter === 'devoir' && data.philosophes) PHILOSOPHES_DEVOIR.push(...data.philosophes);
    else if (chapter === 'etat' && data.philosophes) PHILOSOPHES_ETAT.push(...data.philosophes);
    else if (chapter === 'conscience' && data.philosophes) PHILOSOPHES_CONSCIENCE.push(...data.philosophes);
    else if (chapter === 'liberte_temps' && data.philosophes) PHILOSOPHES_LIBERTE_TEMPS.push(...data.philosophes);
  });

  if (REPERES_DEFS) Object.assign(DEFINITIONS, REPERES_DEFS);
  if (QUIZ_QS.length < 5) throw new Error('Pas assez de questions. Sélectionnez plus de chapitres.');
  console.log(`${QUIZ_QS.length} questions chargées depuis ${chapters.length} chapitres`);
  return true;
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

function initializeApp() {
  const chapterModal = document.getElementById('chapter-selection');
  const mainContent = document.getElementById('main-content');
  const validateBtn = document.getElementById('validate-chapters');
  const warningMsg = document.getElementById('chapter-warning');

  validateBtn.addEventListener('click', () => {
    const sel = Array.from(document.querySelectorAll('input[name="chapters"]:checked')).map(cb => cb.value);
    if (sel.length === 0) { warningMsg.textContent = 'Veuillez sélectionner au moins un chapitre.'; return; }
    loadChapterData(sel).then(() => {
      chapterModal.style.display = 'none';
      mainContent.style.display = 'block';
      initializeQuizInterface();
    }).catch(err => { warningMsg.textContent = 'Erreur : ' + err.message; });
  });

  document.getElementById('change-chapters').addEventListener('click', () => {
    chapterModal.style.display = 'flex';
    mainContent.style.display = 'none';
  });

  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  menuToggle.addEventListener('click', () => menu.classList.toggle('hidden'));
  document.addEventListener('click', e => {
    if (!menuToggle.contains(e.target) && !menu.contains(e.target)) menu.classList.add('hidden');
  });

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
    const isLight = document.documentElement.classList.contains('light-mode');
    themeToggle.textContent = isLight ? '🌙 Mode Sombre' : '☀️ Mode Clair';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.add('light-mode');
    themeToggle.textContent = '🌙 Mode Sombre';
  }
}

// ─────────────────────────────────────────────────────────────
// INTERFACE QUIZ
// ─────────────────────────────────────────────────────────────

function initializeQuizInterface() {
  const main = document.getElementById('main');
  const scoreVal = document.getElementById('score-val');
  const scoreMax = document.getElementById('score-max');
  const progress = document.getElementById('progress');
  const scoreWrap = document.getElementById('scoreWrap');
  let score = 0, maxQ = 0, currentMode = '';

  function el(id) { return document.getElementById(id); }
  function randSort(a) { return a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]); }
  function setMode(name) { currentMode = name; progress.textContent = 'Mode : ' + name; updateActiveButton(); }
  function updateScore() { scoreVal.textContent = score; scoreMax.textContent = maxQ; }
  function updateActiveButton() {
    ['mode-quiz','mode-match','mode-revision','mode-flash','show-defs'].forEach(id => el(id).classList.remove('active'));
    if (currentMode === 'Quiz') el('mode-quiz').classList.add('active');
    if (currentMode === 'Association') el('mode-match').classList.add('active');
    if (currentMode.startsWith('Révision')) el('mode-revision').classList.add('active');
    if (currentMode === 'Flashcards') el('mode-flash').classList.add('active');
    if (currentMode === 'Toutes les définitions') el('show-defs').classList.add('active');
    scoreWrap.style.display = currentMode === 'Flashcards' ? 'none' : 'block';
  }

  function showDefinitionBox(title, text) {
    const box = document.createElement('div');
    box.className = 'defbox';
    box.innerHTML = `<strong>${title}</strong><div class='small' style='margin-top:6px'>${text}</div>`;
    return box;
  }

  function normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function extractKeywords(text) {
    const stop = ['le','la','les','un','une','des','de','du','ce','qui','que','est','sont',
      'dans','sur','pour','par','avec','sans','sous','ou','et','à','a','il','elle',
      'on','nous','vous','ils','elles','se','si','ne','pas','plus','mais','car'];
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .split(/\s+/).filter(w => w.length > 2 && !stop.includes(w));
  }

  function checkDefinitionMatch(userAnswer, correctDef, keywords) {
    const userNorm = normalizeText(userAnswer);
    if (Array.isArray(keywords) && keywords.length > 0) {
      return keywords.every(kw => {
        if (Array.isArray(kw)) return kw.some(sub => userNorm.includes(normalizeText(sub)));
        return userNorm.includes(normalizeText(kw));
      });
    }
    const correctNorm = normalizeText(correctDef);
    if (userNorm === correctNorm) return true;
    const userKws = extractKeywords(userAnswer);
    const correctKws = extractKeywords(correctDef);
    if (correctKws.length === 0) return userNorm.includes(correctNorm.slice(0, 10));
    const userSet = new Set(userKws);
    let matchCount = 0;
    for (const kw of correctKws) if (userSet.has(kw)) matchCount++;
    const threshold = correctKws.length <= 2 ? 1 : 0.35;
    const required = Math.min(6, Math.max(1, Math.ceil(correctKws.length * threshold)));
    return matchCount >= required;
  }

  // ── QUIZ ──────────────────────────────────────────────────

  function startQuiz() {
    setMode('Quiz'); score = 0;
    const order = randSort(QUIZ_QS.slice());
    maxQ = Math.min(20, order.length);
    updateScore();
    let idx = 0;
    renderQuestion();

    function renderQuestion() {
      const item = order[idx];
      main.innerHTML = '';

      function esc(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
      }
      function fmtOpt(text, hw) {
        if (hw) {
          const m = String(text).match(/^(.*)\s*\(([^)]+)\)\s*$/);
          if (m) return `${esc(m[1])} (<span class="work">${esc(m[2])}</span>)`;
        }
        return esc(text);
      }

      const qdiv = document.createElement('div');
      qdiv.className = 'question';
      qdiv.textContent = `Q${idx+1}. ${item.q}`;
      main.appendChild(qdiv);

      const note = document.createElement('div');
      note.className = 'small'; note.style.marginBottom = '8px';
      note.textContent = item.multi ? 'Réponse attendue : plusieurs (sélectionnez puis validez).' : 'Réponse attendue : une seule';
      main.appendChild(note);

      const ans = document.createElement('div'); ans.className = 'answers';
      const hw = /Qui\s+a\s+écrit/i.test(String(item.q));

      if (item.multi) {
        const useDyn = Array.isArray(item.corrects) && item.corrects.length > 0 && Array.isArray(item.distractors);
        let optsMulti = useDyn
          ? randSort([...item.corrects, ...randSort(item.distractors.slice()).slice(0, Math.max(4 - item.corrects.length, 0))]).map(t => ({ text: t }))
          : randSort(item.opts.slice().map((opt, origIdx) => ({ text: opt, origIdx })));

        const selectedTexts = new Set(), selectedIdxs = new Set();
        optsMulti.forEach(optObj => {
          const btn = document.createElement('div'); btn.className = 'answer';
          btn.innerHTML = fmtOpt(optObj.text, hw);
          if (!useDyn) btn.dataset.origIdx = optObj.origIdx;
          btn.onclick = () => {
            if (btn.classList.contains('disabled')) return;
            if (btn.classList.contains('selected')) {
              btn.classList.remove('selected');
              if (useDyn) selectedTexts.delete(optObj.text); else selectedIdxs.delete(optObj.origIdx);
            } else {
              btn.classList.add('selected');
              if (useDyn) selectedTexts.add(optObj.text); else selectedIdxs.add(optObj.origIdx);
            }
          };
          ans.appendChild(btn);
        });
        main.appendChild(ans);

        const submit = document.createElement('button'); submit.textContent = 'Valider';
        submit.className = 'primary'; submit.style.marginTop = '10px';
        submit.onclick = () => {
          let correct;
          if (useDyn) {
            const cs = new Set(item.corrects), sel = Array.from(selectedTexts);
            correct = sel.length === cs.size && sel.every(t => cs.has(t));
          } else {
            correct = JSON.stringify(Array.from(selectedIdxs).sort((a,b)=>a-b)) === JSON.stringify(item.a);
          }
          Array.from(ans.children).forEach(c => {
            c.classList.add('disabled');
            if (useDyn) { if (item.corrects.includes(c.textContent)) c.classList.add('correct'); else if (c.classList.contains('selected')) c.classList.add('wrong'); }
            else { if (item.a.includes(parseInt(c.dataset.origIdx))) c.classList.add('correct'); else if (c.classList.contains('selected')) c.classList.add('wrong'); }
          });
          submit.disabled = true;
          if (correct) { score++; updateScore(); }
          const rel = item.defKey ? {title:item.defKey.replace(/_/g,' '),text:DEFINITIONS[item.defKey]} : (item.defText?{title:'Explication',text:item.defText}:null);
          if (rel) main.appendChild(showDefinitionBox(rel.title, rel.text));
          const nb = document.createElement('button'); nb.textContent = 'Question suivante'; nb.className = 'primary'; nb.style.marginTop = '10px';
          nb.onclick = () => { idx++; if (idx < maxQ) renderQuestion(); else showResults(); };
          main.appendChild(nb);
        };
        main.appendChild(submit);

      } else {
        let opts, correctIndex;
        if (item.correct && Array.isArray(item.distractors) && item.distractors.length >= 3) {
          opts = randSort([item.correct, ...randSort(item.distractors.slice()).slice(0, 3)]);
          correctIndex = opts.indexOf(item.correct);
        } else {
          opts = randSort(item.opts.slice()); correctIndex = item.a;
        }
        opts.forEach(opt => {
          const btn = document.createElement('div'); btn.className = 'answer';
          btn.innerHTML = fmtOpt(opt, hw);
          btn.onclick = () => {
            if (btn.classList.contains('disabled')) return;
            const isCorrect = item.correct && Array.isArray(item.distractors)
              ? opts.indexOf(opt) === correctIndex
              : item.opts.indexOf(opt) === item.a;
            Array.from(ans.children).forEach(c => {
              c.classList.add('disabled');
              if (item.correct && Array.isArray(item.distractors)) { if (c.textContent === item.correct) c.classList.add('correct'); }
              else { if (item.opts.indexOf(c.textContent) === item.a) c.classList.add('correct'); }
            });
            if (isCorrect) { score++; updateScore(); } else btn.classList.add('wrong');
            const rel = item.defKey ? {title:item.defKey.replace(/_/g,' '),text:DEFINITIONS[item.defKey]} : (item.defText?{title:'Explication',text:item.defText}:null);
            if (rel) main.appendChild(showDefinitionBox(rel.title, rel.text));
            const nb = document.createElement('button'); nb.textContent = 'Question suivante'; nb.className = 'primary'; nb.style.marginTop = '10px';
            nb.onclick = () => { idx++; if (idx < maxQ) renderQuestion(); else showResults(); };
            main.appendChild(nb);
          };
          ans.appendChild(btn);
        });
        main.appendChild(ans);
      }
    }
    function showResults() {
      main.innerHTML = `<div class='question'>Terminé — Résultat : ${score}/${maxQ}</div><div class='small' style='margin-top:8px'>Recharge le mode pour rejouer.</div>`;
    }
  }

  // ── ASSOCIATION ────────────────────────────────────────────

  function startMatch() {
    setMode('Association'); score = 0;
    const entries = Object.entries(DEFINITIONS);
    const pairs = entries.slice(0, 18);
    maxQ = pairs.length; updateScore();
    const leftKeys = randSort(pairs.map(d => d[0]));
    const rightObjs = randSort(pairs.map(d => ({ key: d[0], def: d[1] })));

    main.innerHTML = '';
    const inst = document.createElement('div'); inst.className = 'small';
    inst.textContent = 'Clique sur un terme (gauche) puis sur sa définition (droite).';
    main.appendChild(inst);
    const grid = document.createElement('div'); grid.className = 'match-grid'; grid.style.marginTop = '10px';

    const leftCol = document.createElement('div');
    leftKeys.forEach(key => {
      const c = document.createElement('div'); c.className = 'card';
      c.textContent = key.replace(/_/g, ' '); c.dataset.key = key; c.dataset.locked = 'false';
      c.onclick = () => {
        if (c.dataset.locked === 'true') return;
        Array.from(leftCol.children).forEach(x => x.style.boxShadow = 'none');
        c.style.boxShadow = 'inset 0 0 0 2px rgba(125,211,252,0.5)';
        main.dataset.selectedLeft = key;
      };
      leftCol.appendChild(c);
    });

    const rightCol = document.createElement('div');
    rightObjs.forEach(obj => {
      const c = document.createElement('div'); c.className = 'card';
      c.textContent = obj.def; c.dataset.key = obj.key; c.dataset.locked = 'false';
      c.onclick = () => {
        const lk = main.dataset.selectedLeft;
        if (!lk) return alert('Sélectionne d\'abord un terme à gauche.');
        if (c.dataset.locked === 'true') return;
        if (lk === c.dataset.key) {
          c.dataset.locked = 'true'; c.classList.add('locked');
          const le = Array.from(leftCol.children).find(x => x.dataset.key === lk);
          if (le) { le.dataset.locked = 'true'; le.classList.add('locked'); le.style.boxShadow = 'none'; }
          score++; updateScore(); main.dataset.selectedLeft = '';
          if (score >= maxQ) main.innerHTML = `<div class='question'>Bravo ! ${score}/${maxQ}</div>`;
        } else {
          c.style.border = '2px solid var(--error)';
          setTimeout(() => c.style.border = '1px dashed rgba(255,255,255,0.04)', 600);
          main.dataset.selectedLeft = '';
        }
      };
      rightCol.appendChild(c);
    });

    grid.appendChild(leftCol); grid.appendChild(rightCol); main.appendChild(grid);
  }

  // ── RÉVISION ──────────────────────────────────────────────

  function startRevision() {
    main.innerHTML = '';
    const title = document.createElement('div'); title.className = 'question';
    title.textContent = 'Mode Révision — Choisis ta difficulté';
    main.appendChild(title);

    const info = document.createElement('div'); info.className = 'small'; info.style.marginBottom = '12px';
    info.innerHTML = `<strong>Facile :</strong> Définition → trouver le Mot<br><strong>Moyen :</strong> Mélange des deux sens (70% facile / 30% difficile)<br><strong>Difficile :</strong> Mot → écrire la Définition`;
    main.appendChild(info);

    const pool = buildRevisionPool();
    const poolInfo = document.createElement('div'); poolInfo.className = 'small';
    poolInfo.style.cssText = 'margin-bottom:16px;opacity:0.6;';
    poolInfo.textContent = `${pool.length} entrées disponibles pour la révision`;
    main.appendChild(poolInfo);

    const selector = document.createElement('div'); selector.className = 'difficulty-selector';
    ['Facile', 'Moyen', 'Difficile'].forEach((name, i) => {
      const btn = document.createElement('div'); btn.className = 'difficulty-btn';
      btn.textContent = name;
      btn.onclick = () => showRevisionCountSelector(['easy', 'medium', 'hard'][i], pool);
      selector.appendChild(btn);
    });
    main.appendChild(selector);
  }

  function showRevisionCountSelector(difficulty, pool) {
    main.innerHTML = '';
    const title = document.createElement('div'); title.className = 'question';
    title.textContent = 'Mode Révision — Combien de questions ?';
    main.appendChild(title);

    const selector = document.createElement('div'); selector.className = 'difficulty-selector';
    [5, 10, 20].forEach(count => {
      const btn = document.createElement('div'); btn.className = 'difficulty-btn';
      btn.textContent = count + ' questions';
      if (count > pool.length) btn.style.opacity = '0.4';
      btn.onclick = () => startRevisionQuestions(difficulty, Math.min(count, Math.max(pool.length, 1)), pool);
      selector.appendChild(btn);
    });
    main.appendChild(selector);

    const back = document.createElement('button'); back.textContent = '← Retour';
    back.style.marginTop = '20px'; back.onclick = startRevision;
    main.appendChild(back);
  }

  function startRevisionQuestions(difficulty, requestedCount, pool) {
    const diffLabel = {easy:'Facile', medium:'Moyen', hard:'Difficile'}[difficulty];
    setMode('Révision — ' + diffLabel);
    score = 0;
    const items = randSort(pool.slice()).slice(0, requestedCount);
    maxQ = items.length; updateScore();
    let idx = 0;
    renderRevisionQuestion();

    function renderRevisionQuestion() {
      const item = items[idx];
      main.innerHTML = '';

      // Sens : true = Def→Mot (facile), false = Mot→Def (difficile)
      const showDef = difficulty === 'easy' ? true : difficulty === 'hard' ? false : Math.random() > 0.3;

      const qdiv = document.createElement('div'); qdiv.className = 'question';
      qdiv.textContent = `Q${idx+1}/${maxQ}`; main.appendChild(qdiv);

      if (showDef) {
        // ── Facile : affiche la définition, l'user écrit le mot ──
        const defDiv = document.createElement('div');
        defDiv.style.cssText = 'margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;';
        defDiv.innerHTML = `<strong>Définition :</strong><br>${item.def}`;
        main.appendChild(defDiv);

        const instr = document.createElement('div'); instr.className = 'small'; instr.style.marginTop = '12px';
        instr.textContent = 'Quel est le terme correspondant ?';
        main.appendChild(instr);

        const input = document.createElement('input'); input.type = 'text'; input.placeholder = 'Ta réponse...';
        main.appendChild(input);

        const submitBtn = document.createElement('button'); submitBtn.textContent = 'Valider';
        submitBtn.className = 'primary'; submitBtn.style.marginTop = '10px';

        submitBtn.onclick = () => {
          if (!input.value.trim()) return;
          const uNorm = normalizeText(input.value), mNorm = normalizeText(item.mot);
          const correct = uNorm === mNorm
            || (uNorm.length > 2 && mNorm.includes(uNorm))
            || (mNorm.length > 2 && uNorm.includes(mNorm));

          input.disabled = true; submitBtn.disabled = true; submitBtn.style.display = 'none';
          const fb = document.createElement('div');
          fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
          if (correct) {
            fb.innerHTML = `<strong>✓ Correct !</strong><br>Le terme : <strong>${item.mot}</strong>`;
            score++; updateScore();
          } else {
            fb.innerHTML = `<strong>✗ Incorrect</strong><br>Ta réponse : <em>${input.value}</em><br>Le terme correct : <strong>${item.mot}</strong>`;
          }
          main.appendChild(fb);
          showNextBtn();
        };

        input.addEventListener('keydown', e => { if (e.key === 'Enter' && !input.disabled) { e.preventDefault(); submitBtn.click(); } });
        main.appendChild(submitBtn); input.focus();

      } else {
        // ── Difficile : affiche le mot, l'user écrit la définition ──
        const motDiv = document.createElement('div');
        motDiv.style.cssText = 'margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;';
        motDiv.innerHTML = `<strong>Mot :</strong> ${item.mot}`;
        main.appendChild(motDiv);

        const instr = document.createElement('div'); instr.className = 'small'; instr.style.marginTop = '12px';
        instr.textContent = 'Donne la définition (les mots-clés principaux suffisent) :';
        main.appendChild(instr);

        const textarea = document.createElement('textarea'); textarea.placeholder = 'Ta réponse...';
        main.appendChild(textarea);

        const submitBtn = document.createElement('button'); submitBtn.textContent = 'Valider (Ctrl+Entrée)';
        submitBtn.className = 'primary'; submitBtn.style.marginTop = '10px';

        submitBtn.onclick = () => {
          if (!textarea.value.trim()) return;
          const correct = checkDefinitionMatch(textarea.value, item.def, item.keywords);
          textarea.disabled = true; submitBtn.disabled = true; submitBtn.style.display = 'none';

          const fb = document.createElement('div');
          fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
          fb.innerHTML = correct ? '<strong>✓ Correct !</strong>' : '<strong>✗ Incomplet ou incorrect</strong>';
          main.appendChild(fb);
          if (correct) { score++; updateScore(); }

          const userBox = document.createElement('div');
          userBox.style.cssText = 'margin-top:8px;padding:10px;background:rgba(255,255,255,0.02);border-radius:8px;';
          userBox.innerHTML = `<strong>Ta réponse :</strong><br><em>${textarea.value}</em>`;
          main.appendChild(userBox);

          const corrBox = document.createElement('div');
          corrBox.style.cssText = 'margin-top:8px;padding:10px;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.3);border-radius:8px;';
          corrBox.innerHTML = `<strong>Réponse attendue :</strong><br><em>${item.def}</em>`;
          main.appendChild(corrBox);
          showNextBtn();
        };

        textarea.addEventListener('keydown', e => { if (e.key === 'Enter' && e.ctrlKey && !textarea.disabled) { e.preventDefault(); submitBtn.click(); } });
        main.appendChild(submitBtn); textarea.focus();
      }

      function showNextBtn() {
        const nb = document.createElement('button');
        nb.textContent = idx+1 < maxQ ? 'Question suivante (Entrée)' : 'Voir les résultats (Entrée)';
        nb.className = 'primary'; nb.style.marginTop = '10px';
        function goNext() { document.removeEventListener('keypress', onEnter); idx++; if (idx < maxQ) renderRevisionQuestion(); else showRevisionResults(); }
        function onEnter(e) { if (e.key === 'Enter') goNext(); }
        nb.addEventListener('click', goNext);
        document.addEventListener('keypress', onEnter);
        main.appendChild(nb); nb.focus();
      }
    }

    function showRevisionResults() {
      main.innerHTML = `<div class='question'>Terminé — Résultat : ${score}/${maxQ}</div><div class='small' style='margin-top:8px'>Excellent travail ! Recommence pour t'améliorer.</div>`;
    }
  }

  // ── FLASHCARDS ────────────────────────────────────────────

  function startFlash() {
    setMode('Flashcards'); score = 0;
    const keys = Object.keys(DEFINITIONS);
    const order = randSort(keys);
    let idx = 0; maxQ = keys.length; updateScore();
    renderCard();

    function renderCard() {
      main.innerHTML = '';
      const k = order[idx];
      const card = document.createElement('div'); card.className = 'flash';
      card.textContent = k.replace(/_/g, ' ');
      main.appendChild(card);

      const btns = document.createElement('div'); btns.style.marginTop = '12px';
      const prev = document.createElement('button'); prev.textContent = 'Précédent';
      prev.onclick = () => { if (idx > 0) { idx--; renderCard(); } };

      let showing = false;
      const show = document.createElement('button'); show.textContent = 'Afficher la définition';
      show.className = 'primary'; show.style.marginLeft = '8px';
      show.onclick = () => {
        showing = !showing;
        card.textContent = showing ? DEFINITIONS[k] : k.replace(/_/g, ' ');
        show.textContent = showing ? 'Cacher la définition' : 'Afficher la définition';
      };

      const next = document.createElement('button'); next.textContent = 'Suivant'; next.style.marginLeft = '8px';
      next.onclick = () => { if (idx+1 >= order.length) main.innerHTML = `<div class='question'>Fin des flashcards</div>`; else { idx++; renderCard(); } };

      btns.appendChild(prev); btns.appendChild(show); btns.appendChild(next);
      main.appendChild(btns);
    }
  }

  // ── DÉFINITIONS ───────────────────────────────────────────

  function showAllDefs() {
    setMode('Toutes les définitions'); main.innerHTML = '';
    const dl = document.createElement('div');
    Object.entries(DEFINITIONS).forEach(([k, v]) => {
      const item = document.createElement('div'); item.style.marginBottom = '10px';
      item.innerHTML = `<strong>${k.replace(/_/g, ' ')}</strong> — <span class='small'>${v}</span>`;
      dl.appendChild(item);
    });
    main.appendChild(dl);
    scoreVal.textContent = '-'; scoreMax.textContent = '-';
  }

  // ── BINDING ───────────────────────────────────────────────

  el('mode-quiz').onclick = startQuiz;
  el('mode-match').onclick = startMatch;
  el('mode-revision').onclick = startRevision;
  el('mode-flash').onclick = startFlash;
  el('show-defs').onclick = showAllDefs;
  updateActiveButton();
  startQuiz();
}

loadData();
