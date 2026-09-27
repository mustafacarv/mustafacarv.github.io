const app = document.querySelector("#app");

const roles = {
  director: { label: "Diretora", name: "Helena Santos", subtitle: "Direção escolar", initials: "HS" },
  coordinator: { label: "Coordenadora", name: "Marina Costa", subtitle: "Coordenação pedagógica", initials: "MC" },
  secretary: { label: "Secretário", name: "Lucas Rocha", subtitle: "Secretaria escolar", initials: "LR" },
  teacher: { label: "Professor", name: "Paulo Mendes", subtitle: "Professor · 6º Ano A", initials: "PM" },
  student: { label: "Aluna", name: "Ana Clara Souza", subtitle: "Aluna · 6º Ano A", initials: "AC" },
};

const accounts = [
  { username: "diretora@horizonte.edu", role: "director" },
  { username: "coordenacao@horizonte.edu", role: "coordinator" },
  { username: "secretaria@horizonte.edu", role: "secretary" },
  { username: "professor@horizonte.edu", role: "teacher" },
  { username: "2024001", role: "student" },
];

const pages = [
  { id: "inicio", label: "Início", icon: "home" },
  { id: "alunos", label: "Alunos", icon: "users" },
  { id: "turmas", label: "Turmas", icon: "class" },
  { id: "avaliacoes", label: "Avaliações", icon: "test" },
  { id: "notas", label: "Notas", icon: "grade" },
  { id: "frequencia", label: "Frequência", icon: "check" },
  { id: "desempenho", label: "Desempenho", icon: "chart" },
];

const access = {
  director: pages.map((page) => page.id),
  coordinator: pages.map((page) => page.id),
  secretary: ["inicio", "alunos", "turmas", "frequencia"],
  teacher: pages.map((page) => page.id),
  student: ["notas", "frequencia"],
};

let students = [
  { name: "Ana Clara Souza", registration: "2024001", className: "6º Ano A", initials: "AC", tone: "green" },
  { name: "Bruno Henrique Lima", registration: "2024002", className: "6º Ano A", initials: "BH", tone: "blue" },
  { name: "Camila Oliveira", registration: "2024003", className: "7º Ano B", initials: "CO", tone: "yellow" },
  { name: "Diego Martins", registration: "2024004", className: "8º Ano A", initials: "DM", tone: "purple" },
  { name: "Elisa Ferreira", registration: "2024005", className: "9º Ano A", initials: "EF", tone: "pink" },
  { name: "Felipe Almeida", registration: "2024006", className: "7º Ano B", initials: "FA", tone: "orange" },
];

const classes = [
  { name: "6º Ano A", period: "Manhã", students: 28, teacher: "Mariana Costa", tone: "green" },
  { name: "7º Ano B", period: "Manhã", students: 31, teacher: "Paulo Mendes", tone: "blue" },
  { name: "8º Ano A", period: "Tarde", students: 26, teacher: "Renata Alves", tone: "yellow" },
  { name: "9º Ano A", period: "Tarde", students: 29, teacher: "João Batista", tone: "purple" },
];

const evaluations = [
  { name: "Avaliação Bimestral I", subject: "Matemática", className: "6º Ano A", date: "18 mar. 2025", tone: "green" },
  { name: "Produção Textual", subject: "Língua Portuguesa", className: "7º Ano B", date: "20 mar. 2025", tone: "blue" },
  { name: "Trabalho de Ciências", subject: "Ciências", className: "8º Ano A", date: "24 mar. 2025", tone: "yellow" },
  { name: "Avaliação Bimestral I", subject: "História", className: "9º Ano A", date: "27 mar. 2025", tone: "purple" },
];

const state = {
  loggedIn: false,
  role: null,
  page: "inicio",
  query: "",
  selectedClass: "6º Ano A",
  grades: { "2024001": "8,5", "2024002": "7,0" },
  attendance: { "2024001": "present", "2024002": "present" },
  modal: null,
  loginError: "",
};

