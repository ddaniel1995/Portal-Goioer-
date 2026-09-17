import { Article, Category, Banner, VisualIdentity, FacebookConfig, SitePopup } from '../types';

export const initialCategories: Category[] = [
  { id: 'cat-politica', name: 'Política', slug: 'politica', order: 1, color: '#2563eb', description: 'Notícias do cenário político nacional e internacional', showOnHome: true },
  { id: 'cat-goioere', name: 'Goioerê', slug: 'goioere', order: 2, color: '#059669', description: 'Notícias de Goioerê, comunidade, obras e acontecimentos locais', showOnHome: true },
  { id: 'cat-estado', name: 'Estado', slug: 'estado', order: 3, color: '#0284c7', description: 'Cobertura completa do Paraná e cidades da região', showOnHome: true },
  { id: 'cat-esportes', name: 'Esportes', slug: 'esportes', order: 4, color: '#0891b2', description: 'Futebol, campeonatos regionais e cobertura esportiva', showOnHome: true },
  { id: 'cat-entretenimento', name: 'Entretenimento', slug: 'entretenimento', order: 5, color: '#db2777', description: 'Celebridades, streaming, séries, shows e eventos', showOnHome: true },
  { id: 'cat-economia', name: 'Economia', slug: 'economia', order: 6, color: '#0d9488', description: 'Mercado financeiro, negócios, agronegócio e finanças pessoais', showOnHome: true },
  { id: 'cat-educacao', name: 'Educação', slug: 'educacao', order: 7, color: '#d97706', description: 'Inovações no ensino, vestibulares e universidades', showOnHome: true },
  { id: 'cat-saude', name: 'Saúde', slug: 'saude', order: 8, color: '#dc2626', description: 'Medicina, bem-estar, vacinas e qualidade de vida', showOnHome: true },
  { id: 'cat-cultura', name: 'Cultura', slug: 'cultura', order: 9, color: '#7c3aed', description: 'Artes, literatura, cinema e patrimônio histórico', showOnHome: true },
  { id: 'cat-podcast', name: 'Podcast', slug: 'podcast', order: 10, color: '#8b5cf6', description: 'Galeria de episódios em vídeo com debates e entrevistas exclusivas', showOnHome: true },
];

