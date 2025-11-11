let DATA = {};
let QUIZ_QS = [];
let DEFINITIONS = {};
let CITATIONS = [];
let REMEDES = [];
let DESIRES = [];
let PHILOSOPHES_DEVOIR = [];
let PHILOSOPHES_ETAT = [];
let REPERES_DEFS = {};

// Fonction pour charger les données JSON
async function loadData() {
    try {
        // Afficher directement le modal de sélection des chapitres
        document.getElementById('chapter-selection').style.display = 'flex';
        console.log('Application initialisée - attente de la sélection des chapitres');
        
        // Charger les repères globaux (définitions non liées à un chapitre)
        try {
            const repRes = await fetch('reperes.json');
            if (repRes.ok) {
                const repData = await repRes.json();
                REPERES_DEFS = repData.definitions || {};
                console.log(`Repères chargés: ${Object.keys(REPERES_DEFS).length} définitions`);
            } else {
                console.warn('reperes.json introuvable ou inaccessible');
            }
        } catch (e) {
            console.warn('Impossible de charger reperes.json:', e);
        }
        
        // Initialiser l'application
        initializeApp();
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        document.getElementById('main').innerHTML = `
            <div class="question">Erreur d'initialisation</div>
            <div class="small" style="margin-top: 8px; color: var(--error);">
                Une erreur s'est produite lors du chargement de l'application.
            </div>
        `;
    }
}

async function loadChapterData(chapters) {
  // Reset all data arrays
  QUIZ_QS = [];
  DEFINITIONS = {};
  CITATIONS = [];
  REMEDES = [];
  DESIRES = [];
  PHILOSOPHES_DEVOIR = [];
  PHILOSOPHES_ETAT = [];
  
  // Load data for each selected chapter
  const chapterPromises = chapters.map(async chapter => {
    try {
      const response = await fetch(`chapitre_${chapter}.json`);
      if (!response.ok) throw new Error(`Chapter ${chapter} not found`);
      return response.json();
    } catch (error) {
      console.warn(`Could not load chapter ${chapter}:`, error);
      return null;
    }
  });
  
  const chapterData = await Promise.all(chapterPromises);
  
  // Combine data from all chapters
  chapterData.forEach((data, index) => {
    if (!data) return;
    
    const chapter = chapters[index];
    
    // Add quiz questions with chapter info
    if (data.quiz_questions) {
      QUIZ_QS.push(...data.quiz_questions.map(q => ({
        ...q,
        chapter: chapter
      })));
    }
    
    // Add definitions
        if (data.definitions) {
          Object.assign(DEFINITIONS, data.definitions);
        }
        
        // Add citations
        if (data.citations) {
          CITATIONS.push(...data.citations);
        }
        
        // Add chapter-specific data
        if (chapter === 'bonheur') {
          if (data.remedes) REMEDES.push(...data.remedes);
          if (data.desires) DESIRES.push(...data.desires);
        } else if (chapter === 'devoir') {
          if (data.philosophes) PHILOSOPHES_DEVOIR.push(...data.philosophes);
        } else if (chapter === 'etat') {
          if (data.philosophes) PHILOSOPHES_ETAT.push(...data.philosophes);
        }
  });
  
  // Fusionner les repères globaux dans les définitions disponibles
  if (REPERES_DEFS && typeof REPERES_DEFS === 'object') {
    Object.assign(DEFINITIONS, REPERES_DEFS);
  }

  // Check if we have enough questions
  if (QUIZ_QS.length < 5) {
    throw new Error('Pas assez de questions disponibles. Veuillez sélectionner plus de chapitres.');
  }
  
  console.log(`Loaded ${QUIZ_QS.length} questions from ${chapters.length} chapters`);
  
  return true; // Ajouter un retour explicite
}

