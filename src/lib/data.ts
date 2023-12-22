export type Item = {
  id: string;
  name: string;
  description: string;
  minimumValue: number;
  status: string; // 'A venda' | 'Vendido'
  date: Date;
}

export type Participant = {
  name: string;
  cpf: string;
}

export type Lance = {
  id: string;
  value: number;
  date: Date;
  participant: Participant;
}

export type Leilao = {
  id: string;
  date: Date;
  item: Item;
  lances: Lance[];
  horarioLimite: Date;
}

let itens = [
  {
    id: Date.now().toString(),
    name: 'Carro',
    description: 'Fiat uno quatro portas',
    minimumValue: 65000,
    status: 'Vendido',
    date: new Date()
  },
  {
    id: Date.now().toString(),
    name: 'Quadro',
    description: 'Quadro antigo de monaliza',
    minimumValue: 120000,
    status: 'A venda',
    date: new Date()
  }
]

let leiloes: Leilao[] = [
  {
    id: Date.now().toString(),
    date: new Date(),
    item: itens[0],
    lances: [
      {
        id: Date.now().toString(),
        value: 65000,
        date: new Date(),
        participant: {
          name: 'João',
          cpf: '123.456.789-00'
        }
      }
    ],
    horarioLimite: new Date('2023-12-22T07:25')
  },
  {
    id: (Date.now()+ 1).toString(),
    date: new Date(),
    item: itens[1],
    lances: [
      {
        id: Date.now().toString(),
        value: 120000,
        date: new Date(),
        participant: {
          name: 'Maria',
          cpf: '123.456.789-00'
        }
      }
    ],
    horarioLimite: new Date('2023-12-22T07:25')
  }
]

// Handler Itens
export const getItens = () => itens;
export const getItem = (id: string) => itens.find(item => item.id === id);
export const postItem = (item: Item) => itens.push(item);
export const deleteItem = (id: string) => itens = itens.filter(item => item.id !== id);
export const putItem = (id: string, newItem: Item) => itens = itens.map(item => item.id === id ? newItem : item);

// Handler Leiloes
export const getLeiloes = () => leiloes;
export const getLeilao = (id: string) => leiloes.find(leilao => leilao.id === id);
export const postLeilao = (leilao: Leilao) => leiloes.push(leilao);
export const deleteLeilao = (id: string) => leiloes = leiloes.filter(leilao => leilao.id !== id);

// Handler Lances
export const postAddLance = (leilaoId: string, lance: Lance) => {
  const leilao = getLeilao(leilaoId);
  if (leilao) {
    leilao.lances.push(lance);
  }
  return leilao;
}

export const deleteLance = (leilaoId: string, lanceId: string) => {
  const leilao = getLeilao(leilaoId);
  if (leilao) {
    leilao.lances = leilao.lances.filter(lance => lance.id !== lanceId);
  }
}

// Utils
export function formatMoney(number: number) {
  return Number(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


export function formatarDataParaExibicao(data: Date) {
  const dia = data.getDate();
  const mes = data.getMonth() + 1; // Meses começam do zero
  const ano = data.getFullYear();
  const horas = data.getHours();
  const minutos = data.getMinutes();

  // Pad com zero à esquerda se for necessário
  const diaFormatado = dia < 10 ? `0${dia}` : dia;
  const mesFormatado = mes < 10 ? `0${mes}` : mes;
  const horasFormatadas = horas < 10 ? `0${horas}` : horas;
  const minutosFormatados = minutos < 10 ? `0${minutos}` : minutos;

  return `${diaFormatado}/${mesFormatado}/${ano} ${horasFormatadas}:${minutosFormatados}`;
}
