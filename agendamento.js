// Elementos
const especialidadeSelect = document.getElementById('especialidade');
const medicoSelect = document.getElementById('medico');
const dataInput = document.getElementById('data');
const horarioSelect = document.getElementById('horario');
const agendamentoForm = document.getElementById('agendamentoForm');

// Simulação de médicos (localmente)
const medicos = [
  { nome: "Dr. João Silva", especialidade: "clinico" },
  { nome: "Dra. Ana Oliveira", especialidade: "pediatra" },
  { nome: "Dr. Carlos Souza", especialidade: "odontologista" },
  { nome: "Dra. Beatriz Lima", especialidade: "dermatologista" }
];

// Usuário simulado (o último logado no localStorage)
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuarioLogado) {
  alert('Você precisa estar logado para agendar uma consulta.');
  window.location.href = 'login.html';
}

// Preencher médicos conforme especialidade
especialidadeSelect.addEventListener('change', () => {
  const especialidadeSelecionada = especialidadeSelect.value;
  medicoSelect.innerHTML = '<option value="">Selecione...</option>';

  const medicosFiltrados = medicos.filter(medico => medico.especialidade === especialidadeSelecionada);
  medicosFiltrados.forEach(medico => {
    const option = document.createElement('option');
    option.value = medico.nome;
    option.textContent = medico.nome;
    medicoSelect.appendChild(option);
  });
});

// Simular horários ao selecionar data
dataInput.addEventListener('change', () => {
  horarioSelect.innerHTML = `
    <option value="08:00">08:00</option>
    <option value="10:00">10:00</option>
    <option value="13:00">13:00</option>
    <option value="15:00">15:00</option>
  `;
});

// Agendamento
agendamentoForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const especialidade = especialidadeSelect.value;
  const medico = medicoSelect.value;
  const unidade = document.getElementById('unidade').value;
  const data = dataInput.value;
  const horario = horarioSelect.value;

  if (!especialidade || !medico || !unidade || !data || !horario) {
    alert('Preencha todos os campos.');
    return;
  }

  const novaConsulta = {
    nomePaciente: usuarioLogado.nome,
    emailPaciente: usuarioLogado.email,
    especialidade,
    medico,
    unidade,
    data,
    horario,
    status: "Em espera",
    dataRegistro: new Date().toISOString()
  };

  // Salvar no localStorage
  const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
  consultas.push(novaConsulta);
  localStorage.setItem('consultas', JSON.stringify(consultas));

  alert('Consulta agendada com sucesso!');
  window.location.href = 'painel_usuario.html';
});