function initializeApp() {
    // Chapter selection functionality
    const chapterModal = document.getElementById('chapter-selection');
    const mainContent = document.getElementById('main-content');
    const validateBtn = document.getElementById('validate-chapters');
    const warningMsg = document.getElementById('chapter-warning');
    
    // Handle chapter validation
    validateBtn.addEventListener('click', () => {
        const selectedChapters = Array.from(document.querySelectorAll('input[name="chapters"]:checked')).map(cb => cb.value);
        
        if (selectedChapters.length === 0) {
            warningMsg.textContent = 'Veuillez sélectionner au moins un chapitre.';
            return;
        }
        
        // Load data for selected chapters
        loadChapterData(selectedChapters).then(() => {
            chapterModal.style.display = 'none';
            mainContent.style.display = 'block';
            initializeQuizInterface();
        }).catch(error => {
            warningMsg.textContent = 'Erreur lors du chargement des données : ' + error.message;
        });
    });
    
    // Change chapters functionality
    document.getElementById('change-chapters').addEventListener('click', () => {
        chapterModal.style.display = 'flex';
        mainContent.style.display = 'none';
    });

    // Menu functionality
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const themeToggle = document.getElementById('theme-toggle');
    const contactBtn = document.getElementById('contact-btn');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-mode');
        const isLightMode = document.documentElement.classList.contains('light-mode');
        themeToggle.textContent = isLightMode ? '🌙 Mode Sombre' : '☀️ Mode Clair';
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        themeToggle.textContent = '🌙 Mode Sombre';
    }

    // Contact button (placeholder for now)
    contactBtn.addEventListener('click', () => {
        alert('Fonctionnalité "Me contacter" à implémenter !');
    });
}

function initializeQuizInterface() {
    const main = document.getElementById('main');
    const scoreVal = document.getElementById('score-val');
    const scoreMax = document.getElementById('score-max');
    const progress = document.getElementById('progress');
    const scoreWrap = document.getElementById('scoreWrap');

    let score = 0, maxQ = 0, currentMode = '';

function el(id){return document.getElementById(id)}
function randSort(a){return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1])}
function setMode(name){ currentMode = name; progress.textContent = 'Mode : ' + name; updateActiveButton(); }
function updateScore(){ scoreVal.textContent = score; scoreMax.textContent = maxQ; }
function updateActiveButton(){
    ['mode-quiz','mode-match','mode-revision','mode-flash','show-defs'].forEach(id=>{
    el(id).classList.remove('active');
    });
    if(currentMode==='Quiz') el('mode-quiz').classList.add('active');
    if(currentMode==='Association') el('mode-match').classList.add('active');
    if(currentMode.includes('Révision')) el('mode-revision').classList.add('active');
    if(currentMode==='Flashcards') el('mode-flash').classList.add('active');
    if(currentMode==='Toutes les définitions') el('show-defs').classList.add('active');
    scoreWrap.style.display = currentMode==='Flashcards' ? 'none' : 'block';
}
function showDefinitionBox(title,text){
    const box = document.createElement('div'); 
    box.className='defbox'; 
    box.innerHTML = `<strong>${title}</strong><div class='small' style='margin-top:6px'>${text}</div>`; 
    return box;
}
function normalizeText(text){
    return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function extractKeywords(text){
    const stopWords = ['le','la','les','un','une','des','de','du','ce','qui','que','est','sont','dans','sur','pour','par','avec','sans','sous','ou','et','à','a'];
    return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w));
}
function checkDefinitionMatch(userAnswer, correctDef){
    const userNorm = normalizeText(userAnswer);
    const correctNorm = normalizeText(correctDef);
    const userKeywords = extractKeywords(userAnswer);
    const correctKeywords = extractKeywords(correctDef);
    // Si la définition correcte est trop courte ou sans mots-clés, fallback à une inclusion des 10 premiers caractères
    if(correctKeywords.length === 0) return userNorm.includes(correctNorm.slice(0,10));
    // Comptage basé sur les tokens exacts (évite les faux positifs par sous-chaînes)
    const userSet = new Set(userKeywords);
    let matchCount = 0;
    for(const keyword of correctKeywords){
        if(userSet.has(keyword)) matchCount++;
    }
    // Règle d'acceptation : au moins 3 mots-clés ou 35% des mots-clés, plafonné à 6
    const required = Math.min(6, Math.max(3, Math.ceil(correctKeywords.length * 0.35)));
    return matchCount >= required;
}

