// Dados simulados
const medicos = [
  { nome: "Dr. João Silva", especialidade: "Clínico Geral" },
  { nome: "Dra. Maria Souza", especialidade: "Pediatria" },
  { nome: "Dr. Carlos Pereira", especialidade: "Ginecologia" }
];

let consultas = [
  { id: "c1", nomePaciente: "Ana", medico: "Dr. João Silva", data: "2025-06-25", horario: "09:00", status: "Agendada", usuarioId: "u1" },
  { id: "c2", nomePaciente: "Bruno", medico: "Dra. Maria Souza", data: "2025-06-24", horario: "10:00", status: "Agendada", usuarioId: "u2" },
  { id: "c3", nomePaciente: "Carla", medico: "Dr. João Silva", data: "2025-06-26", horario: "11:00", status: "Remarcada", usuarioId: "u3" }
];

let listaEspera = [
  { id: "le1", nomeUsuario: "Diego", medico: "Dr. João Silva", data: "2025-06-25", status: "Em espera", especialidade: "Clínico Geral" },
  { id: "le2", nomeUsuario: "Elisa", medico: "Dra. Maria Souza", data: "2025-06-26", status: "Em espera", especialidade: "Pediatria" }
];

let notificacoes = [
  { id: "n1", usuarioId: "u3", consultaId: "c3", mensagem: "Sua consulta foi remarcada para amanhã.", tipo: "confirmacao", resposta: "confirmado", dataEnvio: new Date() }
];

let triagens = [];

function esconderTudo() {
  document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
}

function voltarMenu() {
  esconderTudo();
  document.getElementById("menuPrincipal").classList.remove("hidden");
}

function abrirAgendamento() {
  esconderTudo();
  document.getElementById("secaoAgendamento").classList.remove("hidden");
}

function abrirTriagem() {
  esconderTudo();
  document.getElementById("secaoTriagem").classList.remove("hidden");
}

function abrirListaEspera() {
  esconderTudo();
  document.getElementById("listaEsperaSection").classList.remove("hidden");
}

function abrirConfirmacoes() {
  esconderTudo();
  document.getElementById("confirmacoesSection").classList.remove("hidden");
  carregarConfirmacoes();
}

function gerarRelatorio() {
  esconderTudo();
  document.getElementById("relatorioSection").classList.remove("hidden");
  gerarRelatorioTexto();
}

function exportarRelatorioCSV() {
  const texto = document.getElementById("relatorioTexto").textContent;
  const linhas = texto.split('\n').map(line => `"${line.replace(/"/g, '""')}"`).join('\r\n');
  const blob = new Blob([linhas], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "relatorio_ubs.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function carregarMedicos() {
  const selects = ["medico", "medicoEspera", "medicoDisponivel"];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = '<option value="">Selecione um médico</option>';
    medicos.forEach(m => {
      const option = document.createElement("option");
      option.value = m.nome;
      option.textContent = `${m.nome} - ${m.especialidade}`;
      sel.appendChild(option);
    });
  });
}

function buscarConsultas() {
  const medicoId = document.getElementById("medico").value;
  const data = document.getElementById("data").value;
  if (!medicoId || !data) {
    alert("Preencha todos os campos.");
    return;
  }

  const lista = document.getElementById("listaConsultas");
  lista.innerHTML = "";

  const resultado = consultas.filter(c => c.medico === medicoId && c.data === data && c.status !== "Cancelada");

  if (resultado.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma consulta encontrada para o dia selecionado.";
    lista.appendChild(li);
  } else {
    resultado.forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" data-id="${c.id}" /> ${c.nomePaciente} - ${c.horario} - Status: ${c.status}`;
      lista.appendChild(li);
    });
  }

  esconderTudo();
  document.getElementById("consultasSection").classList.remove("hidden");
}

function remarcarConsultas() {
  const novaData = document.getElementById("novaData").value;
  const mensagem = document.getElementById("mensagemNotificacao").value.trim();
  const selecionados = document.querySelectorAll("#listaConsultas input[type=checkbox]:checked");

  if (!novaData || !mensagem || selecionados.length === 0) {
    alert("Preencha todos os campos e selecione ao menos uma consulta.");
    return;
  }

  selecionados.forEach(input => {
    const id = input.dataset.id;
    const consulta = consultas.find(c => c.id === id);
    if (consulta) {
      consulta.data = novaData;
      consulta.status = "Remarcada";

      notificacoes.push({
        id: `n${notificacoes.length + 1}`,
        usuarioId: consulta.usuarioId,
        consultaId: consulta.id,
        mensagem,
        tipo: "confirmacao",
        resposta: null,
        dataEnvio: new Date()
      });
    }
  });

  alert("Consultas remarcadas e pacientes notificados.");
  buscarConsultas();
}

