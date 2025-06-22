let consultasUsuario = [];
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

// Proteger acesso ao painel
if (!usuarioLogado) {
  alert('Você precisa estar logado para acessar o painel.');
  window.location.href = 'login.html';
}

// Função principal
document.addEventListener('DOMContentLoaded', () => {
  carregarMedicosNoSelect();
  carregarConsultasDoUsuario();
});

// Simular médicos
function carregarMedicosNoSelect() {
  const medicoSelect = document.getElementById('medicoListaEspera');
  if (!medicoSelect) return;

  medicoSelect.innerHTML = `
    <option value="">Selecione um médico</option>
    <option value="Dr. João Silva">Dr. João Silva</option>
    <option value="Dra. Ana Oliveira">Dra. Ana Oliveira</option>
    <option value="Dr. Carlos Souza">Dr. Carlos Souza</option>
    <option value="Dra. Beatriz Lima">Dra. Beatriz Lima</option>
  `;
}

// Buscar consultas no localStorage
function carregarConsultasDoUsuario() {
  const todasConsultas = JSON.parse(localStorage.getItem('consultas')) || [];
  consultasUsuario = todasConsultas.filter(c => c.emailPaciente === usuarioLogado.email);

  renderizarConsultas('Agendado', 'consultasAgendadas');
  renderizarConsultas('Em espera', 'consultasEspera');
  renderizarConsultas('Confirmado', 'consultasConfirmadas');
  renderizarConsultas('Anterior', 'consultasAnteriores');
}

function renderizarConsultas(status, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const consultasFiltradas = consultasUsuario.filter(c => c.status?.toLowerCase() === status.toLowerCase());

  if (consultasFiltradas.length === 0) {
    container.innerHTML = '<p style="color: gray;">Nenhuma consulta nesta categoria.</p>';
    return;
  }

  consultasFiltradas.forEach((consulta, index) => {
    const div = document.createElement('div');
    div.classList.add('consulta-item');

    let botoes = `<button class="ver" onclick="verDetalhes(${index})">Ver Detalhes</button>`;
    if (consulta.status.toLowerCase() !== 'anterior') {
      botoes += `<button class="cancelar" onclick="cancelarConsulta(${index})">Cancelar</button>`;
    }

    div.innerHTML = `
      <div class="consulta-header">
        <strong>${consulta.medico}</strong>
        <span>Status: ${consulta.status}</span>
      </div>
      <p><strong>Especialidade:</strong> ${consulta.especialidade}</p>
      <p><strong>Unidade:</strong> ${consulta.unidade}</p>
      <p><strong>Data:</strong> ${consulta.data} às ${consulta.horario}</p>
      <div class="consulta-actions">
        ${botoes}
      </div>
    `;

    container.appendChild(div);
  });
}

window.verDetalhes = function(index) {
  const consulta = consultasUsuario[index];
  alert(
    `Detalhes da consulta:\n\n` +
    `Médico: ${consulta.medico}\n` +
    `Especialidade: ${consulta.especialidade}\n` +
    `Unidade: ${consulta.unidade}\n` +
    `Data: ${consulta.data} às ${consulta.horario}\n` +
    `Status: ${consulta.status}`
  );
};

window.cancelarConsulta = function(index) {
  if (!confirm('Tem certeza que deseja cancelar essa consulta?')) return;

  const todasConsultas = JSON.parse(localStorage.getItem('consultas')) || [];
  const consultaParaCancelar = consultasUsuario[index];

  const novasConsultas = todasConsultas.filter(c => {
    return !(
      c.emailPaciente === consultaParaCancelar.emailPaciente &&
      c.data === consultaParaCancelar.data &&
      c.horario === consultaParaCancelar.horario &&
      c.medico === consultaParaCancelar.medico
    );
  });

  localStorage.setItem('consultas', JSON.stringify(novasConsultas));
  alert('Consulta cancelada com sucesso!');
  carregarConsultasDoUsuario();
};

// Lista de espera
window.adicionarNaListaEspera = function () {
  const nome = document.getElementById('nomeListaEspera').value.trim();
  const especialidade = document.getElementById('especialidadeListaEspera').value.trim();
  const medico = document.getElementById('medicoListaEspera').value;
  const data = document.getElementById('dataListaEspera').value;

  if (!nome || !especialidade || !medico || !data) {
    alert('Preencha todos os campos.');
    return;
  }

  const itemListaEspera = {
    nome,
    especialidade,
    medico,
    data,
    status: 'Em espera',
    email: usuarioLogado.email
  };

  const lista = JSON.parse(localStorage.getItem('listaEspera')) || [];
  lista.push(itemListaEspera);
  localStorage.setItem('listaEspera', JSON.stringify(lista));

  document.getElementById('mensagemListaEspera').style.display = 'block';
  document.getElementById('mensagemListaEspera').innerText = 'Você foi adicionado(a) à lista de espera com sucesso!';

  document.getElementById('nomeListaEspera').value = '';
  document.getElementById('especialidadeListaEspera').value = '';
  document.getElementById('medicoListaEspera').value = '';
  document.getElementById('dataListaEspera').value = '';
};

window.abrirFormularioEspera = function () {
  const formulario = document.getElementById('formularioListaEspera');
  if (!formulario) return;
  formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
};

// Logout
window.confirmarSaida = function () {
  if (confirm("Tem certeza que deseja sair?")) {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  }
};
