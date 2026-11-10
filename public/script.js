// ... (código de navegação existente) ...

// --- ABA: EM ALTA (TENDÊNCIAS) ---
async function loadTrending() {
  const grid = document.getElementById('trending-grid');
  const nicho = document.getElementById('nicho-select').value; // Pega o nicho selecionado
  
  grid.innerHTML = '<p class="loading">Buscando tendências...</p>';
  
  try {
    // A chamada à API agora inclui o parâmetro 'nicho'
    const res = await fetch(`/api/trending?platform=all&nicho=${nicho}`);
    const data = await res.json();
    
    if (!data.items || data.items.length === 0) {
      grid.innerHTML = '<div class="empty-state"><h3>Nenhuma tendência encontrada</h3><p>Tente outro nicho ou volte mais tarde.</p></div>';
      return;
    }

    // Renderiza os cards (o código de formatação dos badges permanece o mesmo)
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

// --- Adicionar Event Listener ao Seletor de Nicho ---
// Este código garante que ao mudar o nicho, a lista de tendências seja atualizada automaticamente.
document.addEventListener('DOMContentLoaded', () => {
    const nichoSelect = document.getElementById('nicho-select');
    if (nichoSelect) {
        nichoSelect.addEventListener('change', loadTrending);
    }
});

// ... (restante do código: loadBestTimes, analyze, etc.) ...
