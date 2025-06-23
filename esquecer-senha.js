document.getElementById('recoveryForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const identificador = document.getElementById('recovery-identifier').value.trim();

  if (!identificador) {
    alert('Por favor, insira um e-mail.');
    return;
  }

  const ehEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador);

  if (!ehEmail) {
    alert('A recuperação de senha simulada só está disponível por e-mail.');
    return;
  }

  alert(' Um link de redefinição de senha foi enviado para ' + identificador);
  window.location.href = 'login.html';
});
document.getElementById('recoveryForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('recovery-identifier').value.trim();
    
  window.location.href = `recuperar-senha.html?email=${encodeURIComponent(email)}`;
});

