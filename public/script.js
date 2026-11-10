// --- NAVEGAÇÃO ENTRE ABAS ---
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
    // Remove a classe 'active' de todos os botões
    navItems.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Esconde todas as seções
    Object.values(tabs).forEach(tab => {
      if (tab) tab.classList.add('hidden');
    });
    
    // Mostra a seção correspondente
    const target = btn.dataset.tab;
    if (tabs[target]) {
      tabs[target].classList.remove('hidden');
    }

    // Ações específicas ao entrar em abas
    if (target === 'alta') loadTrending();
    if (target === 'horarios') loadBestTimes();
  });
});

// --- ABA: EM ALTA (TENDÊNCIAS POR NICHO) ---
async function loadTrending() {
  const grid = document.getElementById('trending-grid');
  const nichoSelect = document.getElementById('nicho-select');
  
  if (!grid) return;
  
  // Pega o nicho selecionado (se não achar, usa 'tecnologia' como padrão)
  const nicho = nichoSelect ? nichoSelect.value : 'tecnologia';
  
  grid.innerHTML = '<p class="loading">Buscando tendências...</p>';
  
  try {
    // A chamada à API agora inclui o parâmetro 'nicho'
    const res = await fetch(`/api/trending?platform=all&nicho=${nicho}`);
    const data = await res.json();
    
    if (!data.items || data.items.length === 0) {
      grid.innerHTML = '<div class="empty-state"><h3>Nenhuma tendência encontrada</h3><p>Tente outro nicho ou volte mais tarde.</p></div>';
      return;
    }

    // Renderiza os cards
    grid.innerHTML = data.items.map(item => {
      let badgeClass = 'badge-instagram';
      let platformName = 'Instagram';
      if (item.platform === 'tiktok') { badgeClass = 'badge-tiktok'; platformName = 'TikTok'; }
      else if (item.platform === 'x') { badgeClass = 'badge-x'; platformName = 'X (Twitter)'; }

      return `
        <div class="card">
          <div class="card-header">
            <span class="badge ${badgeClass}">${platformName}</span>
          </div>
          <h3 class="card-title">${item.titulo}</h3>
          <p class="card-text">
            ${item.views ? `Visualizações: ${(item.views/1000).toFixed(0)}k` : ''}
            ${item.likes ? ` • Curtidas: ${(item.likes/1000).toFixed(0)}k` : ''}
          </p>
          <div style="margin-top: 16px;">
            <span class="badge badge-success">${item.crescimento}</span>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    grid.innerHTML = '<div class="empty-state"><h3>Erro de conexão</h3><p>Não foi possível carregar as tendências agora.</p></div>';
  }
}

// --- ATUALIZAR TENDÊNCIAS AO MUDAR O NICHO ---
document.addEventListener('DOMContentLoaded', () => {
    const nichoSelect = document.getElementById('nicho-select');
    if (nichoSelect) {
        nichoSelect.addEventListener('change', loadTrending);
    }
});

// --- ABA: HORÁRIOS ---
const btnLoadTimes = document.getElementById('btn-load-times');
if (btnLoadTimes) {
    btnLoadTimes.addEventListener('click', loadBestTimes);
}

async function loadBestTimes() {
  const timeFormat = document.getElementById('time-format');
  const grid = document.getElementById('times-grid');
  
  if (!timeFormat || !grid) return;
  
  const format = timeFormat.value;
  grid.innerHTML = '<p class="loading">Calculando melhores horários...</p>';

  try {
    const res = await fetch(`/api/best-times?platform=instagram&format=${format}`);
    const data = await res.json();

    if (!data.heatmap || data.heatmap.length === 0) {
      grid.innerHTML = '<div class="empty-state"><h3>Dados insuficientes</h3><p>Continue postando para gerar análise.</p></div>';
      return;
    }

    const topTimes = data.heatmap.sort((a, b) => b.score - a.score).slice(0, 3);
    
    grid.innerHTML = topTimes.map((time, index) => {
      let mensagem = "Alternativa válida para testar.";
      let badgeClass = "badge-purple";
      let badgeText = "Recomendado";
      
      if (index === 0) {
        mensagem = "Excelente oportunidade! Seu público está muito ativo neste horário.";
        badgeClass = "badge-success";
        badgeText = "Melhor Horário";
      } else if (index === 1) {
        mensagem = "Ótimo horário. Você terá boa visibilidade.";
      }

      return `
        <div class="card">
          <div class="card-header">
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
          <h3 class="card-title">${time.dia} às ${time.hora}h</h3>
          <p class="card-text">${mensagem}</p>
        </div>
      `;
    }).join('');

  } catch (err) {
    grid.innerHTML = '<div class="empty-state"><h3>Erro ao buscar</h3><p>Tente novamente.</p></div>';
  }
}

// --- ABA: DESEMPENHO ---
const btnAnalyze = document.getElementById('btn-analyze');
if (btnAnalyze) {
    btnAnalyze.addEventListener('click', async () => {
      const userInput = document.getElementById('analyze-user');
      const resultBox = document.getElementById('analyze-result');
      
      if (!userInput || !resultBox) return;
      
      const user = userInput.value.trim();
      
      if (!user) {
        resultBox.innerHTML = '<div class="empty-state"><h3>Atenção</h3><p>Por favor, digite seu nome de usuário.</p></div>';
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
              <div style="margin-top: 24px;">
                <strong style="display:block; margin-bottom:8px;">Horários sugeridos:</strong>
                ${data.suggested_times.map(t => `<span class="badge badge-success" style="margin-right:4px;">${t}</span>`).join(' ')}
              </div>
              <div style="margin-top: 16px;">
                <strong style="display:block; margin-bottom:8px;">Formatos recomendados:</strong>
                ${data.suggested_formats.map(f => `<span class="badge badge-purple" style="margin-right:4px;">${f}</span>`).join(' ')}
              </div>
            </div>
          </div>
        `;
      } catch (err) {
        resultBox.innerHTML = '<div class="empty-state"><h3>Erro</h3><p>Erro ao analisar o perfil.</p></div>';
      }
    });
}
