import type {
  Acompanhamento,
  DashboardStats,
  Encaminhamento,
  Ficha,
  Interacao,
  Profissional,
  Servico,
} from "@/types/api";

// ---------------------------------------------------------------------------
// "Banco de dados" em memória, usado apenas para navegação/demo sem back-end.
// ---------------------------------------------------------------------------

export const mockServicos: Servico[] = [
  { id: 1, nome: "Atendimento jurídico", icone: null },
  { id: 2, nome: "Psicologia", icone: null },
  { id: 3, nome: "Assistência social", icone: null },
  { id: 4, nome: "Saúde", icone: null },
  { id: 5, nome: "Moradia", icone: null },
];

export const mockProfissionais: Profissional[] = [
  {
    id: 1,
    nome: "Ana Beatriz Souza",
    cpf: "123.456.789-00",
    carteiraProfissional: "OAB/PR 45678",
    servicoId: 1,
    servicoNome: "Atendimento jurídico",
  },
  {
    id: 2,
    nome: "Carlos Eduardo Lima",
    cpf: "987.654.321-00",
    carteiraProfissional: "CRP 08/12345",
    servicoId: 2,
    servicoNome: "Psicologia",
  },
  {
    id: 3,
    nome: "Fernanda Ribeiro",
    cpf: "456.123.789-00",
    carteiraProfissional: "CRESS 1234",
    servicoId: 3,
    servicoNome: "Assistência social",
  },
];

const now = new Date();
function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const mockFichas: Ficha[] = [
  {
    id: 1,
    codigoFicha: "F-0001",
    numeroCaso: "2026/00123",
    nome: "Maria da Silva Santos",
    cpf: "111.222.333-44",
    idade: 34,
    telefone: "(45) 99911-2233",
    estadoCivil: "Solteira",
    pessoasDependentes: 2,
    idadeFilhos: "5, 8",
    nivelSeguranca: 3,
    tipoMoradia: "ALUGADA",
    qtdMoradores: 3,
    qtdFilhos: 2,
    dataCriacao: daysAgo(40),
    dataAtualizacao: daysAgo(2),
    status: "ATIVO",
    encaminhamentos: [
      {
        id: 1,
        fichaId: 1,
        servicoId: 1,
        servicoNome: "Atendimento jurídico",
        profissional: "Ana Beatriz Souza",
        dataEncaminhamento: daysAgo(30),
        dataRetorno: daysAgo(10),
        descricao: "Orientação sobre medida protetiva.",
      },
      {
        id: 2,
        fichaId: 1,
        servicoId: 2,
        servicoNome: "Psicologia",
        profissional: "Carlos Eduardo Lima",
        dataEncaminhamento: daysAgo(20),
        dataRetorno: null,
        descricao: "Acompanhamento psicológico contínuo.",
      },
    ],
    interacoes: [
      {
        id: 1,
        fichaId: 1,
        autor: "Fernanda Ribeiro",
        dataInteracao: daysAgo(5),
        texto: "Contato telefônico realizado, usuária relatou melhora no quadro.",
      },
    ],
  },
  {
    id: 2,
    codigoFicha: "F-0002",
    numeroCaso: "2026/00124",
    nome: "Joana Pereira Costa",
    cpf: "222.333.444-55",
    idade: 27,
    telefone: "(45) 99822-1122",
    estadoCivil: "Casada",
    pessoasDependentes: 1,
    idadeFilhos: "3",
    nivelSeguranca: 4,
    tipoMoradia: "CASA_PROPRIA",
    qtdMoradores: 4,
    qtdFilhos: 1,
    dataCriacao: daysAgo(60),
    dataAtualizacao: daysAgo(35),
    status: "ATIVO",
    encaminhamentos: [
      {
        id: 3,
        fichaId: 2,
        servicoId: 3,
        servicoNome: "Assistência social",
        profissional: "Fernanda Ribeiro",
        dataEncaminhamento: daysAgo(50),
        dataRetorno: daysAgo(45),
        descricao: "Encaminhamento para benefício assistencial.",
      },
    ],
    interacoes: [],
  },
  {
    id: 3,
    codigoFicha: "F-0003",
    numeroCaso: "2026/00125",
    nome: "Beatriz Almeida Rocha",
    cpf: "333.444.555-66",
    idade: 41,
    telefone: "(45) 99733-4455",
    estadoCivil: "Divorciada",
    pessoasDependentes: 0,
    idadeFilhos: null,
    nivelSeguranca: 2,
    tipoMoradia: "CEDIDA",
    qtdMoradores: 1,
    qtdFilhos: 0,
    dataCriacao: daysAgo(15),
    dataAtualizacao: daysAgo(1),
    status: "INATIVO",
    encaminhamentos: [],
    interacoes: [
      {
        id: 2,
        fichaId: 3,
        autor: "Ana Beatriz Souza",
        dataInteracao: daysAgo(1),
        texto: "Caso encerrado a pedido da usuária.",
      },
    ],
  },
];

export const mockDashboardStats: DashboardStats = {
  totalFichasAtivas: mockFichas.filter((f) => f.status === "ATIVO").length,
  totalEncaminhamentos: mockFichas.reduce((acc, f) => acc + f.encaminhamentos.length, 0),
  fichasAguardandoRetorno: 1,
  fichasSemAtualizacao30Dias: 1,
  encaminhamentosPorTipo: [
    { tipo: "1", label: "Atendimento jurídico", total: 1 },
    { tipo: "2", label: "Psicologia", total: 1 },
    { tipo: "3", label: "Assistência social", total: 1 },
  ],
  fichasPorMes: [
    { mes: "Fev", ano: 2026, total: 2 },
    { mes: "Mar", ano: 2026, total: 3 },
    { mes: "Abr", ano: 2026, total: 1 },
    { mes: "Mai", ano: 2026, total: 4 },
    { mes: "Jun", ano: 2026, total: 2 },
    { mes: "Jul", ano: 2026, total: 1 },
  ],
};

export function fichaToAcompanhamento(f: Ficha): Acompanhamento {
  const ultimo = f.encaminhamentos[f.encaminhamentos.length - 1];
  return {
    id: f.id,
    numeroCaso: f.numeroCaso,
    codigoFicha: f.codigoFicha,
    nome: f.nome,
    cpf: f.cpf,
    encaminhamento: ultimo?.servicoNome ?? null,
    tipoEncaminhamento: ultimo?.servicoId != null ? String(ultimo.servicoId) : null,
    status: f.status,
    dataAtualizacao: f.dataAtualizacao,
    dataCriacao: f.dataCriacao,
  };
}

// Simula uma pequena latência de rede para manter loaders/skeletons visíveis.
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

let nextFichaId = mockFichas.length + 1;
let nextServicoId = mockServicos.length + 1;
let nextProfissionalId = mockProfissionais.length + 1;
let nextEncaminhamentoId = 100;
let nextInteracaoId = 100;

export function getNextFichaId() {
  return nextFichaId++;
}
export function getNextServicoId() {
  return nextServicoId++;
}
export function getNextProfissionalId() {
  return nextProfissionalId++;
}
export function getNextEncaminhamentoId() {
  return nextEncaminhamentoId++;
}
export function getNextInteracaoId() {
  return nextInteracaoId++;
}

export type { Encaminhamento, Interacao };