function startQuiz(){
    setMode('Quiz'); score=0; 
    const order = randSort(QUIZ_QS.slice()); 
    maxQ = Math.min(20, order.length); 
    updateScore();
    let idx = 0;
    renderQuestion();

    function renderQuestion(){
    const item = order[idx];
    // Helper: underline work titles in options for "Qui a écrit :" questions
    function escapeHTML(str){
        return String(str)
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/\"/g,'&quot;')
            .replace(/'/g,'&#039;');
    }
    // Ne souligne les titres d'ouvrage que pour les questions "Qui a écrit ..."
    function formatOptionLabel(optText, highlightWork){
        if(highlightWork){
            const m = String(optText).match(/^(.*)\s*\(([^)]+)\)\s*$/);
            if(m){
                const author = escapeHTML(m[1]);
                const work = escapeHTML(m[2]);
                return `${author} (<span class="work">${work}</span>)`;
            }
        }
        return escapeHTML(optText);
    }
    main.innerHTML = '';
    const qdiv = document.createElement('div'); 
    qdiv.className='question'; 
    qdiv.textContent = `Q${idx+1}. ` + item.q; 
    main.appendChild(qdiv);

    const ans = document.createElement('div'); 
    ans.className='answers';

    const note = document.createElement('div'); 
    note.className='small'; 
    note.style.marginBottom='8px'; 
    note.textContent = item.multi? 'Réponse attendue : plusieurs (sélectionnez puis validez).':'Réponse attendue : une seule'; 
    main.appendChild(note);

    // Détecte si la question est de type auteur/ouvrage
    const highlightWork = /Qui\s+a\s+écrit/i.test(String(item.q));

    if(item.multi){
        // Support new schema with dynamic distractors: { corrects: [..], distractors: [..] }
        let optsMulti;
        let useDynamic = Array.isArray(item.corrects) && item.corrects.length > 0 && Array.isArray(item.distractors);
        if (useDynamic) {
            const need = Math.max(4 - item.corrects.length, 0);
            const sampled = randSort(item.distractors.slice()).slice(0, need);
            optsMulti = randSort([...item.corrects, ...sampled]).map(text => ({ text }));
        } else {
            // Legacy schema fallback with fixed opts and index array a
            optsMulti = randSort(item.opts.slice().map((opt, origIdx) => ({text: opt, origIdx})));
        }

        const selectedTexts = new Set();
        const selectedIdxs = new Set();

        optsMulti.forEach((optObj)=>{
        const btn = document.createElement('div'); 
        btn.className='answer'; 
        btn.innerHTML = formatOptionLabel(optObj.text, highlightWork); 
        if (!useDynamic) btn.dataset.origIdx = optObj.origIdx;
        btn.onclick = ()=>{
            if(btn.classList.contains('disabled')) return;
            if(btn.classList.contains('selected')){ 
            btn.classList.remove('selected'); 
            if (useDynamic) { selectedTexts.delete(optObj.text); } else { selectedIdxs.delete(optObj.origIdx); }
            } else { 
            btn.classList.add('selected'); 
            if (useDynamic) { selectedTexts.add(optObj.text); } else { selectedIdxs.add(optObj.origIdx); }
            }
        };
        ans.appendChild(btn);
        });
        main.appendChild(ans);

        const submit = document.createElement('button'); 
        submit.textContent='Valider'; 
        submit.className='primary';
        submit.style.marginTop='10px'; 
        submit.onclick = ()=>{
        let correct;
        if (useDynamic) {
            const correctSet = new Set(item.corrects);
            const selArr = Array.from(selectedTexts);
            correct = selArr.length === correctSet.size && selArr.every(t => correctSet.has(t));
        } else {
            const chosen = Array.from(selectedIdxs).sort((a,b)=>a-b);
            correct = JSON.stringify(chosen)===JSON.stringify(item.a);
        }

        Array.from(ans.children).forEach((c)=>{ 
            c.classList.add('disabled');
            if (useDynamic) {
                if (item.corrects.includes(c.textContent)) {
                    c.classList.add('correct');
                } else if (c.classList.contains('selected')) {
                    c.classList.add('wrong');
                }
            } else {
                const origIdx = parseInt(c.dataset.origIdx);
                if(item.a.includes(origIdx)){
                    c.classList.add('correct');
                } else if(c.classList.contains('selected')){
                    c.classList.add('wrong');
                }
            }
        });

        submit.disabled = true;
        if(correct){ score++; updateScore(); }

        const rel = item.defKey ? {title:item.defKey.replace(/_/g,' '),text:DEFINITIONS[item.defKey]} : (item.defText?{title:'Explication',text:item.defText}:null);
        if(rel) main.appendChild(showDefinitionBox(rel.title,rel.text));

        const nextBtn = document.createElement('button'); 
        nextBtn.textContent='Question suivante'; 
        nextBtn.className='primary';
        nextBtn.style.marginTop='10px'; 
        nextBtn.onclick = ()=>{ idx++; if(idx<maxQ) renderQuestion(); else showResults(); };
        main.appendChild(nextBtn);
        };
        main.appendChild(submit);

    } else {
        // Build options from per-question distractor pool if available
        let opts;
        let correctIndex;
        if (item.correct && Array.isArray(item.distractors) && item.distractors.length >= 3) {
            const pool = item.distractors.slice();
            // sample 3 distinct distractors
            const sampled = randSort(pool).slice(0, 3);
            opts = randSort([item.correct, ...sampled]);
            correctIndex = opts.indexOf(item.correct);
        } else {
            // fallback to legacy static options
            opts = randSort(item.opts.slice());
            correctIndex = item.a;
        }

        opts.forEach(opt=>{
        const btn = document.createElement('div'); 
        btn.className='answer'; 
        btn.innerHTML = formatOptionLabel(opt, highlightWork); 
        btn.onclick = ()=>{
            if(btn.classList.contains('disabled')) return;
            
            // determine indices according to structure
            let chosenIndex, isCorrect;
            if (item.correct && Array.isArray(item.distractors)) {
                chosenIndex = opts.indexOf(opt);
                isCorrect = chosenIndex === correctIndex;
            } else {
                chosenIndex = item.opts.indexOf(opt);
                isCorrect = chosenIndex === item.a;
            }
            
            Array.from(ans.children).forEach(c=>{
            c.classList.add('disabled');
            if (item.correct && Array.isArray(item.distractors)) {
                if (c.textContent === item.correct) c.classList.add('correct');
            } else {
                const cIndex = item.opts.indexOf(c.textContent);
                if(cIndex === item.a) c.classList.add('correct');
            }
            });
            
            if(isCorrect){ score++; updateScore(); }
            else btn.classList.add('wrong');
            
            const rel = item.defKey? {title:item.defKey.replace(/_/g,' '), text:DEFINITIONS[item.defKey]} : (item.defText?{title:'Explication',text:item.defText}: null);
            if(rel) main.appendChild(showDefinitionBox(rel.title,rel.text));
            
            const nextBtn = document.createElement('button'); 
            nextBtn.textContent='Question suivante'; 
            nextBtn.className='primary';
            nextBtn.style.marginTop='10px'; 
            nextBtn.onclick = ()=>{ idx++; if(idx<maxQ) renderQuestion(); else showResults(); };
            main.appendChild(nextBtn);
        };
        ans.appendChild(btn);
        });
        main.appendChild(ans);
    }
    }

    function showResults(){
    main.innerHTML = `<div class='question'>Terminé — Résultat : ${score}/${maxQ}</div>` +
        `<div class='small' style='margin-top:8px'>Recharge le mode pour rejouer.</div>`;
    }
}