const icon = (name, size = 20) => `<svg class="icon" width="${size}" height="${size}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const button = (text, action, variant = "primary", iconName = "") => `<button class="button ${variant}" data-action="${action}">${iconName ? icon(iconName, 17) : ""}${text}</button>`;
const options = (items, selected = "") => items.map((item) => `<option ${item === selected ? "selected" : ""}>${item}</option>`).join("");

function pageHeader(eyebrow, title, description, action = "") {
  return `<div class="page-header"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="page-description">${description}</p></div>${action}</div>`;
}

function accessNotice() {
  if (["director", "coordinator"].includes(state.role)) return "";
  const messages = {
    secretary: "Acesso de consulta. Apenas cadastros de alunos podem ser alterados.",
    teacher: "Exibindo somente informações das turmas em que você atua.",
    student: "Esta área apresenta apenas as suas informações acadêmicas.",
  };
  return `<div class="access-notice">${icon("check", 17)}<strong>${messages[state.role]}</strong></div>`;
}

function renderLogin() {
  app.innerHTML = `
    <div class="login-layout">
      <section class="login-brand">
        <div class="brand brand-light"><span class="brand-icon">${icon("school", 24)}</span><span>Sistema de<br><b>Gestão Escolar</b></span></div>
        <div><h1>Educação organizada para transformar o aprendizado.</h1><p>Uma plataforma segura para acompanhar a rotina acadêmica, os estudantes e os resultados da escola.</p></div>
        <small>Colégio Horizonte · Ambiente acadêmico seguro</small>
      </section>
      <main class="login-main">
        <div class="login-card">
          <div class="mobile-brand brand"><span class="brand-icon">${icon("school", 22)}</span><b>Sistema de Gestão Escolar</b></div>
          <p class="eyebrow">Acesso ao sistema</p>
          <h1>Bem-vindo de volta</h1>
          <p>Entre com seu usuário institucional para continuar.</p>
          <form id="login-form">
            <label>Usuário<input id="username" autocomplete="username" placeholder="E-mail institucional ou matrícula"></label>
            <label>Senha<input id="password" type="password" autocomplete="current-password" placeholder="Digite sua senha"></label>
            ${state.loginError ? `<p class="error">${state.loginError}</p>` : ""}
            <button class="button primary login-button" type="submit">Entrar no sistema ${icon("arrow", 17)}</button>
          </form>
          <div class="demo-box"><p class="demo-title">Acessos para demonstração</p>
            ${accounts.map((account) => `<button class="demo-account" data-login="${account.username}"><span><b>${roles[account.role].name}</b><small>${account.username}</small></span><em>${roles[account.role].label}</em></button>`).join("")}
            <p class="demo-password">Senha para todas as contas: <b>escola123</b></p>
          </div>
        </div>
      </main>
    </div>`;
}

function renderShell() {
  const user = roles[state.role];
  const nav = pages.filter((page) => access[state.role].includes(page.id));
  app.innerHTML = `
    <div class="app-shell">
      <div class="mobile-overlay" data-action="close-menu"></div>
      <aside class="sidebar">
        <div class="sidebar-brand brand"><span class="brand-icon">${icon("school", 22)}</span><span>Sistema de<br><b>Gestão Escolar</b></span></div>
        <nav><p class="nav-label">Menu principal</p>${nav.map((page) => `<button class="nav-item ${state.page === page.id ? "active" : ""}" data-page="${page.id}">${icon(page.icon, 19)}<span>${page.label}</span></button>`).join("")}</nav>
        <div class="user-area">
          <div class="user-card"><span class="avatar dark">${user.initials}</span><span><b>${user.name}</b><small>${user.subtitle}</small></span></div>
          <button class="logout" data-action="logout">${icon("logout", 16)} Sair</button>
        </div>
      </aside>
      <div class="content-shell">
        <header class="topbar">
          <div class="topbar-title"><button class="menu-button" data-action="open-menu">☰</button><span><small>Colégio Horizonte</small><b>${pages.find((page) => page.id === state.page).label}</b></span></div>
          <div class="topbar-actions"><span class="date-chip">${icon("calendar", 15)} Terça, 18 de março</span><button class="icon-button" aria-label="Notificações">${icon("bell", 18)}<i></i></button></div>
        </header>
        <main class="page-content">${renderPage()}</main>
      </div>
      ${renderModal()}
    </div>`;
}

function statCard(label, value, detail, iconName, tone) {
  return `<article class="stat-card"><div><p>${label}</p><strong>${value}</strong></div><span class="soft-icon ${tone}">${icon(iconName)}</span><small><i></i>${detail}</small></article>`;
}

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
      ${state.role !== "secretary" ? `<article class="panel"><div class="panel-title"><span><b>Próximas avaliações</b><small>Atividades programadas para os próximos dias</small></span>${button(`Ver todas ${icon("arrow", 15)}`, "go-evaluations", "ghost")}</div>
        <div class="event-list">${evaluations.filter((item) => state.role !== "teacher" || item.className === "6º Ano A").slice(0, 3).map((item, index) => `<div class="event"><span class="date-box"><small>MAR</small><b>${[18, 20, 24][index]}</b></span><span><b>${item.name}</b><small>${item.subject} · ${item.className}</small></span><em class="tag ${item.tone}">${item.subject}</em></div>`).join("")}</div></article>` : ""}
      <article class="attendance-summary"><div class="panel-title"><span><b>Frequência hoje</b><small>114 alunos esperados</small></span><span class="dark-icon">${icon("check")}</span></div><div class="big-number"><strong>94%</strong><span>de presença</span></div><div class="progress"><i style="width:94%"></i></div><div class="summary-row"><span><b>107</b> presentes</span><span><b>7</b> ausentes</span></div>${button(state.role === "secretary" ? "Consultar frequência" : "Registrar frequência", "go-attendance", "light")}</article>
    </section>`;
}

