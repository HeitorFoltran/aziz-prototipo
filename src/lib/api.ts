import type {
  Acompanhamento,
  DashboardStats,
  Encaminhamento,
  EncaminhamentoRequest,
  Ficha,
  FichaRequest,
  Interacao,
  InteracaoRequest,
  Profissional,
  ProfissionalRequest,
  Servico,
  ServicoRequest,
} from "@/types/api";
import {
  delay,
  fichaToAcompanhamento,
  getNextEncaminhamentoId,
  getNextFichaId,
  getNextInteracaoId,
  getNextProfissionalId,
  getNextServicoId,
  mockDashboardStats,
  mockFichas,
  mockProfissionais,
  mockServicos,
} from "@/lib/mockData";

// ---------------------------------------------------------------------------
// MODO MOCK: este arquivo não faz nenhuma chamada de rede para o back-end.
// Todas as funções abaixo leem/escrevem em um "banco" em memória
// (src/lib/mockData.ts), mantendo as mesmas assinaturas usadas pelas páginas.
// Para reativar a integração real, restaure a versão original deste arquivo.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export function getDashboardStats(): Promise<DashboardStats> {
  return delay(mockDashboardStats);
}

// ---------------------------------------------------------------------------
// Acompanhamentos
// ---------------------------------------------------------------------------

export function getAcompanhamentos(params?: {
  q?: string;
  servicoId?: number | string;
}): Promise<Acompanhamento[]> {
  let lista = mockFichas.map(fichaToAcompanhamento);

  if (params?.q) {
    const q = params.q.toLowerCase();
    lista = lista.filter(
      (a) => a.nome.toLowerCase().includes(q) || a.cpf.includes(q) || a.numeroCaso.includes(q),
    );
  }
  if (params?.servicoId !== undefined && params?.servicoId !== null && params?.servicoId !== "") {
    lista = lista.filter((a) => a.tipoEncaminhamento === String(params.servicoId));
  }

  return delay(lista);
}

// ---------------------------------------------------------------------------
// Fichas
// ---------------------------------------------------------------------------

export function getFichas(params?: { q?: string }): Promise<Ficha[]> {
  let lista = mockFichas;

  if (params?.q) {
    const q = params.q.toLowerCase();
    lista = lista.filter((f) => f.nome.toLowerCase().includes(q) || f.cpf.includes(q));
  }

  return delay(lista);
}

export function getFicha(id: number | string): Promise<Ficha> {
  const ficha = mockFichas.find((f) => String(f.id) === String(id));
  if (!ficha) {
    return Promise.reject(new Error(`Ficha ${id} não encontrada (mock).`));
  }
  return delay(ficha);
}

export function createFicha(body: FichaRequest): Promise<Ficha> {
  const novaFicha: Ficha = {
    id: getNextFichaId(),
    codigoFicha: `F-${String(getNextFichaId()).padStart(4, "0")}`,
    numeroCaso: body.numeroCaso ?? "",
    nome: body.nome,
    cpf: body.cpf,
    idade: body.idade ?? null,
    telefone: body.telefone ?? null,
    estadoCivil: body.estadoCivil ?? null,
    pessoasDependentes: body.pessoasDependentes ?? null,
    idadeFilhos: body.idadeFilhos ?? null,
    nivelSeguranca: body.nivelSeguranca ?? null,
    tipoMoradia: body.tipoMoradia ?? null,
    qtdMoradores: body.qtdMoradores ?? null,
    qtdFilhos: body.qtdFilhos ?? null,
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
    status: body.status ?? "ATIVO",
    encaminhamentos: [],
    interacoes: [],
  };
  mockFichas.push(novaFicha);
  return delay(novaFicha);
}

export function atualizarFicha(id: number | string, body: FichaRequest): Promise<Ficha> {
  const ficha = mockFichas.find((f) => String(f.id) === String(id));
  if (!ficha) {
    return Promise.reject(new Error(`Ficha ${id} não encontrada (mock).`));
  }
  Object.assign(ficha, {
    nome: body.nome,
    cpf: body.cpf,
    numeroCaso: body.numeroCaso ?? ficha.numeroCaso,
    idade: body.idade ?? ficha.idade,
    telefone: body.telefone ?? ficha.telefone,
    estadoCivil: body.estadoCivil ?? ficha.estadoCivil,
    pessoasDependentes: body.pessoasDependentes ?? ficha.pessoasDependentes,
    idadeFilhos: body.idadeFilhos ?? ficha.idadeFilhos,
    nivelSeguranca: body.nivelSeguranca ?? ficha.nivelSeguranca,
    tipoMoradia: body.tipoMoradia ?? ficha.tipoMoradia,
    qtdMoradores: body.qtdMoradores ?? ficha.qtdMoradores,
    qtdFilhos: body.qtdFilhos ?? ficha.qtdFilhos,
    status: body.status ?? ficha.status,
    dataAtualizacao: new Date().toISOString(),
  });
  return delay(ficha);
}

