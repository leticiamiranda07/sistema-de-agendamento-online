import { usuarios } from "./dados-usuarios.js";

document.getElementById('identificador').addEventListener('input', function () {
  const valor = this.value.trim();
  const ehEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  document.getElementById('funcionarioGroup').style.display = ehEmail ? 'block' : 'none';
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const identificador = document.getElementById('identificador').value.trim();
  const senha = document.getElementById('senha').value;

  const usuario = usuarios.find(u => u.email === identificador && u.senha === senha);

  if (!usuario) {
    alert("E-mail ou senha incorretos.");
    return;
  }

  // Salva o usuário logado no localStorage
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  if (usuario.isFuncionario) {
    window.location.href = "painel_admin.html";
  } else {
    window.location.href = "painel_usuario.html";
  }
});