function visibleStudents() {
  let result = state.role === "teacher" ? students.filter((student) => student.className === "6º Ano A") : students;
  const query = state.query.toLowerCase();
  return result.filter((student) => `${student.name} ${student.registration} ${student.className}`.toLowerCase().includes(query));
}

function renderStudents() {
  const list = visibleStudents();
  return `${pageHeader("Cadastros", "Alunos", `${state.role === "teacher" ? 2 : students.length} alunos encontrados nesta visualização.`, button("Novo aluno", "new-student", "primary", "plus"))}
    ${accessNotice()}
    <section class="table-panel"><div class="table-tools"><label class="search">${icon("search", 18)}<input id="student-search" value="${state.query}" placeholder="Buscar por nome, matrícula ou turma"></label></div>
      <div class="table-scroll"><table><thead><tr><th>Aluno</th><th>Matrícula</th><th>Turma</th><th></th></tr></thead><tbody>
      ${list.map((student) => `<tr><td><span class="person"><span class="avatar ${student.tone}">${student.initials}</span><b>${student.name}</b></span></td><td>${student.registration}</td><td><span class="pill">${student.className}</span></td><td class="right"><button class="text-button">Ver perfil ${icon("arrow", 14)}</button></td></tr>`).join("")}
      </tbody></table>${!list.length ? `<p class="empty">Nenhum aluno encontrado.</p>` : ""}</div></section>`;
}

function renderClasses() {
  const list = state.role === "teacher" ? classes.filter((item) => item.name === "6º Ano A") : classes;
  return `${pageHeader("Organização escolar", "Turmas", "Acompanhe as turmas, seus professores e alunos.")}${accessNotice()}
    <section class="class-grid">${list.map((item) => `<article class="class-card ${item.tone}"><div class="class-card-body"><div class="card-heading"><span><h2>${item.name}</h2><small>${item.period}</small></span><span class="soft-icon ${item.tone}">${icon("class")}</span></div><div class="class-data"><span><small>Alunos</small><b>${item.students} matriculados</b></span><span><small>Responsável</small><b>${item.teacher}</b></span></div>${button(`Visualizar turma ${icon("arrow", 15)}`, `view-class:${item.name}`, "outline")}</div></article>`).join("")}</section>`;
}

function renderEvaluations() {
  const list = state.role === "teacher" ? evaluations.filter((item) => item.className === "6º Ano A") : evaluations;
  return `${pageHeader("Planejamento pedagógico", "Avaliações", "Organize e acompanhe as avaliações de todas as turmas.", button("Nova avaliação", "new-evaluation", "primary", "plus"))}${accessNotice()}
    <section class="evaluation-list">${list.map((item) => `<article class="evaluation"><span class="soft-icon ${item.tone}">${icon("test")}</span><span class="evaluation-name"><b>${item.name}</b><small>${item.subject}</small></span><span><small>Turma</small><b>${item.className}</b></span><span><small>Data</small><b>${icon("calendar", 14)} ${item.date}</b></span></article>`).join("")}</section>`;
}

function classSelect() {
  return classes.filter((item) => state.role !== "teacher" || item.name === "6º Ano A").map((item) => item.name);
}

function renderGrades() {
  const isStudent = state.role === "student";
  const current = students.filter((student) => student.className === state.selectedClass && (!isStudent || student.registration === "2024001"));
  return `${pageHeader("Registro acadêmico", isStudent ? "Minhas notas" : "Lançamento de notas", isStudent ? "Consulte seus resultados nas avaliações realizadas." : "Selecione a turma e a avaliação para registrar os resultados.", !isStudent ? button("Salvar notas", "save-grades") : "")}${accessNotice()}
    ${!isStudent ? `<section class="filters"><label>Turma<select id="class-select">${options(classSelect(), state.selectedClass)}</select></label><label>Avaliação<select><option>Avaliação Bimestral I — Matemática</option><option>Trabalho em grupo — Ciências</option></select></label></section>` : ""}
    <section class="list-panel"><div class="list-heading"><span><b>${state.selectedClass}</b><small>${isStudent ? "Resultados das avaliações" : `${current.length} alunos nesta visualização · Nota máxima 10,0`}</small></span>${!isStudent ? `<em class="status">Rascunho</em>` : ""}</div>
    ${current.map((student) => `<div class="student-row"><span class="avatar ${student.tone}">${student.initials}</span><span class="student-name"><b>${student.name}</b><small>${student.registration}</small></span>${isStudent ? `<span class="student-grade"><small>Matemática</small><b>${state.grades[student.registration]}</b></span>` : `<label class="grade-field">Nota<input data-grade="${student.registration}" value="${state.grades[student.registration] || ""}" placeholder="0,0"></label>`}</div>`).join("")}</section>`;
}