function startMatch(){
    setMode('Association'); score=0;
    const entries = Object.entries(DEFINITIONS);
    const pairs = entries.slice(0,18);
    maxQ = pairs.length; updateScore();

    const leftKeys = randSort(pairs.map(d=>d[0]));
    const rightObjs = randSort(pairs.map(d=>({key:d[0],def:d[1]})));

    main.innerHTML = '';
    const inst = document.createElement('div'); 
    inst.className='small'; 
    inst.textContent='Clique sur un terme (gauche) puis sur sa définition (droite).'; 
    main.appendChild(inst);
    const grid = document.createElement('div'); 
    grid.className='match-grid'; 
    grid.style.marginTop='10px';

    const leftCol = document.createElement('div');
    leftKeys.forEach(key=>{
    const c = document.createElement('div'); 
    c.className='card'; 
    c.textContent = key.replace(/_/g,' '); 
    c.dataset.key = key; 
    c.dataset.locked = 'false';
    c.onclick = ()=>{
        if(c.dataset.locked==='true') return;
        Array.from(leftCol.children).forEach(x=>x.style.boxShadow='none'); 
        c.style.boxShadow='inset 0 0 0 2px rgba(125,211,252,0.5)'; 
        main.dataset.selectedLeft = key;
    };
    leftCol.appendChild(c);
    });

    const rightCol = document.createElement('div');
    rightObjs.forEach(obj=>{
    const c = document.createElement('div'); 
    c.className='card'; 
    c.textContent = obj.def; 
    c.dataset.key = obj.key; 
    c.dataset.locked = 'false';
    c.onclick = ()=>{
        const leftKey = main.dataset.selectedLeft;
        if(!leftKey) return alert('Sélectionne d\'abord un terme à gauche.');
        if(c.dataset.locked==='true') return;
        const correct = leftKey === c.dataset.key;
        if(correct){
        c.dataset.locked='true'; 
        c.classList.add('locked');
        const leftEl = Array.from(leftCol.children).find(x=>x.dataset.key===leftKey);
        if(leftEl){ 
            leftEl.dataset.locked='true'; 
            leftEl.classList.add('locked'); 
            leftEl.style.boxShadow='none';
        }
        score++; 
        updateScore(); 
        main.dataset.selectedLeft = '';
        if(score>=maxQ) main.innerHTML = `<div class='question'>Bravo ! ${score}/${maxQ}</div>`; 
        } else {
        c.style.border='2px solid var(--error)'; 
        setTimeout(()=>c.style.border='1px dashed rgba(255,255,255,0.04)',600); 
        main.dataset.selectedLeft = '';
        }
    };
    rightCol.appendChild(c);
    });

    grid.appendChild(leftCol); 
    grid.appendChild(rightCol); 
    main.appendChild(grid);
}