function cancelarConsultas() {
  const selecionados = document.querySelectorAll("#listaConsultas input[type=checkbox]:checked");
  if (selecionados.length === 0) {
    alert("Selecione ao menos uma consulta.");
    return;
  }

  selecionados.forEach(input => {
    const id = input.dataset.id;
    const consulta = consultas.find(c => c.id === id);
    if (consulta) {
      consulta.status = "Cancelada";
    }
  });

  alert("Consultas canceladas.");
  buscarConsultas();
}

function carregarConfirmacoes() {
  const lista = document.getElementById("listaConfirmacoes");
  lista.innerHTML = "";

  const confirmadasIds = notificacoes
    .filter(n => n.tipo === "confirmacao" && n.resposta === "confirmado" && n.consultaId)
    .map(n => n.consultaId);

  const confirmadas = consultas.filter(c => confirmadasIds.includes(c.id));

  if (confirmadas.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma confirmação encontrada.";
    lista.appendChild(li);
  } else {
    confirmadas.forEach(c => {
      const li = document.createElement("li");
      li.textContent = `${c.nomePaciente} - ${c.data} - ${c.horario} - Médico: ${c.medico}`;
      lista.appendChild(li);
    });
  }
}

function realizarTriagem(e) {
  e.preventDefault();
  const form = e.target;

  const dados = {
    nomePaciente: form.nomePaciente.value,
    idade: parseInt(form.idadePaciente.value),
    sintomas: form.sintomas.value,
    urgencia: form.urgencia.value,
    especialidade: form.especialidade.value,
    medico: form.medicoDisponivel.value,
    data: new Date().toISOString()
  };

  triagens.push(dados);

  document.getElementById("mensagemTriagem").textContent = "Paciente encaminhado com sucesso.";
  form.reset();
}

function gerarRelatorioTexto() {
  let texto = `Relatório Diário - ${new Date().toLocaleDateString()}`;
  texto += `\n\nConsultas Totais: ${consultas.length}`;
  texto += `\nTriagens Realizadas: ${triagens.length}`;

  document.getElementById("relatorioTexto").textContent = texto;
}

function carregarListaEspera() {
  const lista = document.getElementById("listaEspera");
  lista.innerHTML = "";

  const medicoSelecionado = document.getElementById("medicoEspera").value;
  const dataSelecionada = document.getElementById("dataEspera").value;

  if (!medicoSelecionado || !dataSelecionada) {
    alert("Selecione um médico e uma data.");
    return;
  }

  const listaFiltrada = listaEspera.filter(le => le.medico === medicoSelecionado && le.data === dataSelecionada && le.status === "Em espera");

  if (listaFiltrada.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhum paciente em lista de espera para este dia.";
    lista.appendChild(li);
    return;
  }

  listaFiltrada.forEach(dados => {
    const li = document.createElement("li");
    li.textContent = `${dados.nomeUsuario} - ${dados.especialidade} - Data: ${dados.data}`;
    lista.appendChild(li);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  carregarMedicos();

  const botoes = {
    btnAbrirAgendamento: abrirAgendamento,
    btnAbrirTriagem: abrirTriagem,
    btnAbrirListaEspera: abrirListaEspera,
    btnAbrirConfirmacoes: abrirConfirmacoes,
    btnGerarRelatorio: gerarRelatorio,
    btnExportarCSV: exportarRelatorioCSV,
    buscarConsultas: buscarConsultas,
    btnRemarcarConsultas: remarcarConsultas,
    btnCancelarConsultas: cancelarConsultas,
    btnBuscarListaEspera: carregarListaEspera
  };

  Object.entries(botoes).forEach(([id, fn]) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", fn);
  });

  const formTriagem = document.getElementById("formTriagem");
  if (formTriagem) formTriagem.addEventListener("submit", realizarTriagem);

  document.querySelectorAll(".btnVoltarMenu").forEach(btn => {
    btn.addEventListener("click", voltarMenu);
  });

  btnSair.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja sair do Painel Administrativo?")) {
    
    window.location.href = "index.html"; 
  }
});

});