function renderAttendance() {
  const readOnly = ["secretary", "student"].includes(state.role);
  const current = students.filter((student) => student.className === state.selectedClass && (state.role !== "student" || student.registration === "2024001"));
  return `${pageHeader("Rotina escolar", state.role === "student" ? "Minha frequência" : "Frequência", readOnly ? "Consulte os registros de presença e ausência." : "Registre a presença dos alunos por turma e data.", !readOnly ? button("Salvar frequência", "save-attendance") : "")}${accessNotice()}
    <section class="filters">${state.role !== "student" ? `<label>Turma<select id="class-select">${options(classSelect(), state.selectedClass)}</select></label>` : ""}<label>Data<input type="date" value="2025-03-18"></label></section>
    <section class="list-panel"><div class="list-heading"><span><b>Chamada · ${state.selectedClass}</b><small>${readOnly ? "Registros da data selecionada" : "Marque a situação de cada aluno"}</small></span></div>
    ${current.map((student) => { const status = state.attendance[student.registration] || "present"; return `<div class="student-row"><span class="avatar ${student.tone}">${student.initials}</span><span class="student-name"><b>${student.name}</b><small>${student.registration}</small></span>${readOnly ? `<span class="presence ${status}">${status === "present" ? "Presente" : "Ausente"}</span>` : `<div class="attendance-toggle"><button class="${status === "present" ? "active present" : ""}" data-attendance="${student.registration}:present">Presente</button><button class="${status === "absent" ? "active absent" : ""}" data-attendance="${student.registration}:absent">Ausente</button></div>`}</div>`; }).join("")}</section>`;
}

function renderPerformance() {
  const bars = [{ name: "Matemática", value: 82 }, { name: "Português", value: 76 }, { name: "Ciências", value: 88 }, { name: "História", value: 71 }];
  return `${pageHeader("Análise pedagógica", "Desempenho", "Uma visão consolidada dos resultados da escola.", `<label class="header-select">Turma analisada<select>${state.role !== "teacher" ? "<option>Todas as turmas</option>" : ""}${options(classSelect())}</select></label>`)}${accessNotice()}
    <section class="stats-grid">${statCard("Média geral", "8,1", "+0,4 no bimestre", "chart", "green")}${statCard("Maior média", "8,8", "Ciências", "grade", "blue")}${statCard("Participação", "96%", "Nas avaliações", "users", "yellow")}</section>
    <section class="performance-grid"><article class="panel"><div class="panel-title"><span><b>Média por disciplina</b><small>Desempenho consolidado no 1º bimestre</small></span></div><div class="bars">${bars.map((bar) => `<div><span><b>${bar.name}</b><strong>${(bar.value / 10).toFixed(1).replace(".", ",")}</strong></span><div><i style="width:${bar.value}%"></i></div></div>`).join("")}</div></article>
    <article class="panel"><div class="panel-title"><span><b>Resultados recentes</b><small>Média das últimas avaliações</small></span></div><div class="result-list">${evaluations.slice(0, 3).map((item, index) => `<div><span class="soft-icon ${item.tone}">${icon("grade", 18)}</span><span><b>${item.subject}</b><small>${item.className}</small></span><strong>${["8,4", "7,9", "8,8"][index]}</strong></div>`).join("")}</div></article></section>`;
}

function renderPage() {
  return { inicio: renderHome, alunos: renderStudents, turmas: renderClasses, avaliacoes: renderEvaluations, notas: renderGrades, frequencia: renderAttendance, desempenho: renderPerformance }[state.page]();
}