function startRevision(){
    main.innerHTML = '';
    const title = document.createElement('div');
    title.className = 'question';
    title.textContent = 'Mode Révision — Choisis ta difficulté';
    main.appendChild(title);

    const info = document.createElement('div');
    info.className = 'small';
    info.style.marginBottom = '12px';
    info.innerHTML = `
    <strong>Facile :</strong> Définition → Mot<br>
    <strong>Moyen :</strong> Majorité facile + quelques difficiles<br>
    <strong>Difficile :</strong> Mot → Définition
    `;
    main.appendChild(info);

    const selector = document.createElement('div');
    selector.className = 'difficulty-selector';

    ['Facile', 'Moyen', 'Difficile'].forEach((name, i) => {
    const btn = document.createElement('div');
    btn.className = 'difficulty-btn';
    btn.textContent = name;
    btn.onclick = () => startRevisionQuestions(['easy','medium','hard'][i]);
    selector.appendChild(btn);
    });

    main.appendChild(selector);
}

function startRevisionQuestions(difficulty){
    setMode('Révision — ' + (difficulty==='easy'?'Facile':difficulty==='medium'?'Moyen':'Difficile'));
    score = 0;
    const allTerms = Object.entries(DEFINITIONS);
    const terms = randSort(allTerms).slice(0, 10);
    maxQ = terms.length;
    updateScore();
    let idx = 0;
    renderRevisionQuestion();

    function renderRevisionQuestion(){
    const [term, def] = terms[idx];
    main.innerHTML = '';
    
    let isEasyMode = true;
    if(difficulty === 'hard'){
        isEasyMode = false;
    } else if(difficulty === 'medium'){
        isEasyMode = Math.random() > 0.3;
    }

    const qdiv = document.createElement('div');
    qdiv.className = 'question';
    qdiv.textContent = `Q${idx+1}/${maxQ}`;
    main.appendChild(qdiv);

    if(isEasyMode){
        const defDiv = document.createElement('div');
        defDiv.style.marginTop = '12px';
        defDiv.style.padding = '12px';
        defDiv.style.background = 'rgba(255,255,255,0.03)';
        defDiv.style.borderRadius = '8px';
        defDiv.innerHTML = `<strong>Définition :</strong><br>${def}`;
        main.appendChild(defDiv);

        const instruction = document.createElement('div');
        instruction.className = 'small';
        instruction.style.marginTop = '12px';
        instruction.textContent = 'Quel est le terme correspondant ?';
        main.appendChild(instruction);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ta réponse...';
        input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && !input.disabled) submitBtn.click();
        });
        main.appendChild(input);

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Valider';
        submitBtn.className = 'primary';
        submitBtn.style.marginTop = '10px';
        submitBtn.onclick = () => {
        if(!input.value.trim()) return;
        const userAnswer = normalizeText(input.value);
        const correctAnswer = normalizeText(term);
        const correct = userAnswer === correctAnswer || 
                        (userAnswer.length > 2 && correctAnswer.includes(userAnswer)) || 
                        (correctAnswer.length > 2 && userAnswer.includes(correctAnswer));

        input.disabled = true;
        submitBtn.disabled = true;
        submitBtn.style.display = 'none';

        const feedback = document.createElement('div');
        feedback.className = 'feedback ' + (correct ? 'correct' : 'wrong');
        
        if(correct){
            feedback.innerHTML = `<strong>✓ Correct !</strong><br>Ta réponse : <em>${input.value}</em><br>Le terme est bien : <strong>${term.replace(/_/g, ' ')}</strong>`;
            score++;
            updateScore();
        } else {
            feedback.innerHTML = `<strong>✗ Incorrect</strong><br>Ta réponse : <em>${input.value}</em><br>Le terme correct est : <strong>${term.replace(/_/g, ' ')}</strong>`;
        }
        main.appendChild(feedback);
        
        const defBox = showDefinitionBox('Définition', def);
        main.appendChild(defBox);

        const nextBtn = document.createElement('button');
        nextBtn.textContent = idx+1 < maxQ ? 'Question suivante (Entrée)' : 'Voir les résultats (Entrée)';
        nextBtn.className = 'primary';
        nextBtn.style.marginTop = '10px';
        nextBtn.addEventListener('click', goNext);
        document.addEventListener('keypress', handleEnter);
        function handleEnter(e){
            if(e.key === 'Enter'){
            document.removeEventListener('keypress', handleEnter);
            goNext();
            }
        }
        function goNext(){
            document.removeEventListener('keypress', handleEnter);
            idx++;
            if(idx < maxQ) renderRevisionQuestion();
            else showRevisionResults();
        }
        main.appendChild(nextBtn);
        nextBtn.focus();
        };
        main.appendChild(submitBtn);
        input.focus();

    } else {
        const termDiv = document.createElement('div');
        termDiv.style.marginTop = '12px';
        termDiv.style.padding = '12px';
        termDiv.style.background = 'rgba(255,255,255,0.03)';
        termDiv.style.borderRadius = '8px';
        termDiv.innerHTML = `<strong>Terme :</strong> ${term.replace(/_/g, ' ')}`;
        main.appendChild(termDiv);

        const instruction = document.createElement('div');
        instruction.className = 'small';
        instruction.style.marginTop = '12px';
        instruction.textContent = 'Donne la définition (les mots-clés principaux suffisent) :';
        main.appendChild(instruction);

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Ta définition...';
        textarea.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && e.ctrlKey && !textarea.disabled) submitBtn.click();
        });
        main.appendChild(textarea);

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Valider (Ctrl+Entrée)';
        submitBtn.className = 'primary';
        submitBtn.style.marginTop = '10px';
        submitBtn.onclick = () => {
        if(!textarea.value.trim()) return;
        const correct = checkDefinitionMatch(textarea.value, def);

        textarea.disabled = true;
        submitBtn.disabled = true;
        submitBtn.style.display = 'none';

        const feedback = document.createElement('div');
        feedback.className = 'feedback ' + (correct ? 'correct' : 'wrong');
        
        if(correct){
            feedback.innerHTML = `<strong>✓ Bonne définition !</strong>`;
            score++;
            updateScore();
        } else {
            feedback.innerHTML = `<strong>✗ Définition incomplète ou incorrecte</strong>`;
        }
        main.appendChild(feedback);
        
        const userBox = document.createElement('div');
        userBox.style.marginTop = '8px';
        userBox.style.padding = '10px';
        userBox.style.background = 'rgba(255,255,255,0.02)';
        userBox.style.borderRadius = '8px';
        userBox.innerHTML = `<strong>Ta réponse :</strong><br><em>${textarea.value}</em>`;
        main.appendChild(userBox);
        
        const correctBox = document.createElement('div');
        correctBox.style.marginTop = '8px';
        correctBox.style.padding = '10px';
        correctBox.style.background = 'rgba(16,185,129,0.05)';
        correctBox.style.border = '1px solid rgba(16,185,129,0.3)';
        correctBox.style.borderRadius = '8px';
        correctBox.innerHTML = `<strong>Définition attendue :</strong><br><em>${def}</em>`;
        main.appendChild(correctBox);

        const nextBtn = document.createElement('button');
        nextBtn.textContent = idx+1 < maxQ ? 'Question suivante (Entrée)' : 'Voir les résultats (Entrée)';
        nextBtn.className = 'primary';
        nextBtn.style.marginTop = '10px';
        nextBtn.addEventListener('click', goNext);
        document.addEventListener('keypress', handleEnter);
        function handleEnter(e){
            if(e.key === 'Enter'){
            document.removeEventListener('keypress', handleEnter);
            goNext();
            }
        }
        function goNext(){
            document.removeEventListener('keypress', handleEnter);
            idx++;
            if(idx < maxQ) renderRevisionQuestion();
            else showRevisionResults();
        }
        main.appendChild(nextBtn);
        nextBtn.focus();
        };
        main.appendChild(submitBtn);
        textarea.focus();
    }
    }

    function showRevisionResults(){
    main.innerHTML = `<div class='question'>Terminé — Résultat : ${score}/${maxQ}</div>` +
        `<div class='small' style='margin-top:8px'>Excellent travail ! Recommence pour t'améliorer.</div>`;
    }
}

