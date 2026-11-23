// VaiJunto — dados mockados compartilhados por todas as telas (Integração: Yago)
// Rota real Campus JK → Centro (OSRM/OpenStreetMap), gravada fixa no arquivo: nada é buscado em tempo de execução.
window.VJ = window.VJ || {};

VJ.ROTA = [
  [-18.19601,-43.57269], [-18.19565,-43.57278], [-18.19545,-43.57291], [-18.1954,-43.57333], [-18.19569,-43.57367], [-18.19584,-43.57392],
  [-18.19569,-43.57388], [-18.19547,-43.57371], [-18.19528,-43.57391], [-18.19538,-43.57415], [-18.19559,-43.57415], [-18.19645,-43.57453],
  [-18.19916,-43.57608], [-18.19982,-43.57654], [-18.20003,-43.57738], [-18.2002,-43.57786], [-18.20051,-43.57806], [-18.20314,-43.57953],
  [-18.20406,-43.58018], [-18.20384,-43.58068], [-18.2042,-43.58091], [-18.20629,-43.58222], [-18.20681,-43.58282], [-18.20735,-43.58438],
  [-18.20806,-43.5864], [-18.20861,-43.58674], [-18.21032,-43.58671], [-18.21156,-43.58668], [-18.2127,-43.58675], [-18.21402,-43.58722],
  [-18.21531,-43.58814], [-18.2172,-43.58957], [-18.21766,-43.59008], [-18.21805,-43.59098], [-18.21811,-43.59164], [-18.21805,-43.59222],
  [-18.21779,-43.59292], [-18.21677,-43.59472], [-18.21647,-43.59542], [-18.21642,-43.5957], [-18.21642,-43.59593], [-18.21644,-43.59614],
  [-18.21649,-43.59633], [-18.21659,-43.59656], [-18.21696,-43.59719], [-18.21707,-43.59743], [-18.21712,-43.59766], [-18.21713,-43.59829],
  [-18.21719,-43.59868], [-18.21728,-43.5989], [-18.21745,-43.59913], [-18.21764,-43.5993], [-18.21811,-43.59961], [-18.21832,-43.59979],
  [-18.21852,-43.60009], [-18.21917,-43.60126], [-18.22035,-43.6034], [-18.22133,-43.60518], [-18.22186,-43.60615], [-18.22207,-43.60644],
  [-18.22224,-43.60659], [-18.22247,-43.60672], [-18.22272,-43.60678], [-18.22307,-43.60679], [-18.22735,-43.6065], [-18.22803,-43.60646],
  [-18.22875,-43.60645], [-18.2292,-43.60663], [-18.22934,-43.60669], [-18.22945,-43.6067], [-18.22955,-43.60667], [-18.22959,-43.6066],
  [-18.22961,-43.60654], [-18.22962,-43.60645], [-18.22967,-43.60623], [-18.22987,-43.60606], [-18.23006,-43.60593], [-18.2303,-43.60581],
  [-18.23086,-43.60561], [-18.2311,-43.60556], [-18.23138,-43.60556], [-18.23214,-43.6057], [-18.23267,-43.60577], [-18.23304,-43.60574],
  [-18.23418,-43.60548], [-18.235,-43.60523], [-18.23524,-43.605], [-18.23532,-43.60472], [-18.23518,-43.60434], [-18.23496,-43.60399],
  [-18.23472,-43.60365], [-18.23449,-43.6033], [-18.23449,-43.60302], [-18.23465,-43.60271], [-18.23489,-43.60248], [-18.23531,-43.60229],
  [-18.2355,-43.60215], [-18.2356,-43.60192], [-18.23566,-43.60164], [-18.2358,-43.60131], [-18.23599,-43.60107], [-18.23652,-43.60081],
  [-18.2371,-43.6005], [-18.23731,-43.60035], [-18.23768,-43.5999], [-18.23863,-43.59934], [-18.23869,-43.5994], [-18.2389,-43.59947],
  [-18.23999,-43.5996], [-18.24062,-43.59906], [-18.24077,-43.59907], [-18.24097,-43.59936], [-18.24174,-43.59908], [-18.24263,-43.59882],
  [-18.24298,-43.59872], [-18.24358,-43.59846], [-18.24394,-43.59826], [-18.24434,-43.59795], [-18.24359,-43.59806], [-18.24333,-43.59764],
  [-18.24257,-43.59706], [-18.24263,-43.59666], [-18.24289,-43.59636], [-18.24344,-43.59574], [-18.24386,-43.59634],
];
VJ.ROTA_INFO = { km: 9.3, min: 15 };

