// --- NAVEGAÇÃO ---
const navItems = document.querySelectorAll('.nav-item');
const tabs = {
  inicio: document.getElementById('tab-inicio'),
  alta: document.getElementById('tab-alta'),
  horarios: document.getElementById('tab-horarios'),
  ideias: document.getElementById('tab-ideias'),
  desempenho: document.getElementById('tab-desempenho'),
  planejamento: document.getElementById('tab-planejamento')
};

navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active de todos
    navItems.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Esconde todas as abas
    Object.values(tabs).forEach(tab => tab.classList.add('hidden'));
    
    // Mostra a aba clicada
    const target = btn.dataset.tab;
    tabs[target].classList.remove('hidden');

    // Ações ao entrar em abas específicas
    if (target === 'alta') loadTrending();
    if (target === 'horarios') loadBestTimes();
  });
});

// --- ABA: EM ALTA ---
async function loadTrending() {
  const grid = document.getElementById('trending-grid');
  grid.innerHTML = '<p class="loading">Buscando tendências...</p>';
  
  try {
    const res = await fetch('/api/trending?platform=all');
    const data = await res.json();
    
    if (!data.items || data.items.length === 0) {
      grid.innerHTML = '<div class="empty-state">Nenhuma tendência encontrada no momento.</div>';
      return;
    }

    // AQUI ESTÁ A CORREÇÃO: Agora usamos item.platform em vez de adivinhar pelo ID
    grid.innerHTML = data.items.map(item => `
      <div class="card">
        <span class="badge ${item.platform === 'tiktok' ? 'badge-tiktok' : 'badge-instagram'}">
          ${item.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
        </span>
        <h3 class="card-title">${item.titulo}</h3>
        <p class="card-text">
          ${item.views ? `🔥 ${(item.views/1000).toFixed(0)}k visualizações` : ''}
          ${item.likes ? `❤️ ${(item.likes/1000).toFixed(0)}k curtidas` : ''}
        </p>
        <span class="badge badge-success">${item.crescimento} de crescimento</span>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<div class="empty-state">Erro ao carregar tendências. Tente novamente mais tarde.</div>';
  }
}

// --- ABA: HORÁRIOS ---
document.getElementById('btn-load-times').addEventListener('click', loadBestTimes);

async function loadBestTimes() {
  const format = document.getElementById('time-format').value;
  const grid = document.getElementById('times-grid');
  grid.innerHTML = '<p class="loading">Calculando melhores horários...</p>';

  try {
    const res = await fetch(`/api/best-times?platform=instagram&format=${format}`);
    const data = await res.json();

    if (!data.heatmap || data.heatmap.length === 0) {
      grid.innerHTML = '<div class="empty-state">Ainda não temos dados suficientes para o seu perfil. Continue postando!</div>';
      return;
    }

    // Filtra os 3 melhores horários e traduz a linguagem
    const topTimes = data.heatmap.sort((a, b) => b.score - a.score).slice(0, 3);
    
    grid.innerHTML = topTimes.map((time, index) => {
      let mensagem = "Bom momento para publicar.";
      let badgeClass = "badge-instagram";
      
      if (index === 0) {
        mensagem = "Excelente oportunidade! Seu público está muito ativo neste horário.";
        badgeClass = "badge-success";
      } else if (index === 1) {
        mensagem = "Ótimo horário. Você terá boa visibilidade.";
      } else {
        mensagem = "Alternativa válida para testar.";
      }

      return `
        <div class="card">
          <span class="badge ${badgeClass}">${index === 0 ? '🌟 Melhor Horário' : '👍 Recomendado'}</span>
          <h3 class="card-title">${time.dia} às ${time.hora}h</h3>
          <p class="card-text">${mensagem}</p>
        </div>
      `;
    }).join('');

  } catch (err) {
    grid.innerHTML = '<div class="empty-state">Erro ao buscar horários.</div>';
  }
}

// --- ABA: DESEMPENHO ---
document.getElementById('btn-analyze').addEventListener('click', async () => {
  const user = document.getElementById('analyze-user').value.trim();
  const resultBox = document.getElementById('analyze-result');
  
  if (!user) {
    resultBox.innerHTML = '<div class="empty-state">Por favor, digite seu nome de usuário.</div>';
    return;
  }

  resultBox.innerHTML = '<p class="loading">Analisando perfil...</p>';

  try {
    const res = await fetch(`/api/analyze?username=${encodeURIComponent(user)}&platform=instagram`);
    const data = await res.json();

    resultBox.innerHTML = `
      <div class="grid">
        <div class="card">
          <h3 class="card-title">Resumo do Perfil @${data.username}</h3>
          <p class="card-text">${data.message}</p>
          <div style="margin-top: 16px;">
            <strong>Melhores horários sugeridos:</strong><br>
            ${data.suggested_times.map(t => `<span class="badge badge-success">${t}</span>`).join(' ')}
          </div>
          <div style="margin-top: 16px;">
            <strong>Formatos recomendados:</strong><br>
            ${data.suggested_formats.map(f => `<span class="badge badge-instagram">${f}</span>`).join(' ')}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    resultBox.innerHTML = '<div class="empty-state">Erro ao analisar o perfil. Verifique o nome e tente novamente.</div>';
  }
});
