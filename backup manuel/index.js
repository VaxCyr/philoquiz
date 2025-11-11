const DATA = {
    definitions: {
        bonheur: "Ce qui nous satisfait.",
        devoir: "Impératif de conscience imposant d'accomplir ce qui est prescrit par une obligation religieuse, morale ou légale.",
        etat: "Autorité instituée sur un plan juridique et politique — fonctions : juridique (représentation), politique (pouvoir), administrative (gestion).",
        absolu: 'Ne dépend de rien d\'autre',
        relatif: 'Dépend ou est limité par autre chose',
        contingent: 'Ce qui peut ou aurait pu être autrement',
        necessaire: 'Ce qui ne peut pas ne pas être',
        en_fait: 'Ce qui est',
        en_droit: 'Ce qui devrait être',
        contrainte: 'Injonction accompagnée de l\'usage d\'une force imposant l\'obéissance',
        obligation: 'Injonction perçue comme émanant d\'une autorité légitime',
        transcendant: 'Dépasse les limites naturelles d\'un objet',
        immanent: 'Contenu dans les limites naturelles d\'un objet',
        en_acte: 'Achevé / accompli',
        en_puissance: 'Accomplissement potentiel',
        universel: 'S\'applique à tous les cas',
        general: 'S\'applique à la plupart des cas',
        particulier: 'S\'applique à un nombre limité de cas',
        singulier: 'S\'applique à un seul cas'
    },

    remedes: [
        "Ne pas avoir peur de Dieu (ils sont parfaits donc désintéressés de nous)",
        "Ne pas craindre la mort (si vivant alors pas mort, et si mort alors pas vivant)",
        "Il est possible d'être heureux (plaisirs)",
        "Il est possible de supporter la douleur (car elle est limitée)"
    ],

    desires: [
        "Naturels et nécessaires (il faut)",
        "Naturels et non nécessaires (on peut)",
        "Non naturels et non nécessaires (on ne doit pas)"
    ],

    citations: [
        {
            auteur: "B. Pascal",
            oeuvre: "Pensées",
            citation: "Nous ne nous tenons jamais au temps présent. Nous anticipons l'avenir comme trop lent à venir, [...] ou nous rappelons le passé pour l'arrêter comme trop prompt [...]."
        },
        {
            auteur: "Alain",
            oeuvre: "Propos",
            citation: "Dès qu'un homme cherche le bonheur, il est condamné à ne pas le trouver [...]."
        }
        ],

        philosophes_devoir: [
            {nom: "Zénon", courant: "Stoïcien"},
            {nom: "Jeremy Bentham", courant: "Utilitariste"},
            {nom: "Kant", oeuvre: "Fondement de la métaphysique des mœurs", idee: "Action bonne si intention bonne. Bonne volonté = agir par devoir, non par contrainte ni intérêt"},
            {nom: "É. Durkheim", oeuvre: "L'Éducation morale", idee: "Quand notre conscience parle, c'est la société qui parle en nous. Conscience morale = intériorisation de la contrainte sociale"}
        ],

        philosophes_etat: [
            {nom: "Aristote", oeuvre: "Politique", idee: "1) Réponse factuelle : comme animaux grégaires, les hommes s'unissent pour répondre à leurs besoins. 2) Réponse métaphysique : pour bien vivre"},
            {nom: "Hobbes", oeuvre: "Le Citoyen", idee: "État de nature → Contrat social → État de société. Guerre tous contre tous → Fin de la guerre. Selon Hobbes, la nature pousse les hommes à s'opposer"}
    ]
};