function startFlash(){
    setMode('Flashcards'); 
    score=0; 
    const keys = Object.keys(DEFINITIONS); 
    const order = randSort(keys); 
    let idx=0; 
    maxQ = keys.length; 
    updateScore();
    renderCard();

    function renderCard(){
    main.innerHTML = '';
    const k = order[idx];
    const card = document.createElement('div'); 
    card.className='flash'; 
    card.textContent = k.replace(/_/g,' '); 
    main.appendChild(card);
    const btns = document.createElement('div'); 
    btns.style.marginTop='12px';
    const prev = document.createElement('button'); 
    prev.textContent='Précédent'; 
    prev.onclick = ()=>{ if(idx>0){ idx--; renderCard(); } };
    const show = document.createElement('button'); 
    show.textContent='Afficher la définition'; 
    show.className='primary';
    show.style.marginLeft='8px'; 
    let showingDef = false;
    show.onclick = ()=>{ 
      if(!showingDef){
        card.textContent = DEFINITIONS[k]; 
        show.textContent = 'Cacher la définition';
        showingDef = true;
      } else {
        card.textContent = k.replace(/_/g,' ');
        show.textContent = 'Afficher la définition';
        showingDef = false;
      }
    };
    const next = document.createElement('button'); 
    next.textContent='Suivant'; 
    next.style.marginLeft='8px'; 
    next.onclick = ()=>{ if(idx+1>=order.length) main.innerHTML = `<div class='question'>Fin des flashcards</div>`; else { idx++; renderCard(); } };
    btns.appendChild(prev); 
    btns.appendChild(show); 
    btns.appendChild(next); 
    main.appendChild(btns);
    }
}

function showAllDefs(){ 
    setMode('Toutes les définitions'); 
    main.innerHTML=''; 
    const dl = document.createElement('div');
    Object.entries(DEFINITIONS).forEach(([k,v])=>{ 
    const el = document.createElement('div'); 
    el.style.marginBottom='10px'; 
    el.innerHTML = `<strong>${k.replace(/_/g,' ')}</strong> — <span class='small'>${v}</span>`; 
    dl.appendChild(el); 
    });
    main.appendChild(dl);
    scoreVal.textContent = '-'; 
    scoreMax.textContent = '-';
}

    document.getElementById('mode-quiz').onclick = startQuiz;
    document.getElementById('mode-match').onclick = startMatch;
    document.getElementById('mode-revision').onclick = startRevision;
    document.getElementById('mode-flash').onclick = startFlash;
    document.getElementById('show-defs').onclick = showAllDefs;

    updateActiveButton();
    startQuiz();
}

// Charger les données au démarrage
loadData();