// VaiJunto — dados mockados compartilhados entre Busca e Pagamento (Integração: Yago)
// Valor por pessoa = (combustível + desgaste) / ocupantes (motorista incluso).
window.VJ = window.VJ || {};
VJ.CARONAS = [
  { id: 1, motorista: "Lucas Pereira", nota: "4,9", viagens: 132, horario: "07:20", carro: "Gol branco · QPX-2A41", vagas: 3, match: 96, ponto: "Sai da portaria do Campus JK", combustivel: 20, desgaste: 4, ocupantes: 4 },
  { id: 2, motorista: "Beatriz Lima", nota: "4,8", viagens: 87, horario: "07:35", carro: "Onix prata · RTE-8C19", vagas: 2, match: 88, ponto: "Sai do estacionamento do Bloco II", combustivel: 16, desgaste: 4, ocupantes: 4 },
  { id: 3, motorista: "Rafael Costa", nota: "4,7", viagens: 41, horario: "07:50", carro: "HB20 preto · PWN-5H07", vagas: 1, match: 74, ponto: "Sai do ponto de ônibus da BR-367", combustivel: 17, desgaste: 4, ocupantes: 3 },
];
VJ.parte = (c) => (c.combustivel + c.desgaste) / c.ocupantes;
VJ.carona = (id) => VJ.CARONAS.find((c) => c.id === Number(id)) || VJ.CARONAS[0];