export const initialArticles: Article[] = [
  {
    id: 'art-prefeito-goioere',
    title: 'Prefeito anuncia novo projeto de modernização e infraestrutura para Goioerê',
    slug: 'prefeito-anuncia-novo-projeto-de-modernizacao-e-infraestrutura-para-goioere',
    subtitle: 'Pacote de obras inclui pavimentação asfáltica, iluminação pública em LED e revitalização de praças nos bairros.',
    content: `<h2>Investimentos históricos em desenvolvimento urbano</h2>
<p>Em coletiva de imprensa realizada no Paço Municipal de Goioerê, o prefeito anunciou um novo e abrangente pacote de investimentos em infraestrutura urbana e qualidade de vida para a população.</p>
<p>O projeto contempla mais de 30 mil metros quadrados de novo recape asfáltico, ampliação da rede de iluminação em LED e a reforma completa de espaços de convivência comunitária nos principais bairros da cidade.</p>
<blockquote>"Goioerê vive um momento especial de crescimento. Nosso compromisso é transformar a infraestrutura da cidade, gerando empregos e valorizando o comércio e a vida de cada família", ressaltou o chefe do Executivo municipal.</blockquote>
<h3>Etapas e cronograma das obras</h3>
<p>As equipes técnicas da Secretaria de Obras já deram início ao mapeamento topográfico e as intervenções começarão pelas vias de maior tráfego de transporte coletivo e escoamento da produção rural.</p>`,
    categoryId: 'cat-goioere',
    categoryName: 'Goioerê',
    featuredImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Apresentação do projeto de infraestrutura urbana em Goioerê. Foto: Divulgação',
    additionalImages: [
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800&auto=format&fit=crop'
    ],
    publishedAt: '2026-09-15T10:00:00Z',
    author: 'Equipe de Jornalismo',
    authorRole: 'Redação Goioerê',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    views: 2840,
    isHighlight: true,
    facebookAutoPublish: false,
    facebookPublished: true,
  },
  {
    id: 'art-1',
    title: 'Congresso aprova novo marco da transição energética com foco em energias limpas',
    slug: 'congresso-aprova-novo-marco-transicao-energetica',
    subtitle: 'Texto estabelece incentivos fiscais para usinas solares e eólicas offshore e prevê investimentos de R$ 45 bilhões nos próximos cinco anos.',
    content: `<h2>Avanço histórico na matriz sustentável</h2>
<p>O Plenário do Congresso Nacional concluiu ontem a votação do novo marco regulatório para o setor de energias renováveis. A proposta aprovada foi elogiada por ambientalistas e lideranças do setor industrial por criar diretrizes claras de investimento a longo prazo.</p>
<p>Segundo o relator da matéria, a nova legislação posiciona o país na vanguarda da economia de baixo carbono no continente sul-americano, viabilizando a geração de mais de 80 mil postos de trabalho diretos e indiretos.</p>
<blockquote>"Esta lei consolida um compromisso das próximas gerações com o meio ambiente e com uma matriz elétrica confiável, moderna e acessível para todos os brasileiros", destacou o presidente da comissão.</blockquote>
<h3>Principais pontos do texto aprovado</h3>
<p>Dentre as medidas contempladas no novo marco, destacam-se:</p>
<ul>
<li>Isenção progressiva de impostos para componentes tecnológicos produzidos em solo nacional;</li>
<li>Linhas de crédito com juros subsidiados para pequenos produtores rurais que instalarem painéis fotovoltaicos;</li>
<li>Criação de um fundo soberano de pesquisa em hidrogênio verde;</li>
<li>Regulamentação e segurança jurídica para leilões de energia eólica marítima.</li>
</ul>
<p>A matéria agora segue para sanção presidencial, com previsão de promulgação antes do encerramento da sessão legislativa.</p>`,
    categoryId: 'cat-politica',
    categoryName: 'Política',
    featuredImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Parque de energia eólica e solar no interior do país. Foto: Agência Nacional/Divulgação',
    additionalImages: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop'
    ],
    publishedAt: '2026-09-11T09:30:00Z',
    author: 'Mariana Drummond',
    authorRole: 'Correspondente de Política',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=13iQzF4Rk7U',
    status: 'published',
    views: 1420,
    isHighlight: true,
    facebookAutoPublish: true,
    facebookPublished: true,
    facebookPostId: 'fb_post_99214481_01',
    facebookPublishedAt: '2026-09-11T09:32:00Z',
  },
  {
    id: 'art-2',
    title: 'Banco Central anuncia nova rodada de expansão do PIX com pagamentos recorrentes automáticos',
    slug: 'banco-central-anuncia-expansao-pix-automatico',
    subtitle: 'Nova funcionalidade permitirá cobranças de serviços contínuos como escolas, academias e contas de concessionárias sem custo ao consumidor.',
    content: `<h2>Praticidade para consumidores e redução de custos operacionais</h2>
<p>O Banco Central apresentou os detalhes técnicos da fase final de implementação do PIX Automático. A ferramenta começará a funcionar em todo o sistema financeiro com o objetivo de substituir modalidades tradicionais como o débito automático e boletos bancários em compras parceladas.</p>
<p>Com essa inovação, o usuário precisará autorizar uma única vez o débito mensal por meio do aplicativo de sua instituição bancária de preferência. A qualquer momento, o titular poderá revogar o consentimento ou estipular limites máximos para as transações.</p>
<h3>Vantagens para micro e pequenos empresários</h3>
<p>Especialistas do setor de pagamentos destacam que a taxa de inadimplência deve cair substancialmente, além de zerar os custos recorrentes cobrados por intermediárias de cartões nas assinaturas.</p>`,
    categoryId: 'cat-economia',
    categoryName: 'Economia',
    featuredImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Sistema bancário digital em dispositivos móveis. Foto: Pixabay',
    additionalImages: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop'
    ],
    publishedAt: '2026-09-11T08:15:00Z',
    author: 'Carlos Eduardo Nogueira',
    authorRole: 'Analista Econômico',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    status: 'published',
    views: 980,
    isHighlight: true,
    facebookAutoPublish: true,
    facebookPublished: false,
  },
  {
    id: 'art-3',
    title: 'Universidades públicas inauguram 15 centros de inteligência artificial aplicada à medicina',
    slug: 'universidades-inauguram-centros-ia-medicina',
    subtitle: 'Consórcio interinstitucional vai acelerar diagnósticos precoces de doenças raras e auxiliar médicos em regiões isoladas do país.',
    content: `<h2>Ciência nacional a serviço da vida</h2>
<p>Uma parceria inédita entre o Ministério da Ciência e Tecnologia e as principais universidades públicas do país resultou na abertura simultânea de 15 laboratórios dedicados à Inteligência Artificial diagnóstica.</p>
<p>Os sistemas desenvolvidos pelos pesquisadores brasileiros foram treinados com prontuários anonimizados e dados epidemiológicos regionais, garantindo alta precisão na detecção de patologias tropicais e tumores em estágios iniciais.</p>
<p>Os softwares serão integrados de maneira gratuita aos hospitais universitários e postos da rede básica de atenção à saúde.</p>`,
    categoryId: 'cat-educacao',
    categoryName: 'Educação',
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Pesquisadores analisam exames em centro de tecnologia aplicada.',
    additionalImages: [],
    publishedAt: '2026-09-10T18:40:00Z',
    author: 'Fernanda Vasconcellos',
    authorRole: 'Repórter de Ciência e Educação',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    views: 750,
    isHighlight: false,
    facebookAutoPublish: false,
    facebookPublished: false,
  },
  {
    id: 'art-4',
    title: 'Campanha nacional de vacinação atinge meta histórica com adesão de 94% do público-alvo',
    slug: 'campanha-vacinacao-atinge-meta-historica',
    subtitle: 'Busca ativa escolar e postos volantes em fins de semana impulsionaram a cobertura imunológica em todos os estados.',
    content: `<h2>Saúde pública celebra êxito das estratégias descentralizadas</h2>
<p>Os números consolidados divulgados pelo Ministério da Saúde comprovam a recuperação da cobertura vacinal em todo o território nacional. A marca de 94% de adesão representa o melhor índice dos últimos oito anos.</p>
<p>A estratégia envolveu a integração direta com as secretarias municipais de educação, permitindo que as equipes levassem as doses diretamente às salas de aula mediante prévia autorização dos pais e responsáveis.</p>
<p>Médicos infectologistas ressaltam que a alta taxa afasta o risco de reintrodução de enfermidades como sarampo e poliomielite.</p>`,
    categoryId: 'cat-saude',
    categoryName: 'Saúde',
    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Profissional de saúde preparando imunizante em posto municipal.',
    additionalImages: [],
    publishedAt: '2026-09-10T14:10:00Z',
    author: 'Dr. Roberto Silveira',
    authorRole: 'Colunista de Saúde',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    views: 1120,
    isHighlight: false,
    facebookAutoPublish: true,
    facebookPublished: true,
    facebookPostId: 'fb_post_881920_saude',
    facebookPublishedAt: '2026-09-10T14:15:00Z',
  },
  {
    id: 'art-5',
    title: 'Seleção Brasileira vence clássico com golaço nos acréscimos e garante vaga no torneio continental',
    slug: 'selecao-vence-classico-acrescimos',
    subtitle: 'Em partida eletrizante diante de mais de 70 mil torcedores, equipe mostrou poder de reação após empate no tempo regulamentar.',
    content: `<h2>Emoção até o último apito do árbitro</h2>
<p>Em uma noite mágica no estádio lotado, a Seleção Brasileira conquistou uma vitória memorável contra seu maior rival histórico. O gol que selou a classificação saiu aos 48 minutos do segundo tempo, com um chute certeiro de fora da área no ângulo esquerdo.</p>
<p>O técnico elogiou o preparo psicológico do elenco, que soube manter a posse e criar jogadas de profundidade mesmo sob forte pressão defensiva adversária.</p>
<h3>Próximos compromissos</h3>
<p>A delegação embarca na próxima semana para a rodada de amistosos preparatórios no continente europeu antes da fase de grupos oficial.</p>`,
    categoryId: 'cat-esportes',
    categoryName: 'Esportes',
    featuredImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Torcida comemora vitória histórica no estádio.',
    additionalImages: [
      'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=800&auto=format&fit=crop'
    ],
    publishedAt: '2026-09-09T22:50:00Z',
    author: 'Luciano Prado',
    authorRole: 'Editor de Esportes',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    status: 'published',
    views: 3100,
    isHighlight: true,
    facebookAutoPublish: true,
    facebookPublished: true,
    facebookPostId: 'fb_post_esporte_3301',
    facebookPublishedAt: '2026-09-09T22:55:00Z',
  },
  {
    id: 'art-6',
    title: 'Festival Internacional de Cinema divulga programação com mais de 180 filmes de 45 países',
    slug: 'festival-cinema-divulga-programacao-completa',
    subtitle: 'Mostra homenageará os 70 anos do cinema independente brasileiro com exibições gratuitas ao ar livre e debates com cineastas.',
    content: `<h2>O melhor da sétima arte invade as praças e salas de exibição</h2>
<p>A organização do mais tradicional festival de cinema da América Latina divulgou o calendário oficial da sua 32ª edição. Ao longo de doze dias de evento, o público poderá acompanhar estreias mundiais, debates com realizadores e oficinas de roteiro e animação.</p>
<p>Mais de 40% das obras selecionadas foram dirigidas por mulheres ou novos realizadores de regiões historicamente sub-representadas na indústria cinematográfica.</p>`,
    categoryId: 'cat-cultura',
    categoryName: 'Cultura',
    featuredImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Sala de cinema clássica durante sessão especial.',
    additionalImages: [],
    publishedAt: '2026-09-09T16:00:00Z',
    author: 'Beatriz Sampaio',
    authorRole: 'Crítica Cultural',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    views: 640,
    isHighlight: false,
    facebookAutoPublish: false,
    facebookPublished: false,
  },
  {
    id: 'art-7',
    title: 'Prefeitura entrega 35 km de novas ciclovias conectando estações de metrô e terminais de ônibus',
    slug: 'prefeitura-entrega-ciclovias-conectando-transporte',
    subtitle: 'Iniciativa faz parte do plano diretor de mobilidade sustentável para reduzir emissões de poluentes e desafogar vias arteriais.',
    content: `<h2>Integração modal ganha fôlego nas grandes avenidas</h2>
<p>A capital inaugurou nesta quinta-feira novos trechos cicloviários totalmente segregados do tráfego automotivo. O projeto conecta os maiores terminais de passageiros da zona leste ao polo comercial central.</p>
<p>As faixas contam com piso antiderrapante, semáforos exclusivos para ciclistas e estações com bombas de ar e ferramentas para reparo rápido de bicicletas.</p>
<p>Pesquisas preliminares apontam que mais de 25 mil viagens diárias devem migrar do transporte individual para a modalidade ativa.</p>`,
    categoryId: 'cat-cidade',
    categoryName: 'Cidade',
    featuredImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Ciclista em faixa protegida em grande centro urbano.',
    additionalImages: [],
    publishedAt: '2026-09-08T11:20:00Z',
    author: 'Rodrigo Mello',
    authorRole: 'Repórter Urbano',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    views: 890,
    isHighlight: false,
    facebookAutoPublish: true,
    facebookPublished: false,
  },
  {
    id: 'art-8',
    title: 'Superprodução de ficção científica quebra recordes de bilheteria e emociona público mundial',
    slug: 'superproducao-ficcao-cientifica-quebra-recordes',
    subtitle: 'Com efeitos práticos impressionantes e trilha sonora grandiosa, longa-metragem atinge 1 bilhão de dólares em duas semanas.',
    content: `<h2>Sucesso unânime entre público e crítica</h2>
<p>O cinema de ficção científica vive um momento histórico com o lançamento global que vem arrastando multidões a salas IMAX ao redor do globo. A crítica tem destacado a profundidade do roteiro que aborda comunicação interespécies e a fragilidade do planeta Terra.</p>
<p>O diretor revelou em entrevista que quase 80% das sequências espaciais foram gravadas sem auxílio de telas verdes artificiais, recorrendo a miniaturas e maquinários giratórios para simular gravidade zero.</p>`,
    categoryId: 'cat-entretenimento',
    categoryName: 'Entretenimento',
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Cena com estética futurista de iluminação cinematográfica.',
    additionalImages: [],
    publishedAt: '2026-09-07T20:15:00Z',
    author: 'Juliana Portela',
    authorRole: 'Colunista de Cinema e TV',
    authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    status: 'published',
    views: 1850,
    isHighlight: true,
    facebookAutoPublish: false,
    facebookPublished: false,
  },
  {
    id: 'art-pod-1',
    title: 'Podcast Visão Global #24: Inteligência Artificial, Ética e os Rumos do Emprego no Brasil',
    slug: 'podcast-visao-global-24-inteligencia-artificial-etica-emprego',
    subtitle: 'Neste episódio especial, especialistas discutem a regulação de algoritmos, novas habilidades no mercado e impactos nos setores de tecnologia e educação.',
    content: `<h2>Debate aprofundado com pioneiros em inovação</h2>
<p>Seja bem-vindo a mais um episódio do nosso Podcast oficial. Neste capítulo, reunimos pesquisadores em tecnologia e lideranças empresariais para destrinchar os mitos e realidades da revolução tecnológica atual.</p>
<p>Dentre os temas centrais discutidos:</p>
<ul>
<li>Como as novas ferramentas estão sendo adotadas no setor público e privado brasileiro;</li>
<li>Diretrizes éticas e proteção aos direitos autorais;</li>
<li>Dicas práticas para transição de carreira na era digital.</li>
</ul>
<p>Dê o play no reprodutor acima para assistir ao episódio completo com áudio de alta fidelidade e recursos visuais.</p>`,
    categoryId: 'cat-podcast',
    categoryName: 'Podcast',
    featuredImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Gravação do estúdio de podcast do portal com os convidados.',
    additionalImages: [
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop'
    ],
    publishedAt: '2026-09-14T18:00:00Z',
    author: 'Rodrigo Medeiros',
    authorRole: 'Apresentador do Podcast',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=13iQzF4Rk7U',
    status: 'published',
    views: 3240,
    isHighlight: true,
    facebookAutoPublish: false,
    facebookPublished: false,
  },
  {
    id: 'art-pod-2',
    title: 'Podcast Economia em Foco #18: Como Planejar seus Investimentos diante dos Juros Globais',
    slug: 'podcast-economia-em-foco-18-como-planejar-investimentos',
    subtitle: 'Conversa franca com economistas sobre renda fixa, inflação e estratégias seguras para famílias e pequenos negócios.',
    content: `<h2>Orientações financeiras claras e aplicáveis</h2>
<p>O cenário econômico internacional exige atenção redobrada dos poupadores e empreendedores. Nesta edição, tiramos dúvidas dos ouvintes e detalhamos como proteger seu patrimônio.</p>`,
    categoryId: 'cat-podcast',
    categoryName: 'Podcast',
    featuredImage: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Microfones e mesa de som durante a gravação ao vivo.',
    additionalImages: [],
    publishedAt: '2026-09-12T15:30:00Z',
    author: 'Camila Albuquerque',
    authorRole: 'Economista & Host Convidada',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    status: 'published',
    views: 2180,
    isHighlight: false,
    facebookAutoPublish: false,
    facebookPublished: false,
  },
  {
    id: 'art-pod-3',
    title: 'Podcast Saúde & Bem-Estar #09: Sono, Longevidade e a Ciência da Produtividade',
    slug: 'podcast-saude-bem-estar-09-sono-longevidade-ciencia',
    subtitle: 'Médicos neurologistas explicam os segredos de um descanso reparador e como pequenas mudanças na rotina transformam a saúde mental.',
    content: `<h2>O impacto direto do sono na imunidade e raciocínio</h2>
<p>Episódio imperdível sobre hábitos modernos, higiene do sono e desmistificação de suplementos alimentares.</p>`,
    categoryId: 'cat-podcast',
    categoryName: 'Podcast',
    featuredImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Estúdio de gravação de áudio e vídeo.',
    additionalImages: [],
    publishedAt: '2026-09-09T11:00:00Z',
    author: 'Dr. Fernando Lins',
    authorRole: 'Especialista em Medicina do Sono',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    status: 'published',
    views: 1940,
    isHighlight: false,
    facebookAutoPublish: false,
    facebookPublished: false,
  }
];

