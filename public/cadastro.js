function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

function validarTelefone(telefone) {
  return /^\d{10,11}$/.test(telefone);
}

const campoLoginCadastro = document.getElementById('campoLoginCadastro');
const funcionarioPacienteGroup = document.getElementById('funcionarioPacienteGroup');
const codigoFuncionarioGroup = document.getElementById('codigoFuncionarioGroup');
const cadastroForm = document.getElementById('cadastroForm');

// Alternar visibilidade do campo "Código Funcionário"
document.querySelectorAll('input[name="tipoUsuarioEmail"]').forEach(input => {
  input.addEventListener('change', () => {
    const tipo = document.querySelector('input[name="tipoUsuarioEmail"]:checked')?.value;
    if (tipo === 'funcionario') {
      codigoFuncionarioGroup.style.display = 'block';
      document.getElementById('codigoFuncionario').required = true;
    } else {
      codigoFuncionarioGroup.style.display = 'none';
      document.getElementById('codigoFuncionario').required = false;
    }
  });
});

cadastroForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nomeCadastro').value.trim();
  const email = campoLoginCadastro.value.trim();
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenhaCadastro').value;
  const tipoUsuario = document.querySelector('input[name="tipoUsuarioEmail"]:checked')?.value || 'paciente';
  const codigoFuncionario = document.getElementById('codigoFuncionario').value.trim();
  const telefoneContato = document.getElementById('telefoneCadastro').value.trim();

  if (nome.length < 3) return alert('Informe um nome com pelo menos 3 letras.');
  if (!validarEmail(email)) return alert('E-mail inválido.');
  if (senha.length < 6) return alert('A senha deve ter pelo menos 6 caracteres.');
  if (senha !== confirmarSenha) return alert('As senhas não coincidem.');
  if (!validarTelefone(telefoneContato)) return alert('Telefone inválido.');
  if (tipoUsuario === 'funcionario' && codigoFuncionario !== 'UBS2025') {
    return alert('Código de funcionário inválido.');
  }

  // Recupera usuários existentes do localStorage
  const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Verifica se e-mail já está cadastrado
  if (usuariosExistentes.some(u => u.email === email)) {
    return alert('Este e-mail já está cadastrado.');
  }

  // Gerar token simulado de verificação
  const token = Math.random().toString(36).substring(2, 12);

  // Criar novo usuário com confirmação falsa
  const novoUsuario = {
    nome,
    email,
    senha,
    tipoUsuario,
    telefoneContato,
    isFuncionario: tipoUsuario === 'funcionario',
    confirmado: false,
    token: token
  };

  usuariosExistentes.push(novoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuariosExistentes));

  // Salva no sessionStorage para usar na próxima página
  sessionStorage.setItem('emailCadastro', email);
  sessionStorage.setItem('tokenCadastro', token);

  // Redireciona para página de confirmação de e-mail simulada
  window.location.href = "/public/confirmacao-email.html";
});

// Força da senha
document.getElementById('senha').addEventListener('input', function () {
  const password = this.value;
  let strength = 0;

  if (password.length >= 6) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

  strength = Math.min(strength, 3);

  const strengthTexts = ['fraca', 'média', 'forte', 'muito forte'];
  const strengthValue = document.getElementById('strength-value');
  const strengthBar = document.querySelector('.strength-bar');

  if (strengthValue) {
    strengthValue.textContent = strengthTexts[strength];
  }

  if (strengthBar) {
    strengthBar.classList.remove('fraca', 'media', 'forte', 'muito-forte');
    const classes = ['fraca', 'media', 'forte', 'muito-forte'];
    strengthBar.classList.add(classes[strength]);
    strengthBar.style.width = `${(strength + 1) * 25}%`;
  }
});
