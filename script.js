/* DADOS */
const roles = {
  director:    { label: "Diretora",     name: "Helena Santos",    subtitle: "Direção escolar",            initials: "HS" },
  coordinator: { label: "Coordenadora", name: "Marina Costa",     subtitle: "Coordenação pedagógica",     initials: "MC" },
  secretary:   { label: "Secretário",   name: "Lucas Rocha",      subtitle: "Secretaria escolar",         initials: "LR" },
  teacher:     { label: "Professor",    name: "Paulo Mendes",     subtitle: "Professor · 6º Ano A",       initials: "PM" },
  student:     { label: "Aluna",        name: "Ana Clara Souza",  subtitle: "Aluna · 6º Ano A",           initials: "AC" },
};

const accounts = [
  { username: "diretora@horizonte.edu",    role: "director"    },
  { username: "coordenacao@horizonte.edu", role: "coordinator" },
  { username: "secretaria@horizonte.edu",  role: "secretary"   },
  { username: "professor@horizonte.edu",   role: "teacher"     },
  { username: "2024001",                   role: "student"     },
];

const pages = [
  { id: "inicio",     label: "Início",     icon: "home"     },
  { id: "alunos",     label: "Alunos",     icon: "users"    },
  { id: "turmas",     label: "Turmas",     icon: "class"    },
  { id: "avaliacoes", label: "Avaliações", icon: "test"     },
  { id: "notas",      label: "Notas",      icon: "grade"    },
  { id: "frequencia", label: "Frequência", icon: "check"    },
  { id: "desempenho", label: "Desempenho", icon: "chart"    },
];

const access = {
  director:    pages.map(p => p.id),
  coordinator: pages.map(p => p.id),
  secretary:   ["inicio","alunos","turmas","frequencia"],
  teacher:     pages.map(p => p.id),
  student:     ["notas","frequencia"],
};

let students = [
  { name: "Ana Clara Souza",     registration: "2024001", className: "6º Ano A", initials: "AC", tone: "green"  },
  { name: "Bruno Henrique Lima", registration: "2024002", className: "6º Ano A", initials: "BH", tone: "blue"   },
  { name: "Camila Oliveira",     registration: "2024003", className: "7º Ano B", initials: "CO", tone: "yellow" },
  { name: "Diego Martins",       registration: "2024004", className: "8º Ano A", initials: "DM", tone: "purple" },
  { name: "Elisa Ferreira",      registration: "2024005", className: "9º Ano A", initials: "EF", tone: "pink"   },
  { name: "Felipe Almeida",      registration: "2024006", className: "7º Ano B", initials: "FA", tone: "orange" },
];

const classes = [
  { name: "6º Ano A", period: "Manhã", students: 28, teacher: "Mariana Costa", tone: "green"  },
  { name: "7º Ano B", period: "Manhã", students: 31, teacher: "Paulo Mendes",  tone: "blue"   },
  { name: "8º Ano A", period: "Tarde", students: 26, teacher: "Renata Alves",  tone: "yellow" },
  { name: "9º Ano A", period: "Tarde", students: 29, teacher: "João Batista",  tone: "purple" },
];

const evaluations = [
  { name: "Avaliação Bimestral I", subject: "Matemática",       className: "6º Ano A", date: "18 mar. 2025", tone: "green"  },
  { name: "Produção Textual",       subject: "Língua Portuguesa", className: "7º Ano B", date: "20 mar. 2025", tone: "blue"   },
  { name: "Trabalho de Ciências",   subject: "Ciências",          className: "8º Ano A", date: "24 mar. 2025", tone: "yellow" },
  { name: "Avaliação Bimestral I", subject: "História",           className: "9º Ano A", date: "27 mar. 2025", tone: "purple" },
];

/* ── ESTADO DA APLICAÇÃO ───────────────────────────── */
const state = {
  loggedIn:      false,
  role:          null,
  page:          "inicio",
  query:         "",
  selectedClass: "6º Ano A",
  grades:        { "2024001": "8,5", "2024002": "7,0" },
  attendance:    { "2024001": "present", "2024002": "present" },
  modal:         null,
};