export const initialBanners: Banner[] = [
  {
    id: 'ban-slide-1',
    title: 'Transformação Digital no Brasil 2026',
    description: 'Acompanhe a cobertura especial sobre inovações tecnológicas e novos mercados sustentáveis no nosso portal.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    targetUrl: 'https://brasil.gov.br',
    position: 'slideshow',
    order: 1,
    active: true,
    width: 1600,
    height: 600,
    clicks: 142
  },
  {
    id: 'ban-slide-2',
    title: 'Educação do Futuro: Novas Tecnologias nas Escolas',
    description: 'Confira as metodologias ativas que estão revolucionando o aprendizado no ensino básico e superior.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop',
    targetUrl: 'https://mec.gov.br',
    position: 'slideshow',
    order: 2,
    active: true,
    width: 1600,
    height: 600,
    clicks: 98
  },
  {
    id: 'ban-slide-3',
    title: 'Temporada Cultural 2026: Museus, Teatros e Concertos',
    description: 'Mais de 300 espetáculos com ingressos acessíveis e gratuidades para estudantes e idosos.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    targetUrl: 'https://cultura.gov.br',
    position: 'slideshow',
    order: 3,
    active: true,
    width: 1600,
    height: 600,
    clicks: 67
  },
  {
    id: 'ban-side-1',
    title: 'Fundação Cultural do Estado',
    description: 'Apoiador oficial do jornalismo independente e divulgação de artes regionais.',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=600&auto=format&fit=crop',
    targetUrl: 'https://example.com/cultura',
    position: 'sidebar',
    order: 1,
    active: true,
    width: 600,
    height: 500,
    type: 'supporter',
    badgeText: 'Apoiador Cultural',
    clicks: 84
  },
  {
    id: 'ban-side-2',
    title: 'Exposição Arte & Modernidade 2026',
    description: 'Mostra internacional com obras inéditas de artistas contemporâneos.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
    targetUrl: 'https://example.com/exposicao',
    position: 'sidebar',
    order: 2,
    active: true,
    width: 600,
    height: 600,
    type: 'art',
    badgeText: 'Arte & Cultura',
    clicks: 115
  },
  {
    id: 'ban-side-3',
    title: 'Fórum Nacional de Sustentabilidade & Negócios',
    description: 'Inscrições abertas para o principal encontro socioambiental do ano.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop',
    targetUrl: 'https://example.com/forum',
    position: 'sidebar',
    order: 3,
    active: true,
    width: 600,
    height: 400,
    type: 'partner',
    badgeText: 'Parceiro Oficial',
    clicks: 45
  },
  {
    id: 'ban-body-1',
    title: 'Especial Grandes Reportagens 2026: Inovação e Sustentabilidade',
    description: 'Série exclusiva com matérias investigativas, entrevistas em vídeo e dados inéditos sobre os novos desafios globais.',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop',
    targetUrl: 'https://brasil.gov.br',
    position: 'body_slideshow',
    order: 1,
    active: true,
    width: 1600,
    height: 480,
    clicks: 62
  },
  {
    id: 'ban-body-2',
    title: 'Congresso Internacional de Comunicação e Novas Tecnologias',
    description: 'Inscreva-se com condições exclusivas para estudantes e profissionais de comunicação de todo o país.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop',
    targetUrl: 'https://example.com/congresso',
    position: 'body_slideshow',
    order: 2,
    active: true,
    width: 1600,
    height: 480,
    clicks: 39
  }
];

