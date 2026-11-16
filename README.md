# Social Trends

Radar responsivo de referências por rede social e nicho. HTML, CSS e JavaScript sem compilação, com API FastAPI para a Vercel.

## O que funciona

- Abas para TikTok, Instagram, X, YouTube e Facebook.
- Dez nichos, busca com acentos normalizados, ordenação por visualizações, curtidas e crescimento ilustrativo, períodos e carregamento progressivo.
- Detalhes dos conteúdos, salvos persistidos em localStorage e planejador de pautas com data.
- Ideias editoriais e mapa demonstrativo de horários.
- Navegação por teclado, diálogos acessíveis e layout responsivo.

## Dados e limites

A prévia estática usa `public/demo-data.json`, com 100 exemplos fictícios. As métricas, os criadores e os conteúdos demonstrativos são ilustrativos. Os períodos usam idades relativas de exemplo para manter a demonstração utilizável.

Na Vercel, a API pode buscar amostras por hashtags de TikTok e Instagram quando `APIFY_TOKEN` está configurado e um nicho específico foi selecionado. O uso do Apify pode consumir créditos da sua conta. Não há coleta real de X, YouTube ou Facebook nesta versão. Sem token, em falhas ou na visão de todos os nichos, a API devolve dados demonstrativos com `source: demo`. Nenhuma amostra equivale a um ranking global dos conteúdos mais acessados da rede. Na coleta real, publicações sem data verificável são descartadas, assim como as fora do período.

As integrações dependem da disponibilidade, permissão e formato dos Actors do Apify. A API mantém cache de 15 minutos por processo. Uma implementação de grande escala deve usar coleta agendada, armazenamento compartilhado e fontes oficiais/licenciadas conforme a necessidade.

Salvos e planejamento ficam neste navegador e não sincronizam entre dispositivos. O mapa de horários é um exemplo, sem personalização. O planejador organiza pautas; não publica nas redes.

## Executar localmente

Prévia estática, sem dependências:

```bash
python -m http.server 3000 --directory public
```

Aplicação com API:

```bash
python -m pip install -r requirements.txt
uvicorn api.index:app --host 127.0.0.1 --port 3001
```

A API atende `/api/trending`, `/api/best-times` e `/api/analyze`. O servidor FastAPI não serve os arquivos estáticos; a Vercel faz esse roteamento via `vercel.json`.

## Publicar na Vercel

1. Substitua os arquivos do repositório pelos desta pasta, incluindo `public/`, `api/`, `requirements.txt` e `vercel.json`.
2. Mantenha o diretório raiz do projeto na raiz do repositório. A configuração usa os builders Python e estático e dispensa um comando de build.
3. Se quiser usar o Apify, configure `APIFY_TOKEN` em Settings → Environment Variables. Nunca coloque o token no JavaScript.
4. Faça um novo deploy na Vercel e teste `/api/trending?platform=tiktok&nicho=fitness&days=7`.

Variáveis opcionais: `TIKTOK_ACTOR_ID` (padrão `clockworks~tiktok-scraper`) e `INSTAGRAM_ACTOR_ID` (padrão `apify~instagram-scraper`). A coleta real não foi validada com credenciais nesta entrega.

## Imagens

Fotografias ilustrativas do Unsplash, armazenadas localmente em `public/assets/`. Não representam os criadores ou publicações listados. Fontes DM Sans e Manrope via Google Fonts, com fallback de sistema.