/* ── HELPERS HTML ──────────────────────────────────── */
const icon = (name, size = 20) =>
  `<svg class="icon" width="${size}" height="${size}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

const btn = (text, action, variant = "primary", iconName = "") =>
  `<button class="button ${variant}" data-action="${action}">${iconName ? icon(iconName, 17) : ""}${text}</button>`;

const opts = (items, selected = "") =>
  items.map(item => `<option ${item === selected ? "selected" : ""}>${item}</option>`).join("");

function pageHeader(eyebrow, title, description, action = "") {
  return `<div class="page-header">
    <div>
      <p class="eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      <p class="page-description">${description}</p>
    </div>
    ${action}
  </div>`;
}

function accessNotice() {
  if (["director","coordinator"].includes(state.role)) return "";
  const messages = {
    secretary: "Acesso de consulta. Apenas cadastros de alunos podem ser alterados.",
    teacher:   "Exibindo somente informações das turmas em que você atua.",
    student:   "Esta área apresenta apenas as suas informações acadêmicas.",
  };
  return `<div class="access-notice">${icon("check",17)}<strong>${messages[state.role]}</strong></div>`;
}

function statCard(label, value, detail, iconName, tone) {
  return `<article class="stat-card">
    <div><p>${label}</p><strong>${value}</strong></div>
    <span class="soft-icon ${tone}">${icon(iconName)}</span>
    <small><i></i>${detail}</small>
  </article>`;
}

function classSelect() {
  return classes.filter(c => state.role !== "teacher" || c.name === "6º Ano A").map(c => c.name);
}

/* ── PÁGINAS ─────────────────────────────────────── */
function renderHome() {
  const firstName = roles[state.role].name.split(" ")[0];
  return `${pageHeader("Visão geral", `Olá, ${firstName}. Bom dia!`, "Acompanhe os principais números da escola nesta terça-feira.")}
    ${accessNotice()}
    <section class="stats-grid">
      ${statCard("Alunos cadastrados", "114", "+6 neste mês", "users", "green")}
      ${statCard("Turmas ativas", "04", "2 no período da manhã", "class", "blue")}
      ${state.role !== "secretary" ? statCard("Avaliações", state.role === "teacher" ? "03" : "12", state.role === "teacher" ? "Da sua turma" : "4 previstas nesta semana", "test", "yellow") : ""}
    </section>
    <section class="dashboard-grid ${state.role === "secretary" ? "single" : ""}">
      ${state.role !== "secretary" ? `
      <article class="panel">
        <div class="panel-title">
          <span><b>Próximas avaliações</b><small>Atividades programadas para os próximos dias</small></span>
          ${btn(`Ver todas ${icon("arrow",15)}`, "go-evaluations", "ghost")}
        </div>
        <div class="event-list">
          ${evaluations.filter(e => state.role !== "teacher" || e.className === "6º Ano A").slice(0,3).map((e,i) =>
            `<div class="event">
              <span class="date-box"><small>MAR</small><b>${[18,20,24][i]}</b></span>
              <span><b>${e.name}</b><small>${e.subject} · ${e.className}</small></span>
              <em class="tag ${e.tone}">${e.subject}</em>
            </div>`).join("")}
        </div>
      </article>` : ""}
      <article class="attendance-summary">
        <div class="panel-title">
          <span><b>Frequência hoje</b><small>114 alunos esperados</small></span>
          <span class="dark-icon">${icon("check")}</span>
        </div>
        <div class="big-number"><strong>94%</strong><span>de presença</span></div>
        <div class="progress"><i style="width:94%"></i></div>
        <div class="summary-row"><span><b>107</b> presentes</span><span><b>7</b> ausentes</span></div>
        ${btn(state.role === "secretary" ? "Consultar frequência" : "Registrar frequência", "go-attendance", "light")}
      </article>
    </section>`;
}

function renderStudents() {
  let list = state.role === "teacher"
    ? students.filter(s => s.className === "6º Ano A")
    : students;
  const q = state.query.toLowerCase();
  list = list.filter(s => `${s.name} ${s.registration} ${s.className}`.toLowerCase().includes(q));
  return `${pageHeader("Cadastros","Alunos",`${state.role === "teacher" ? 2 : students.length} alunos encontrados nesta visualização.`, btn("Novo aluno","new-student","primary","plus"))}
    ${accessNotice()}
    <section class="table-panel">
      <div class="table-tools">
        <label class="search">
          ${icon("search",18)}
          <input id="student-search" value="${state.query}" placeholder="Buscar por nome, matrícula ou turma">
        </label>
      </div>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Aluno</th><th>Matrícula</th><th>Turma</th><th></th></tr></thead>
          <tbody>
            ${list.map(s => `
              <tr>
                <td><span class="person"><span class="avatar ${s.tone}">${s.initials}</span><b>${s.name}</b></span></td>
                <td>${s.registration}</td>
                <td><span class="pill">${s.className}</span></td>
                <td class="right"><button class="text-button">Ver perfil ${icon("arrow",14)}</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
        ${!list.length ? `<p class="empty">Nenhum aluno encontrado.</p>` : ""}
      </div>
    </section>`;
}

function renderClasses() {
  const list = state.role === "teacher" ? classes.filter(c => c.name === "6º Ano A") : classes;
  return `${pageHeader("Organização escolar","Turmas","Acompanhe as turmas, seus professores e alunos.")}
    ${accessNotice()}
    <section class="class-grid">
      ${list.map(c => `
      <article class="class-card ${c.tone}">
        <div class="class-card-body">
          <div class="card-heading">
            <span><h2>${c.name}</h2><small>${c.period}</small></span>
            <span class="soft-icon ${c.tone}">${icon("class")}</span>
          </div>
          <div class="class-data">
            <span><small>Alunos</small><b>${c.students} matriculados</b></span>
            <span><small>Responsável</small><b>${c.teacher}</b></span>
          </div>
          ${btn(`Visualizar turma ${icon("arrow",15)}`, `view-class:${c.name}`, "outline")}
        </div>
      </article>`).join("")}
    </section>`;
}

function renderEvaluations() {
  const list = state.role === "teacher" ? evaluations.filter(e => e.className === "6º Ano A") : evaluations;
  return `${pageHeader("Planejamento pedagógico","Avaliações","Organize e acompanhe as avaliações de todas as turmas.", btn("Nova avaliação","new-evaluation","primary","plus"))}
    ${accessNotice()}
    <section class="evaluation-list">
      ${list.map(e => `
      <article class="evaluation">
        <span class="soft-icon ${e.tone}">${icon("test")}</span>
        <span class="evaluation-name"><b>${e.name}</b><small>${e.subject}</small></span>
        <span><small>Turma</small><b>${e.className}</b></span>
        <span><small>Data</small><b>${icon("calendar",14)} ${e.date}</b></span>
      </article>`).join("")}
    </section>`;
}

function renderGrades() {
  const isStudent = state.role === "student";
  const current = students.filter(s => s.className === state.selectedClass && (!isStudent || s.registration === "2024001"));
  return `${pageHeader("Registro acadêmico", isStudent ? "Minhas notas" : "Lançamento de notas",
    isStudent ? "Consulte seus resultados nas avaliações realizadas."
              : "Selecione a turma e a avaliação para registrar os resultados.",
    !isStudent ? btn("Salvar notas","save-grades") : "")}
    ${accessNotice()}
    ${!isStudent ? `<section class="filters">
      <label>Turma<select id="class-select">${opts(classSelect(), state.selectedClass)}</select></label>
      <label>Avaliação<select>
        <option>Avaliação Bimestral I — Matemática</option>
        <option>Trabalho em grupo — Ciências</option>
      </select></label>
    </section>` : ""}
    <section class="list-panel">
      <div class="list-heading">
        <span>
          <b>${state.selectedClass}</b>
          <small>${isStudent ? "Resultados das avaliações" : `${current.length} alunos nesta visualização · Nota máxima 10,0`}</small>
        </span>
        ${!isStudent ? `<em class="status">Rascunho</em>` : ""}
      </div>
      ${current.map(s => `
      <div class="student-row">
        <span class="avatar ${s.tone}">${s.initials}</span>
        <span class="student-name"><b>${s.name}</b><small>${s.registration}</small></span>
        ${isStudent
          ? `<span class="student-grade"><small>Matemática</small><b>${state.grades[s.registration]}</b></span>`
          : `<label class="grade-field">Nota<input data-grade="${s.registration}" value="${state.grades[s.registration] || ""}" placeholder="0,0"></label>`}
      </div>`).join("")}
    </section>`;
}

function renderAttendance() {
  const readOnly = ["secretary","student"].includes(state.role);
  const current = students.filter(s => s.className === state.selectedClass && (state.role !== "student" || s.registration === "2024001"));
  return `${pageHeader("Rotina escolar", state.role === "student" ? "Minha frequência" : "Frequência",
    readOnly ? "Consulte os registros de presença e ausência."
             : "Registre a presença dos alunos por turma e data.",
    !readOnly ? btn("Salvar frequência","save-attendance") : "")}
    ${accessNotice()}
    <section class="filters">
      ${state.role !== "student" ? `<label>Turma<select id="class-select">${opts(classSelect(), state.selectedClass)}</select></label>` : ""}
      <label>Data<input type="date" value="2025-03-18"></label>
    </section>
    <section class="list-panel">
      <div class="list-heading">
        <span>
          <b>Chamada · ${state.selectedClass}</b>
          <small>${readOnly ? "Registros da data selecionada" : "Marque a situação de cada aluno"}</small>
        </span>
      </div>
      ${current.map(s => {
        const status = state.attendance[s.registration] || "present";
        return `<div class="student-row">
          <span class="avatar ${s.tone}">${s.initials}</span>
          <span class="student-name"><b>${s.name}</b><small>${s.registration}</small></span>
          ${readOnly
            ? `<span class="presence ${status}">${status === "present" ? "Presente" : "Ausente"}</span>`
            : `<div class="attendance-toggle">
                <button class="${status === "present" ? "active present" : ""}" data-attendance="${s.registration}:present">Presente</button>
                <button class="${status === "absent"  ? "active absent"  : ""}" data-attendance="${s.registration}:absent">Ausente</button>
              </div>`}
        </div>`;
      }).join("")}
    </section>`;
}

function renderPerformance() {
  const bars = [
    { name: "Matemática", value: 82 },
    { name: "Português",  value: 76 },
    { name: "Ciências",   value: 88 },
    { name: "História",   value: 71 },
  ];
  return `${pageHeader("Análise pedagógica","Desempenho","Uma visão consolidada dos resultados da escola.",
    `<label class="header-select">Turma analisada<select>${state.role !== "teacher" ? "<option>Todas as turmas</option>" : ""}${opts(classSelect())}</select></label>`)}
    ${accessNotice()}
    <section class="stats-grid">
      ${statCard("Média geral","8,1","+0,4 no bimestre","chart","green")}
      ${statCard("Maior média","8,8","Ciências","grade","blue")}
      ${statCard("Participação","96%","Nas avaliações","users","yellow")}
    </section>
    <section class="performance-grid">
      <article class="panel">
        <div class="panel-title"><span><b>Média por disciplina</b><small>Desempenho consolidado no 1º bimestre</small></span></div>
        <div class="bars">
          ${bars.map(b => `
          <div>
            <span><b>${b.name}</b><strong>${(b.value/10).toFixed(1).replace(".",",")}</strong></span>
            <div><i style="width:${b.value}%"></i></div>
          </div>`).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-title"><span><b>Resultados recentes</b><small>Média das últimas avaliações</small></span></div>
        <div class="result-list">
          ${evaluations.slice(0,3).map((e,i) => `
          <div>
            <span class="soft-icon ${e.tone}">${icon("grade",18)}</span>
            <span><b>${e.subject}</b><small>${e.className}</small></span>
            <strong>${["8,4","7,9","8,8"][i]}</strong>
          </div>`).join("")}
        </div>
      </article>
    </section>`;
}

/* ── MODAL ──────────────────────────────────────────── */
function renderModal() {
  const area = document.getElementById("modal-area");
  if (!state.modal) { area.innerHTML = ""; return; }

  if (state.modal === "student") {
    area.innerHTML = `
    <div class="modal-backdrop">
      <form class="modal" id="student-form">
        <div class="modal-title">
          <span><h2>Novo aluno</h2><p>Preencha os dados para realizar o cadastro.</p></span>
          <button type="button" class="icon-button" data-action="close-modal">${icon("close")}</button>
        </div>
        <label>Nome completo<input id="new-name" placeholder="Ex.: Laura Mendes" required></label>
        <label>Matrícula<input id="new-registration" placeholder="Ex.: 2024007" required></label>
        <label>Turma<select id="new-class">${opts(classes.map(c => c.name))}</select></label>
        <div class="modal-actions">
          ${btn("Cancelar","close-modal","outline")}
          <button class="button primary" type="submit">Cadastrar aluno</button>
        </div>
      </form>
    </div>`;
    return;
  }

  if (state.modal === "evaluation") {
    area.innerHTML = `
    <div class="modal-backdrop">
      <form class="modal" id="evaluation-form">
        <div class="modal-title">
          <span><h2>Nova avaliação</h2><p>Adicione a avaliação ao calendário escolar.</p></span>
          <button type="button" class="icon-button" data-action="close-modal">${icon("close")}</button>
        </div>
        <label>Nome da avaliação<input id="evaluation-name" placeholder="Ex.: Avaliação Bimestral II" required></label>
        <div class="form-grid">
          <label>Disciplina<select><option>Matemática</option><option>Português</option><option>Ciências</option></select></label>
          <label>Turma<select>${opts(classes.map(c => c.name))}</select></label>
        </div>
        <label>Data<input type="date" id="evaluation-date" required></label>
        <div class="modal-actions">
          ${btn("Cancelar","close-modal","outline")}
          <button class="button primary" type="submit">Criar avaliação</button>
        </div>
      </form>
    </div>`;
    return;
  }

  /* modal detalhe de turma */
  const selected = classes.find(c => c.name === state.modal.split(":")[1]);
  if (selected) {
    area.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <div class="modal-title">
          <span><p class="eyebrow">Detalhes da turma</p><h2>${selected.name}</h2></span>
          <button class="icon-button" data-action="close-modal">${icon("close")}</button>
        </div>
        <div class="detail-grid">
          <span><small>Professor responsável</small><b>${selected.teacher}</b></span>
          <span><small>Total de alunos</small><b>${selected.students} alunos</b></span>
        </div>
        <div class="detail-line"><span>Média geral</span><b>8,2</b></div>
      </div>
    </div>`;
  }
}

/* ── RENDERIZAÇÃO PRINCIPAL ─────────────────────────── */
function renderPage() {
  const map = {
    inicio:     renderHome,
    alunos:     renderStudents,
    turmas:     renderClasses,
    avaliacoes: renderEvaluations,
    notas:      renderGrades,
    frequencia: renderAttendance,
    desempenho: renderPerformance,
  };
  document.getElementById("page-content").innerHTML = map[state.page]();
}

function renderSidebar() {
  const user = roles[state.role];
  const nav  = pages.filter(p => access[state.role].includes(p.id));

  /* atualiza dados do usuário na sidebar */
  document.getElementById("user-initials").textContent = user.initials;
  document.getElementById("user-name").textContent     = user.name;
  document.getElementById("user-subtitle").textContent = user.subtitle;

  /* reconstrói o menu */
  const navEl = document.getElementById("sidebar-nav");
  navEl.innerHTML = `<p class="nav-label">Menu principal</p>` +
    nav.map(p => `
      <button class="nav-item ${state.page === p.id ? "active" : ""}" data-page="${p.id}">
        ${icon(p.icon, 19)}<span>${p.label}</span>
      </button>`).join("");
}

/* ── MOSTRAR / ESCONDER TELAS ───────────────────────── */
function showLogin() {
  document.getElementById("tela-login").style.display  = "grid";
  document.getElementById("tela-sistema").style.display = "none";
  document.getElementById("login-error").style.display  = "none";
  document.getElementById("login-form").reset();
}

function showSistema() {
  document.getElementById("tela-login").style.display   = "none";
  document.getElementById("tela-sistema").style.display = "block";

  const page = pages.find(p => p.id === state.page);
  document.getElementById("topbar-page-name").textContent = page ? page.label : "";

  renderSidebar();
  renderPage();
  renderModal();
}

/* ── EVENTOS ─────────────────────────────────────────── */

/* Login */
document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const account  = accounts.find(a => a.username === username);
  const errEl    = document.getElementById("login-error");

  if (!account || password !== "escola123") {
    errEl.textContent = "Usuário ou senha inválidos. Confira os dados e tente novamente.";
    errEl.style.display = "block";
  } else {
    state.role    = account.role;
    state.page    = access[account.role][0];
    state.loggedIn = true;
    errEl.style.display = "none";
    showSistema();
  }
});

/* Clique nas contas demo */
document.getElementById("tela-login").addEventListener("click", function(e) {
  const demo = e.target.closest("[data-login]");
  if (demo) {
    document.getElementById("username").value = demo.dataset.login;
    document.getElementById("password").value = "escola123";
  }
});

/* Logout */
document.getElementById("btn-logout").addEventListener("click", function() {
  state.loggedIn = false;
  state.role     = null;
  showLogin();
});

/* Menu hambúrguer (mobile) */
document.getElementById("btn-menu").addEventListener("click", function() {
  document.getElementById("tela-sistema").classList.add("menu-open");
});
document.getElementById("mobile-overlay").addEventListener("click", function() {
  document.getElementById("tela-sistema").classList.remove("menu-open");
});

/* Delegação de eventos na área do sistema */
document.getElementById("tela-sistema").addEventListener("click", function(e) {

  /* Navegação lateral */
  const navBtn = e.target.closest("[data-page]");
  if (navBtn) {
    state.page = navBtn.dataset.page;
    document.getElementById("tela-sistema").classList.remove("menu-open");
    document.getElementById("topbar-page-name").textContent = pages.find(p => p.id === state.page)?.label || "";
    renderSidebar();
    renderPage();
    return;
  }

  /* Ações genéricas */
  const actionEl = e.target.closest("[data-action]");
  if (actionEl) {
    const action = actionEl.dataset.action;
    if (action === "new-student")    { state.modal = "student";     renderModal(); return; }
    if (action === "new-evaluation") { state.modal = "evaluation";  renderModal(); return; }
    if (action === "close-modal")    { state.modal = null;          renderModal(); return; }
    if (action === "go-evaluations") { state.page = "avaliacoes";   renderSidebar(); renderPage(); return; }
    if (action === "go-attendance")  { state.page = "frequencia";   renderSidebar(); renderPage(); return; }
    if (action.startsWith("view-class:")) {
      state.modal = `class:${action.split(":")[1]}`;
      renderModal();
      return;
    }
  }

  /* Frequência: presente / ausente */
  const attBtn = e.target.closest("[data-attendance]");
  if (attBtn) {
    const [reg, val] = attBtn.dataset.attendance.split(":");
    state.attendance[reg] = val;
    renderPage();
  }
});

/* Formulários dentro do modal */
document.getElementById("modal-area").addEventListener("submit", function(e) {
  e.preventDefault();
  if (e.target.id === "student-form") {
    const name = document.getElementById("new-name").value;
    students.push({
      name,
      registration: document.getElementById("new-registration").value,
      className:    document.getElementById("new-class").value,
      initials:     name.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase(),
      tone: "green",
    });
    state.modal = null;
    renderModal();
    renderPage();
    renderSidebar();
  }
  if (e.target.id === "evaluation-form") {
    state.modal = null;
    renderModal();
  }
});

/* Input de busca de alunos */
document.getElementById("tela-sistema").addEventListener("input", function(e) {
  if (e.target.id === "student-search") {
    state.query = e.target.value;
    const pos = e.target.selectionStart;
    renderPage();
    const el = document.getElementById("student-search");
    if (el) { el.focus(); el.setSelectionRange(pos, pos); }
  }
  if (e.target.dataset.grade) {
    state.grades[e.target.dataset.grade] = e.target.value;
  }
});

/* Select de turma */
document.getElementById("tela-sistema").addEventListener("change", function(e) {
  if (e.target.id === "class-select") {
    state.selectedClass = e.target.value;
    renderPage();
  }
});

/* ── INICIALIZAÇÃO ───────────────────────────────────── */
showLogin();   /* começa sempre na tela de login */