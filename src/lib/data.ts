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
    name: 'Quadro',
    description: 'Quadro antigo de monaliza',
    minimumValue: 100000,
    status: 'A venda',
    date: new Date()
  }
]

let leiloes: Leilao[] = []

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