VJ.LUGARES = [
  { id: "jk", nome: "Campus JK — UFVJM", sub: "Rod. MGT-367, km 583", tipo: "campus" },
  { id: "centro", nome: "Centro — Mercado Velho", sub: "Praça Barão de Guaicuí", tipo: "centro" },
  { id: "rodoviaria", nome: "Rodoviária de Diamantina", sub: "Largo Dom João", tipo: "onibus" },
  { id: "campus1", nome: "Campus I — UFVJM", sub: "Rua da Glória, Centro", tipo: "campus" },
  { id: "catedral", nome: "Catedral de Santo Antônio", sub: "Praça Correa Rabelo", tipo: "centro" },
  { id: "palha", nome: "Bairro Palha", sub: "Diamantina", tipo: "bairro" },
];

// iRota = índice do embarque na VJ.ROTA; iCarro = onde o carro está agora (vem do Centro rumo ao embarque)
VJ.CARONAS = [
  { id: 1, motorista: "Lucas Pereira", curso: "Eng. Mecânica · 7º per.", hue: 158, nota: 4.9, viagens: 132, saida: "07:20", chegada: "07:36",
    carro: "VW Gol branco", placa: "QPX-2A41", vagas: 3, total: 4, match: 96, iRota: 0, iCarro: 22, ponto: "Portaria principal do Campus JK",
    tags: ["Ar-condicionado", "Aceita mochila", "Pontual"], combustivel: 20, desgaste: 4, ocupantes: 4,
    review: { autor: "Júlia M.", texto: "Super pontual e dirige com calma. Já virou minha carona fixa de terça." } },
  { id: 2, motorista: "Beatriz Lima", curso: "Farmácia · 5º per.", hue: 280, nota: 4.8, viagens: 87, saida: "07:35", chegada: "07:52",
    carro: "Chevrolet Onix prata", placa: "RTE-8C19", vagas: 2, total: 4, match: 88, iRota: 6, iCarro: 38, ponto: "Estacionamento do Bloco II",
    tags: ["Só mulheres", "Música baixa"], combustivel: 16, desgaste: 4, ocupantes: 4,
    review: { autor: "Carla S.", texto: "Carro limpinho, conversa boa. Recomendo demais." } },
  { id: 3, motorista: "Rafael Costa", curso: "Sistemas de Informação · 8º per.", hue: 24, nota: 4.7, viagens: 41, saida: "07:50", chegada: "08:05",
    carro: "Hyundai HB20 preto", placa: "PWN-5H07", vagas: 1, total: 3, match: 74, iRota: 14, iCarro: 55, ponto: "Ponto de ônibus da BR-367",
    tags: ["Pet friendly", "Aceita mochila"], combustivel: 17, desgaste: 4, ocupantes: 3,
    review: { autor: "Pedro H.", texto: "Gente boa, só saiu 5 min depois do combinado." } },
];

VJ.parte = (c) => (c.combustivel + c.desgaste) / c.ocupantes;
VJ.carona = (id) => VJ.CARONAS.find((c) => c.id === Number(id)) || VJ.CARONAS[0];
VJ.lugar = (id) => VJ.LUGARES.find((l) => l.id === id) || VJ.LUGARES[0];