export const initialVisualIdentity: VisualIdentity = {
  siteName: 'PORTAL NOTÍCIAS',
  tagline: 'Jornalismo independente, ágil e com credibilidade',
  showSiteName: true,
  logoSize: 'md',
  logoHeight: 44,
  description: 'O seu portal diário de informações com cobertura abrangente de política, economia, educação, saúde, esportes e cultura com compromisso ético e verdade.',
  logoDisplayMode: 'both',
  logoColorUrl: '', // Uses dynamic modern SVG logo if empty, or uploaded data/image URL
  logoMonoUrl: '',
  contactEmail: 'redacao@portalnoticias.com.br',
  contactPhone: '+55 (11) 3456-7890',
  address: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP, Brasil',
  colors: {
    primary: '#dc2626',
    topBarBg: '#0f172a',
    headerBg: 'white',
    footerBg: '#020617',
    pageBg: '#f8fafc',
  },
  typography: {
    fontFamily: 'plus_jakarta_sans',
    headingFontFamily: 'same',
    baseFontSize: 'base',
  },
  socialMedia: {
    facebook: 'https://facebook.com/portalnoticiasoficial',
    instagram: 'https://instagram.com/portalnoticias',
    twitter: 'https://twitter.com/portalnoticias',
    youtube: 'https://youtube.com/@portalnoticias',
    whatsapp: 'https://whatsapp.com/channel/0029VaPortal'
  }
};

export const initialFacebookConfig: FacebookConfig = {
  connected: true,
  pageId: '104829104829104',
  pageName: 'Portal Notícias Oficial',
  pageAccessToken: 'EAAG..._TOKEN_EXEMPLO_CONFIGURAVEL',
  autoPublishEnabled: true,
  defaultTemplate: `[TITULO]

[RESUMO]

Leia a matéria completa no Portal:
[LINK]`,
  lastCheckStatus: 'success',
  lastCheckMessage: 'Conexão ativa e validada com a Página do Facebook.',
  lastPublishStatus: 'success',
  lastPublishDate: '2026-09-11T09:32:00Z'
};

export const initialSitePopup: SitePopup = {
  id: 'popup-principal',
  title: 'Destaque do Portal Notícias',
  subtitle: 'Fique por dentro dos principais acontecimentos com a melhor cobertura jornalística.',
  imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop',
  targetUrl: '',
  active: false, // Inativo por padrão até o usuário ativar ou anexar sua imagem
  showOnHomeOnly: true,
  frequency: 'once_per_session',
  buttonText: 'Acessar Agora',
};