export function atualizarStatusFicha(
  id: number | string,
  status: "ATIVO" | "INATIVO",
): Promise<Ficha> {
  const ficha = mockFichas.find((f) => String(f.id) === String(id));
  if (!ficha) {
    return Promise.reject(new Error(`Ficha ${id} não encontrada (mock).`));
  }
  ficha.status = status;
  ficha.dataAtualizacao = new Date().toISOString();
  return delay(ficha);
}

// ---------------------------------------------------------------------------
// Encaminhamentos (por ficha)
// ---------------------------------------------------------------------------

export function getEncaminhamentos(fichaId: number | string): Promise<Encaminhamento[]> {
  const ficha = mockFichas.find((f) => String(f.id) === String(fichaId));
  return delay(ficha?.encaminhamentos ?? []);
}

export function createEncaminhamento(
  fichaId: number | string,
  body: EncaminhamentoRequest,
): Promise<Encaminhamento> {
  const ficha = mockFichas.find((f) => String(f.id) === String(fichaId));
  if (!ficha) {
    return Promise.reject(new Error(`Ficha ${fichaId} não encontrada (mock).`));
  }
  const servico = mockServicos.find((s) => s.id === body.servicoId);
  const novoEncaminhamento: Encaminhamento = {
    id: getNextEncaminhamentoId(),
    fichaId: ficha.id,
    servicoId: body.servicoId,
    servicoNome: servico?.nome ?? null,
    profissional: body.profissional ?? null,
    dataEncaminhamento: body.dataEncaminhamento ?? new Date().toISOString(),
    dataRetorno: body.dataRetorno ?? null,
    descricao: body.descricao ?? null,
  };
  ficha.encaminhamentos.push(novoEncaminhamento);
  ficha.dataAtualizacao = new Date().toISOString();
  return delay(novoEncaminhamento);
}

// ---------------------------------------------------------------------------
// Interações (por ficha)
// ---------------------------------------------------------------------------

export function getInteracoes(fichaId: number | string): Promise<Interacao[]> {
  const ficha = mockFichas.find((f) => String(f.id) === String(fichaId));
  return delay(ficha?.interacoes ?? []);
}

export function createInteracao(
  fichaId: number | string,
  body: InteracaoRequest,
): Promise<Interacao> {
  const ficha = mockFichas.find((f) => String(f.id) === String(fichaId));
  if (!ficha) {
    return Promise.reject(new Error(`Ficha ${fichaId} não encontrada (mock).`));
  }
  const novaInteracao: Interacao = {
    id: getNextInteracaoId(),
    fichaId: ficha.id,
    autor: body.autor ?? "Usuário",
    dataInteracao: new Date().toISOString(),
    texto: body.texto,
  };
  ficha.interacoes.push(novaInteracao);
  ficha.dataAtualizacao = new Date().toISOString();
  return delay(novaInteracao);
}

// ---------------------------------------------------------------------------
// Serviços
// ---------------------------------------------------------------------------

export function getServicos(): Promise<Servico[]> {
  return delay(mockServicos);
}

export function createServico(body: ServicoRequest): Promise<Servico> {
  const novoServico: Servico = {
    id: getNextServicoId(),
    nome: body.nome,
    icone: null,
  };
  mockServicos.push(novoServico);
  return delay(novoServico);
}

export function atualizarServico(id: number, body: ServicoRequest): Promise<Servico> {
  const servico = mockServicos.find((s) => s.id === id);
  if (!servico) {
    return Promise.reject(new Error(`Serviço ${id} não encontrado (mock).`));
  }
  servico.nome = body.nome;
  servico.icone = null;
  return delay(servico);
}

// ---------------------------------------------------------------------------
// Profissionais
// ---------------------------------------------------------------------------

export function getProfissionais(params?: {
  q?: string;
  servicoId?: number | string;
}): Promise<Profissional[]> {
  let lista = mockProfissionais;

  if (params?.q) {
    const q = params.q.toLowerCase();
    lista = lista.filter((p) => p.nome.toLowerCase().includes(q) || p.cpf.includes(q));
  }
  if (params?.servicoId !== undefined && params?.servicoId !== null && params?.servicoId !== "") {
    lista = lista.filter((p) => String(p.servicoId) === String(params.servicoId));
  }

  return delay(lista);
}

export function createProfissional(body: ProfissionalRequest): Promise<Profissional> {
  const servico = mockServicos.find((s) => s.id === body.servicoId);
  const novoProfissional: Profissional = {
    id: getNextProfissionalId(),
    nome: body.nome,
    cpf: body.cpf,
    carteiraProfissional: body.carteiraProfissional ?? null,
    servicoId: body.servicoId ?? null,
    servicoNome: servico?.nome ?? null,
  };
  mockProfissionais.push(novoProfissional);
  return delay(novoProfissional);
}