const QUIZ_QS = [
    {q: "Quelle formulation correspond à la définition du bonheur donnée dans le cours ?", opts:["Ce qui nous satisfait","Un état de joie permanente","La suppression des devoirs","Une récompense divine"], a:0, defKey:'bonheur'},
    {q: "Quelle formulation décrit le devoir ?", opts:["Impératif de conscience imposant d'accomplir ce qui est prescrit","Une simple suggestion sociale","Un plaisir partagé","Une contrainte physique"], a:0, defKey:'devoir'},
    {q: "Parmi ces fonctions, laquelle NE fait PAS partie des fonctions de l'État ?", opts:["Religieuse (sauver les âmes)","Juridique (représentation)","Politique (pouvoir)","Administrative (gestion)"], a:0, defText:'L\'État a 3 fonctions selon le cours : juridique (représentation), politique (pouvoir) et administrative (gestion). Il n\'a pas de fonction religieuse.'},
    {q: "Que signifie 'contingent' dans les repères ?", opts:["Ce qui peut ou aurait pu être autrement","Ce qui ne peut pas ne pas être","Ce qui dépasse les limites naturelles","Ce qui est universel"], a:0, defKey:'contingent'},
    {q: "Lequel de ces remèdes contre le malheur n'est PAS dans le cours ?", opts:["S'isoler complètement","Ne pas avoir peur de Dieu","Ne pas craindre la mort","Il est possible de supporter la douleur"], a:0, defText:'Les 4 remèdes sont : 1) Ne pas avoir peur de Dieu, 2) Ne pas craindre la mort, 3) Il est possible d\'être heureux, 4) Il est possible de supporter la douleur.'},
    {q: "Quel philosophe est associé à l'utilitarisme dans le cours ?", opts:["Jeremy Bentham","Kant","Zénon","Aristote"], a:0, defText:'Jeremy Bentham est le représentant de l\'utilitarisme (doctrine qui considère l\'utilité comme principe du bien).'},
    {q: "Qui a écrit : 'Nous ne nous tenons jamais au temps présent' ?", opts:["B. Pascal (Pensées)","Alain (Propos)","Durkheim","Hobbes"], a:0, defText:'Citation de Blaise Pascal dans les Pensées. Pascal critique notre incapacité à vivre le présent : on anticipe l\'avenir ou on rappelle le passé.'},
    {q: "Selon Durkheim, qu'est-ce que la conscience morale ?", opts:["La société qui parle en nous","Un instinct individuel","Un choix purement religieux","Une conséquence biologique"], a:0, defText:'Durkheim : "Quand notre conscience parle, c\'est la société qui parle en nous." Notre conscience morale est une intériorisation de la contrainte sociale.'},
    {q: "Que soutient Hobbes sur l'état de nature ?", opts:["Une guerre de tous contre tous","Les hommes y sont naturellement altruistes","La société y est superflue","La politique doit être religieuse"], a:0, defText:'Hobbes décrit l\'état de nature comme une guerre de tous contre tous. Selon lui, la nature pousse les hommes à s\'opposer (l\'homme est un loup pour l\'homme).'},
    {q: "Que signifie 'en droit' dans les repères ?", opts:["Ce qui devrait être","Ce qui est","Ce qui dépend d'autre chose","Ce qui ne peut pas ne pas être"], a:0, defText:'En droit = ce qui devrait être (normatif) / En fait = ce qui est (descriptif).'},
    {q: "Que signifie 'transcendant' ?", opts:["Dépasse les limites naturelles d'un objet","Contenu dans les limites naturelles","Applicable à un seul cas","Relatif à d'autres choses"], a:0, defText:'Transcendant = dépasse les limites naturelles / Immanent = contenu dans les limites naturelles.'},
    {q: "Parmi ces éléments, lequel est un remède contre le malheur ?", opts:["Il est possible d'être heureux (plaisirs)","Chercher la vengeance","Ignorer sa conscience","S'en remettre au hasard"], a:0, defText:'Troisième remède : Il est possible d\'être heureux grâce aux plaisirs.'},
    {q: "Que signifie 'universel' dans le cours ?", opts:["S'applique à tous les cas","S'applique à la plupart des cas","S'applique à un nombre limité de cas","S'applique à un seul cas"], a:0, defText:'Universel → tous les cas / Général → la plupart / Particulier → nombre limité / Singulier → un seul cas.'},
    {q: "Quelle est la différence entre 'contrainte' et 'obligation' ?", opts:["Contrainte = usage de la force / Obligation = autorité légitime","Ce sont des synonymes","Contrainte = morale / Obligation = physique","Contrainte = sociale / Obligation = individuelle"], a:0, defText:'Contrainte : injonction accompagnée de l\'usage d\'une FORCE imposant l\'obéissance. Obligation : quand on considère que l\'injonction émane d\'une AUTORITÉ LÉGITIME.'},
    {q: "Quel stoïcien est cité en lien avec le devoir ?", opts:["Zénon","Kant","Bentham","Aristote"], a:0, defText:'Zénon est le philosophe stoïcien cité. Le stoïcisme prône l\'acceptation du destin et la maîtrise des passions.'},
    {q: "Que signifie 'en acte' ?", opts:["Achevé / accompli","Accomplissement potentiel","Ce qui peut être autrement","Dépendant d'autres choses"], a:0, defText:'En acte = achevé/accompli / En puissance = accomplissement potentiel.'},
    {q: "Quelle phrase est attribuée à Alain dans le cours ?", opts:["Dès qu'un homme cherche le bonheur, il est condamné à ne pas le trouver","Le devoir est une contrainte physique","L'État naît de la mort","La conscience est biologique"], a:0, defText:'Citation d\'Alain dans les Propos. Alain suggère qu\'on ne peut atteindre le bonheur en le cherchant directement.'},
    {q: "Combien y a-t-il de types de désirs listés dans le cours ?", opts:["3 types","2 types","4 types","5 types"], a:0, defText:'3 types : 1) Naturels et nécessaires (il faut), 2) Naturels et non nécessaires (on peut), 3) Non naturels et non nécessaires (on ne doit pas).'},
    {q: "Que signifie 'immanent' ?", opts:["Contenu dans les limites naturelles d'un objet","Dépasse les limites naturelles","Ce qui ne peut pas ne pas être","Applicable à tous les cas"], a:0, defText:'Immanent = contenu dans les limites naturelles / Transcendant = dépasse ces limites.'},
    {q: "Selon Aristote, pourquoi les hommes se réunissent-ils ?", opts:["Pour répondre à leurs besoins et bien vivre","Par contrainte divine","Pour fuir la nature hostile","Par instinct de domination"], a:0, defText:'Aristote donne 2 réponses : 1) Factuelle : comme d\'autres animaux grégaires, pour répondre à leurs besoins. 2) Métaphysique : pour "bien vivre".'},
    {q: "Parmi ces repères, lesquels forment une paire d'opposés ?", opts:["Absolu","Relatif","Contingent","Nécessaire"], a:[0,1], multi:true, defText:'Absolu (ne dépend de rien) ≠ Relatif (dépend d\'autre chose). Autre paire : Contingent (peut être autrement) ≠ Nécessaire (ne peut pas ne pas être).'},
    {q: "Quel concept signifie 'accomplissement potentiel' ?", opts:["En puissance","En acte","Universel","Singulier"], a:0, defText:'En puissance = accomplissement potentiel / En acte = achevé, accompli.'},
    {q: "Quelle description correspond à 'particulier' ?", opts:["S'applique à un nombre limité de cas","S'applique à tous les cas","S'applique à la plupart des cas","S'applique à un seul cas"], a:0, defText:'Universel → tous / Général → la plupart / Particulier → nombre limité / Singulier → un seul.'},
    {q: "Que dit Kant sur la bonne volonté ?", opts:["Agir par devoir, non par contrainte ni intérêt","Agir uniquement par intérêt personnel","Le devoir est inutile","La bonne volonté n'existe pas"], a:0, defText:'Pour Kant : 1) Une action est bonne si l\'intention est bonne. 2) La bonne volonté = agir conformément au devoir ET agir par devoir (non par contrainte ou intérêt).'},
    {q: "Que signifie 'nécessaire' ?", opts:["Ce qui ne peut pas ne pas être","Ce qui peut être autrement","Ce qui dépend d'autre chose","Ce qui est universel"], a:0, defText:'Nécessaire = ce qui ne peut pas ne pas être / Contingent = ce qui peut ou aurait pu être autrement.'},
    {q: "Quel philosophe a théorisé le passage de l'état de nature au contrat social ?", opts:["Hobbes","Aristote","Pascal","Alain"], a:0, defText:'Hobbes : État de nature (guerre de tous contre tous) → Contrat social → État de société (fin de la guerre). La vie en société n\'est pas naturelle mais conventionnelle.'},
    {q: "Que signifie 'général' dans les repères ?", opts:["S'applique à la plupart des cas","S'applique à tous les cas","S'applique à un seul cas","Ne s'applique à aucun cas"], a:0, defText:'Universel → tous / Général → la plupart / Particulier → limité / Singulier → un seul.'},
    {q: "Quel remède contre le malheur concerne Dieu ?", opts:["Ne pas avoir peur de Dieu (ils sont parfaits donc désintéressés)","Prier constamment","Craindre le jugement divin","Ignorer son existence"], a:0, defText:'1er remède : Ne pas avoir peur de Dieu car ils sont parfaits donc désintéressés de nous.'},
    {q: "Selon Kant, une action est bonne si :", opts:["L'intention est bonne","Le résultat est bon","Elle procure du plaisir","Elle est approuvée par tous"], a:0, defText:'Pour Kant : une action est bonne si l\'intention est bonne (et non si le résultat est bon).'},
    {q: "Que signifie 'en fait' dans les repères ?", opts:["Ce qui est (réalité)","Ce qui devrait être (norme)","Ce qui peut être","Ce qui ne peut pas être"], a:0, defText:'En fait = ce qui est (descriptif) / En droit = ce qui devrait être (normatif).'},
    {q: "Selon le cours, quel type de désir faut-il éviter ?", opts:["Non naturels et non nécessaires","Naturels et nécessaires","Naturels et non nécessaires","Tous les désirs"], a:0, defText:'Non naturels et non nécessaires = on ne doit pas / Naturels et nécessaires = il faut / Naturels et non nécessaires = on peut.'}
];

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
    if(correctKeywords.length === 0) return userNorm.includes(correctNorm.slice(0,10));
    let matchCount = 0;
    for(const keyword of correctKeywords){
    if(userNorm.includes(keyword)) matchCount++;
    }
    return matchCount / correctKeywords.length >= 0.5;
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

    if(item.multi){
        const opts = randSort(item.opts.slice().map((opt, origIdx) => ({text: opt, origIdx})));
        const selected = new Set();
        
        opts.forEach((optObj)=>{
        const btn = document.createElement('div'); 
        btn.className='answer'; 
        btn.textContent = optObj.text; 
        btn.dataset.origIdx = optObj.origIdx;
        btn.onclick = ()=>{
            if(btn.classList.contains('disabled')) return;
            if(btn.classList.contains('selected')){ 
            btn.classList.remove('selected'); 
            selected.delete(optObj.origIdx); 
            } else { 
            btn.classList.add('selected'); 
            selected.add(optObj.origIdx); 
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
        const chosen = Array.from(selected).sort((a,b)=>a-b);
        const correct = JSON.stringify(chosen)===JSON.stringify(item.a);
        
        Array.from(ans.children).forEach((c)=>{ 
            const origIdx = parseInt(c.dataset.origIdx);
            c.classList.add('disabled');
            if(item.a.includes(origIdx)){
            c.classList.add('correct');
            } else if(c.classList.contains('selected')){
            c.classList.add('wrong');
            }
        });
        
        submit.disabled = true;
        if(correct){ score++; updateScore(); }
        
        const rel = item.defKey ? {title:item.defKey.replace(/_/g,' '),text:DATA.definitions[item.defKey]} : (item.defText?{title:'Explication',text:item.defText}:null);
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
        const opts = randSort(item.opts.slice());
        opts.forEach(opt=>{
        const btn = document.createElement('div'); 
        btn.className='answer'; 
        btn.textContent = opt; 
        btn.onclick = ()=>{
            if(btn.classList.contains('disabled')) return;
            
            const chosenIndex = item.opts.indexOf(opt);
            const correct = chosenIndex===item.a;
            
            Array.from(ans.children).forEach(c=>{
            c.classList.add('disabled');
            const cIndex = item.opts.indexOf(c.textContent);
            if(cIndex === item.a) c.classList.add('correct');
            });
            
            if(correct){ score++; updateScore(); }
            else btn.classList.add('wrong');
            
            const rel = item.defKey? {title:item.defKey.replace(/_/g,' '), text:DATA.definitions[item.defKey]} : (item.defText?{title:'Explication',text:item.defText}: null);
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
    const entries = Object.entries(DATA.definitions);
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
    const allTerms = Object.entries(DATA.definitions);
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
    const keys = Object.keys(DATA.definitions); 
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
    show.onclick = ()=>{ card.textContent = DATA.definitions[k]; };
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
    Object.entries(DATA.definitions).forEach(([k,v])=>{ 
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