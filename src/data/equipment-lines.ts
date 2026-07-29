import type { EquipmentLine } from '@/types'

/**
 * Linhas de equipamento — conteúdo migrado integralmente da página legada
 * página anterior. Aqui os equipamentos aparecem como parte da
 * solução de projeto, não como catálogo de venda.
 */
export const equipmentLines: EquipmentLine[] = [
  {
    id: 'mobiliario',
    name: 'Mobiliário inox',
    shortName: 'Mobiliário',
    icon: '/images/lines/mobiliario.png',
    statement:
      'Uma cozinha organizada não é detalhe. É o que separa uma equipe que produz de uma que improvisa.',
    intro: [
      'O mobiliário é a espinha dorsal de qualquer cozinha profissional. É ele que define o fluxo, organiza os processos e determina se a sua equipe vai trabalhar com eficiência ou perder tempo improvisando a cada turno.',
      'A linha de mobiliário Bianchini é fabricada sob medida em aço inox AISI 304 ou em outra liga a ser definida pelo cliente. Cada peça é projetada para o seu espaço, o seu volume e o seu ritmo de produção.',
    ],
    items: [
      {
        name: 'Mesas de preparo',
        description:
          'Com ou sem espelho, com ou sem prateleira inferior, em medidas padrão ou sob medida. Tampo em inox 18/8, estrutura tubular reforçada, pés reguláveis com sapatas.',
      },
      {
        name: 'Esteira transportadora de roletes',
        description:
          'Estrutura em inox AISI 304 com perfis de reforço e contraventamento tubular. Roletes em PVC alimentício de alta resistência e niveladores em poliamida — adaptável a qualquer piso.',
      },
      {
        name: 'Estantes e prateleiras',
        description:
          'Em inox tubular ou chapa, abertas ou fechadas, fixas ou móveis. Para despensa seca, câmara fria e áreas de estoque próximas à produção.',
      },
      {
        name: 'Pias e cubas',
        description:
          'Simples, duplas e triplas, embutidas ou sobre bancada. Profundidade e dimensões conforme a norma sanitária e o uso operacional específico.',
      },
      {
        name: 'Armários e gaveteiros',
        description:
          'Com portas de correr, basculantes ou de abater. Gavetas com corrediças telescópicas em inox e sequências numeradas para controle de insumos.',
      },
      {
        name: 'Grelhas de piso',
        description:
          'Em inox AISI 304, com grelha perfurada ou barras planas, dimensionada para encaixe preciso em canaletas e ralos. Cesta de retenção removível para higienização completa.',
      },
    ],
    gallery: [
      {
        src: '/images/projects/mobiliario-inox.jpg',
        alt: 'Conjunto de mobiliário em inox com bancada, gaveteiro, armários e pia dupla',
        caption: 'Conjunto de mobiliário com bancada, gaveteiro e pia',
      },
      {
        src: '/images/projects/producao-panificacao.jpg',
        alt: 'Área de produção de panificação com mesas largas em inox e fornos de lastro',
        caption: 'Mesas largas para panificação e confeitaria',
      },
      {
        src: '/images/projects/camara-fria-estantes.jpg',
        alt: 'Estantes em inox instaladas dentro de câmara fria',
        caption: 'Estantes para câmaras frias',
      },
    ],
  },
  {
    id: 'coccao',
    name: 'Cocção',
    shortName: 'Cocção',
    icon: '/images/lines/coccao.png',
    statement: 'Fogo no ponto certo, no tempo certo — é assim que uma cozinha sustenta o seu ritmo.',
    intro: [
      'A linha de cocção define a capacidade produtiva da cozinha. Equipamentos mal dimensionados criam gargalos invisíveis que custam caro no fim do mês: turnos mais longos, desperdício de insumo e qualidade inconsistente.',
      'A linha Bianchini é dimensionada para quem não pode parar — alto rendimento, uniformidade de temperatura e durabilidade que resiste ao uso intenso de segunda a domingo.',
    ],
    items: [
      {
        name: 'Fogões industriais',
        description:
          '2, 4, 6 e 8 bocas, com ou sem forno inferior. Queimadores duplo-coroa em ferro fundido, válvulas de segurança e estrutura em inox AISI 304 ou outra liga definida com o cliente.',
      },
      {
        name: 'Chapas e grelhas',
        description:
          'A gás ou elétricas, lisas ou ranhuradas. Temperaturas de até 300 °C com aquecimento uniforme em toda a superfície.',
      },
      {
        name: 'Fritadeiras industriais',
        description:
          'Com 1 ou 2 cestos e capacidade de 8 a 25 litros de óleo, com termostato de alta precisão.',
      },
      {
        name: 'Char-broilers',
        description:
          'Grelhas a gás de alto desempenho com decks em ferro fundido. Indicadas para proteínas em alta temperatura com marcação precisa.',
      },
      {
        name: 'Fornos e salamandras',
        description:
          'Câmaras com andares independentes, temperatura de até 250 °C e distribuição uniforme de calor. Salamandras a gás para gratinados e finalizações.',
      },
      {
        name: 'Frigideiras basculantes e caldeirões',
        description:
          'Frigideiras basculantes elétricas ou a gás em diversas capacidades. Caldeirões de 30 a 200 litros, com inclinação mecânica e base encapsulada em inox.',
      },
    ],
    gallery: [
      {
        src: '/images/projects/linha-de-fogoes.jpg',
        alt: 'Linha de cocção com fogões industriais, chapa e forno combinado sob coifa em inox',
        caption: 'Linha de cocção completa sob coifa',
      },
      {
        src: '/images/projects/fritadeiras-e-chapa.jpg',
        alt: 'Bateria de fritadeiras industriais ao lado de chapa e char-broiler em inox',
        caption: 'Bateria de fritadeiras e chapa',
      },
      {
        src: '/images/projects/fogao-industrial.jpg',
        alt: 'Fogão industrial de seis bocas em aço inox com prateleira inferior',
        caption: 'Fogão industrial de 6 bocas',
      },
    ],
  },
  {
    id: 'refrigeracao',
    name: 'Refrigeração',
    shortName: 'Refrigeração',
    icon: '/images/lines/refrigeracao.png',
    statement: 'Controle de temperatura é controle de custo. A cadeia fria começa no dimensionamento.',
    intro: [
      'Cada grau importa. A cadeia fria é uma das maiores fontes de perda em cozinhas profissionais — e também uma das mais fáceis de corrigir quando os equipamentos são dimensionados corretamente.',
      'A linha de refrigeração Bianchini mantém a cadeia fria intacta, do recebimento ao preparo, com equipamentos dimensionados para o volume real da operação e dentro da norma sanitária.',
    ],
    items: [
      {
        name: 'Câmaras frigoríficas',
        description:
          'Modulares em painel sanduíche (EPS ou poliuretano), portas com borracha magnética e evaporadores de baixo ruído. Dimensionadas pelo volume diário de produção.',
      },
      {
        name: 'Refrigeradores verticais',
        description:
          'De 1 a 4 portas, temperatura de 0 a 8 °C, revestimento interno em inox. Próprios para carne, lácteos, bebidas e mise en place.',
      },
      {
        name: 'Freezers verticais e horizontais',
        description:
          'De −18 a −22 °C, com degelo automático ou manual e capacidade de 200 a 1.200 litros conforme o modelo.',
      },
      {
        name: 'Balcões refrigerados',
        description:
          'Com tampa de vidro curvo ou reto, iluminação interna em LED e temperatura estabilizada. Para exposição de frios, lácteos e sobremesas.',
      },
      {
        name: 'Maketables e condimentadoras refrigeradas',
        description:
          'Mesas com tampa refrigerada para mise en place. Inserções GN 1/1 a 1/6, temperatura de 2 a 8 °C e superfície de trabalho integrada.',
      },
      {
        name: 'Fabricadores de gelo',
        description:
          'Capacidade de 20 a 500 kg/dia em cubo, escama ou tubo. Essenciais para bar, hotel, hospital e operações de bebidas.',
      },
    ],
    gallery: [
      {
        src: '/images/projects/refrigeradores-verticais.jpg',
        alt: 'Refrigeradores verticais de duas portas em inox instalados em cozinha profissional',
        caption: 'Refrigeradores verticais em inox',
      },
      {
        src: '/images/projects/camara-frigorifica.jpg',
        alt: 'Interior de câmara frigorífica com caixas empilhadas e evaporador de teto',
        caption: 'Câmara frigorífica modular',
      },
      {
        src: '/images/projects/estante-inox.jpg',
        alt: 'Estante em inox de quatro prateleiras com rodízios',
        caption: 'Estantes de apoio para câmara',
      },
    ],
  },
  {
    id: 'bar',
    name: 'Bar',
    shortName: 'Bar',
    icon: '/images/lines/bar.png',
    statement: 'Um bar bem estruturado transforma bebida em experiência — e experiência em ticket médio.',
    intro: [
      'A estrutura física do bar determina a velocidade do serviço e a experiência percebida. Um bar mal planejado cria filas, atrapalha o barman e reduz o faturamento mesmo em noites cheias.',
      'A estrutura de bar Bianchini é pensada para o serviço fluir: tudo no lugar certo, na altura certa, sem improviso.',
    ],
    items: [
      {
        name: 'Módulos de bar frontais',
        description:
          'Balcões com frente em inox, vidro ou madeira naval e tampo em granito ou inox. Integração com cuba, gaveteiro, prateleiras e refrigeração.',
      },
      {
        name: 'Estações de chopp',
        description:
          'Com coluna em inox, cuba de gelo seco ou refrigerada, gavetas para CO₂ e suporte para chopeiras de 1 a 4 vias.',
      },
      {
        name: 'Cubas e pias de bar',
        description:
          'Em inox AISI 304 ou outra liga definida com o cliente, em dimensões padrão ou sob medida, com ou sem escorredor. Posicionadas para o fluxo do barman.',
      },
      {
        name: 'Apoios refrigerados under-bar',
        description:
          'Refrigeradores sob bancada com 1 a 3 portas ou gavetas, temperatura de 2 a 8 °C. Mantêm garrafas, frutas e insumos a postos.',
      },
      {
        name: 'Expositores de bebidas',
        description:
          'Com iluminação em LED, prateleiras em acrílico ou inox e temperatura controlada, para exposição direta ao cliente.',
      },
      {
        name: 'Backsplash e painel de bar',
        description:
          'Painel traseiro em inox escovado ou espelhado, com prateleiras, iluminação embutida e suportes. Define a identidade visual do bar.',
      },
    ],
    gallery: [
      {
        src: '/images/hero/bar-em-inox.jpg',
        alt: 'Balcão de bar em inox com cuba, apoio refrigerado e prateleiras escalonadas de garrafas',
        caption: 'Balcão frontal de bar em inox',
      },
    ],
  },
  {
    id: 'buffet',
    name: 'Distribuição & buffet',
    shortName: 'Buffet',
    icon: '/images/lines/buffet.png',
    statement: 'A linha de distribuição é onde a produção encontra o cliente.',
    intro: [
      'Uma pista mal projetada provoca congestionamento, queda de temperatura, desperdício e impressão negativa — tudo ao mesmo tempo.',
      'Buffets que mantêm a temperatura ideal, apresentam o alimento com elegância e permitem o serviço sem congestionamento. Cada detalhe projetado para acelerar o fluxo do cliente.',
    ],
    items: [
      {
        name: 'Balcões de distribuição quentes',
        description:
          'Com banho-maria elétrico ou a vapor, temperatura de 65 a 90 °C e capacidade GN 1/1 a 1/3, com painel de controle digital.',
      },
      {
        name: 'Pistas frias',
        description:
          'Refrigeradas por expansão direta ou gelo, temperatura de 2 a 8 °C. Para saladas, sobremesas e frios fatiados.',
      },
      {
        name: 'Buffets térmicos modulares',
        description:
          'Módulos encaixáveis em quente, neutro e frio, permitindo reconfigurar o layout conforme o cardápio do dia.',
      },
      {
        name: 'Estufas e aquecedores',
        description:
          'Para manter a produção aquecida antes do serviço, com temperatura controlada de 60 a 120 °C.',
      },
      {
        name: 'Réguas e suportes de apoio',
        description:
          'Prateleiras e réguas estruturais que compõem a linha de distribuição, dimensionadas para o tráfego real de clientes e operadores.',
      },
      {
        name: 'Lâmpadas e toldos de calor',
        description:
          'Lâmpadas infravermelhas para manter pratos prontos na temperatura de serviço, reduzindo desperdício.',
      },
    ],
    gallery: [
      {
        src: '/images/hero/show-cooking.jpg',
        alt: 'Balcão de distribuição com show cooking, lâmpadas de calor e nichos de louça',
        caption: 'Pista de distribuição com show cooking',
      },
      {
        src: '/images/hero/linha-de-distribuicao.jpg',
        alt: 'Buffet de distribuição iluminado em salão de refeições',
        caption: 'Buffet modular em salão',
      },
    ],
  },
  {
    id: 'carros',
    name: 'Carros & transporte',
    shortName: 'Carros',
    icon: '/images/lines/carros.png',
    statement: 'Cada movimento desnecessário dentro da cozinha é tempo perdido.',
    intro: [
      'O transporte interno é o elo silencioso da produção. Quando falha — ou simplesmente não existe — a equipe carrega, improvisa e perde tempo em cada turno.',
      'A linha de transporte Bianchini elimina o improviso entre estações, da produção à distribuição.',
    ],
    items: [
      {
        name: 'Carros de transporte abertos',
        description:
          '2 a 4 prateleiras em inox, capacidade de 100 a 300 kg e rodas giratórias com trava dupla. Para insumos, pratos e recipientes GN.',
      },
      {
        name: 'Carros-estufa',
        description:
          'Com aquecimento elétrico integrado (220 V), temperatura de 60 a 120 °C e capacidade de 10 a 20 GN 1/1.',
      },
      {
        name: 'Carros de bandejas',
        description:
          'Para cozinhas de hospital, hotel e institucional. Suportes para bandeja 45 × 35 cm e capacidade de 10 a 30 bandejas.',
      },
      {
        name: 'Carrinhos de serviço',
        description:
          'Para salão e quarto de hotel. Tampo em madeira, mármore ou inox, com gavetas laterais e rodas silenciosas.',
      },
      {
        name: 'Plataformas móveis',
        description:
          'Para movimentação de caixas e volumes pesados. Base em inox, rodas industriais de 5 polegadas e capacidade de até 500 kg.',
      },
      {
        name: 'Carros isotérmicos',
        description:
          'Com isolamento térmico em poliuretano e fechamento hermético, mantendo temperatura por até 4 horas sem energia externa.',
      },
    ],
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia & equipamentos',
    shortName: 'Tecnologia',
    icon: '/images/lines/tecnologia.png',
    statement:
      'Tecnologia na cozinha não é luxo. É o que permite produzir com consistência todos os dias.',
    intro: [
      'A cozinha moderna é uma linha de produção — e responde a equipamentos que automatizam processos, eliminam variáveis e entregam consistência independente de quem está operando.',
      'Fornos que memorizam receitas, lavadoras que reduzem o ciclo, equipamentos que trabalham enquanto a equipe faz o que só pessoas fazem.',
    ],
    href: '/linhas-de-produtos/forno-combinado-rational',
    items: [
      {
        name: 'Fornos combinados',
        description:
          'Com programação por receita, controle de umidade e sonda de temperatura interna. Capacidade de 6 a 40 GN 1/1.',
      },
      {
        name: 'Lavadoras de louças',
        description:
          'De capota, túnel ou frontal, com ciclos de 60 a 120 segundos e temperatura de enxágue conforme a norma sanitária.',
      },
      {
        name: 'Processadores e cúteres',
        description:
          'Capacidade de 2,5 a 60 litros, velocidades variáveis e lâminas em inox. Picam, fatiam, ralam e misturam.',
      },
      {
        name: 'Batedeiras planetárias',
        description:
          'De bancada (5 a 20 L) ou de piso (30 a 60 L), com tigela em inox, três velocidades e kit batedor, gancho e raquete.',
      },
      {
        name: 'Ultracongeladores',
        description:
          'Reduzem a temperatura do alimento de +90 a −18 °C, encurtando a permanência na zona de risco sanitário.',
      },
      {
        name: 'Cortadores e fatiadores',
        description:
          'De frios, queijos, pães e legumes. Espessura regulável de 0 a 15 mm, lâmina em inox com afiação integrada e proteção de segurança.',
      },
    ],
    gallery: [
      {
        src: '/images/hero/fornos-combinados.jpg',
        alt: 'Dois fornos combinados empilhados em inox instalados em cozinha profissional',
        caption: 'Fornos combinados empilhados',
      },
      {
        src: '/images/projects/forno-combinado.jpg',
        alt: 'Forno combinado profissional com painel digital em cozinha em inox',
        caption: 'Forno combinado com painel digital',
      },
    ],
  },
  {
    id: 'exaustao',
    name: 'Exaustão & ventilação',
    shortName: 'Exaustão',
    icon: '/images/lines/exaustao.png',
    statement: 'A exaustão é o sistema mais cobrado nas vistorias — e o mais ignorado no projeto.',
    intro: [
      'Uma coifa superdimensionada consome energia desnecessária. Uma subdimensionada cria calor, gordura e fumaça que tomam a cozinha.',
      'A Bianchini projeta, fornece e instala sistemas de exaustão e ventilação completos, dimensionados conforme as normas da vigilância sanitária e do Corpo de Bombeiros.',
    ],
    items: [
      {
        name: 'Coifas industriais',
        description:
          'Em chapa de inox, com filtros de gordura, calha coletora e grelha de iluminação. Dimensionadas pelo calor gerado pelos equipamentos de cocção.',
      },
      {
        name: 'Sistemas de exaustão',
        description:
          'Ventiladores centrífugos de alta vazão, silenciosos e de baixa manutenção, calculados pelo volume de ar de cada configuração de cozinha.',
      },
      {
        name: 'Dutos em inox',
        description:
          'Circulares ou retangulares em inox AISI 304, soldados ou flangeados, com isolação térmica onde necessário. Conformes à NBR 15848.',
      },
      {
        name: 'Filtros e lavadores de gases',
        description:
          'Filtros de carvão ativado para eliminação de odores e lavadores de gases para ambientes sem saída de duto ao exterior.',
      },
      {
        name: 'Make-up de ar (insuflamento)',
        description:
          'Reposição de ar externo para compensar o volume exaurido, mantendo a pressão negativa e evitando odores no salão.',
      },
      {
        name: 'Projeto técnico e memorial',
        description:
          'Cálculo de carga térmica, memorial descritivo e planta de HVAC com cotas e especificações, pronta para anexar ao processo de alvará sanitário.',
      },
    ],
    gallery: [
      {
        src: '/images/hero/linha-de-coccao.jpg',
        alt: 'Coifa em inox instalada sobre linha de cocção com duto de exaustão aparente',
        caption: 'Coifa sobre linha de cocção',
      },
    ],
  },
]