function field(label, id, placeholder, type = "text") {
  return `<label>${label}<input id="${id}" type="${type}" placeholder="${placeholder}" required></label>`;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal === "student") return `<div class="modal-backdrop"><form class="modal" id="student-form"><div class="modal-title"><span><h2>Novo aluno</h2><p>Preencha os dados para realizar o cadastro.</p></span><button type="button" class="icon-button" data-action="close-modal">${icon("close")}</button></div>${field("Nome completo", "new-name", "Ex.: Laura Mendes")}${field("Matrícula", "new-registration", "Ex.: 2024007")}<label>Turma<select id="new-class">${options(classes.map((item) => item.name))}</select></label><div class="modal-actions">${button("Cancelar", "close-modal", "outline")}<button class="button primary" type="submit">Cadastrar aluno</button></div></form></div>`;
  if (state.modal === "evaluation") return `<div class="modal-backdrop"><form class="modal" id="evaluation-form"><div class="modal-title"><span><h2>Nova avaliação</h2><p>Adicione a avaliação ao calendário escolar.</p></span><button type="button" class="icon-button" data-action="close-modal">${icon("close")}</button></div>${field("Nome da avaliação", "evaluation-name", "Ex.: Avaliação Bimestral II")}<div class="form-grid"><label>Disciplina<select><option>Matemática</option><option>Português</option><option>Ciências</option></select></label><label>Turma<select>${options(classes.map((item) => item.name))}</select></label></div>${field("Data", "evaluation-date", "", "date")}<div class="modal-actions">${button("Cancelar", "close-modal", "outline")}<button class="button primary" type="submit">Criar avaliação</button></div></form></div>`;
  const selected = classes.find((item) => item.name === state.modal.split(":")[1]);
  return `<div class="modal-backdrop"><div class="modal"><div class="modal-title"><span><p class="eyebrow">Detalhes da turma</p><h2>${selected.name}</h2></span><button class="icon-button" data-action="close-modal">${icon("close")}</button></div><div class="detail-grid"><span><small>Professor responsável</small><b>${selected.teacher}</b></span><span><small>Total de alunos</small><b>${selected.students} alunos</b></span></div><div class="detail-line"><span>Média geral</span><b>8,2</b></div></div></div>`;
}

function render() {
  state.loggedIn ? renderShell() : renderLogin();
}

function handleAction(action) {
  if (action === "logout") { state.loggedIn = false; state.role = null; state.loginError = ""; }
  if (action === "new-student") state.modal = "student";
  if (action === "new-evaluation") state.modal = "evaluation";
  if (action.startsWith("view-class:")) state.modal = `class:${action.split(":")[1]}`;
  if (action === "close-modal") state.modal = null;
  if (action === "go-evaluations") state.page = "avaliacoes";
  if (action === "go-attendance") state.page = "frequencia";
  if (action === "open-menu") document.querySelector(".app-shell").classList.add("menu-open");
  if (action === "close-menu") document.querySelector(".app-shell").classList.remove("menu-open");
  if (!["open-menu", "close-menu"].includes(action)) render();
}

app.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-page]");
  if (nav) { state.page = nav.dataset.page; render(); return; }
  const action = event.target.closest("[data-action]");
  if (action) { handleAction(action.dataset.action); return; }
  const demo = event.target.closest("[data-login]");
  if (demo) {
    document.querySelector("#username").value = demo.dataset.login;
    document.querySelector("#password").value = "escola123";
  }
  const attendance = event.target.closest("[data-attendance]");
  if (attendance) {
    const [registration, value] = attendance.dataset.attendance.split(":");
    state.attendance[registration] = value;
    render();
  }
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "login-form") {
    const username = document.querySelector("#username").value.trim().toLowerCase();
    const password = document.querySelector("#password").value;
    const account = accounts.find((item) => item.username === username);
    if (!account || password !== "escola123") {
      state.loginError = "Usuário ou senha inválidos. Confira os dados e tente novamente.";
    } else {
      state.role = account.role;
      state.page = access[account.role][0];
      state.loggedIn = true;
      state.loginError = "";
    }
  }
  if (event.target.id === "student-form") {
    const name = document.querySelector("#new-name").value;
    students.push({ name, registration: document.querySelector("#new-registration").value, className: document.querySelector("#new-class").value, initials: name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase(), tone: "green" });
    state.modal = null;
  }
  if (event.target.id === "evaluation-form") state.modal = null;
  render();
});

app.addEventListener("input", (event) => {
  if (event.target.id === "student-search") {
    state.query = event.target.value;
    const position = event.target.selectionStart;
    render();
    const search = document.querySelector("#student-search");
    search.focus();
    search.setSelectionRange(position, position);
  }
  if (event.target.dataset.grade) state.grades[event.target.dataset.grade] = event.target.value;
});

app.addEventListener("change", (event) => {
  if (event.target.id === "class-select") {
    state.selectedClass = event.target.value;
    render();
  }
});

render();
