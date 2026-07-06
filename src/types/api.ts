// Tipos TypeScript correspondentes aos DTOs de resposta da API REST (Spring Boot).
// Todas as datas chegam como strings ISO do backend.

// ---------------------------------------------------------------------------
// Enums do domínio
// ---------------------------------------------------------------------------

export type TipoMoradia =
  | "CASA_PROPRIA"
  | "ALUGADA"
  | "CEDIDA"
  | "ABRIGO"
  | "OUTRO";

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export interface EncaminhamentoPorTipo {
  tipo: string;   // servicoId como string
  label: string;  // servicoNome
  total: number;
}

export interface FichaPorMes {
  mes: string;
  ano: number;
  total: number;
}

export interface DashboardStats {
  totalFichasAtivas: number;
  totalEncaminhamentos: number;
  fichasAguardandoRetorno: number;
  fichasSemAtualizacao30Dias: number;
  encaminhamentosPorTipo: EncaminhamentoPorTipo[];
  fichasPorMes: FichaPorMes[];
}

// ---------------------------------------------------------------------------
// Acompanhamentos (lista resumida)
// ---------------------------------------------------------------------------

export interface Acompanhamento {
  id: number;
  numeroCaso: string;
  codigoFicha: string;
  nome: string;
  cpf: string;
  encaminhamento: string | null;   // nome do serviço mais recente
  tipoEncaminhamento: string | null; // servicoId como string
  status: string;
  dataAtualizacao: string; // ISO
  dataCriacao: string;     // ISO
}

// ---------------------------------------------------------------------------
// Encaminhamentos
// ---------------------------------------------------------------------------

export interface Encaminhamento {
  id: number;
  fichaId: number;
  servicoId: number | null;
  servicoNome: string | null;
  profissional: string | null;
  dataEncaminhamento: string | null; // ISO
  dataRetorno: string | null;        // ISO
  descricao: string | null;
}

export interface EncaminhamentoRequest {
  servicoId: number;       // obrigatório
  profissional?: string;
  dataEncaminhamento?: string; // ISO
  dataRetorno?: string;        // ISO
  descricao?: string;
}

// ---------------------------------------------------------------------------
// Interações
// ---------------------------------------------------------------------------

export interface Interacao {
  id: number;
  fichaId: number;
  autor: string;
  dataInteracao: string; // ISO
  texto: string;
}

export interface InteracaoRequest {
  autor?: string;
  texto: string; // obrigatório
}

// ---------------------------------------------------------------------------
// Fichas
// ---------------------------------------------------------------------------

export interface Ficha {
  id: number;
  codigoFicha: string;
  numeroCaso: string;
  nome: string;
  cpf: string;
  idade: number | null;
  telefone: string | null;
  estadoCivil: string | null;
  pessoasDependentes: number | null;
  idadeFilhos: string | null;
  nivelSeguranca: number | null; // 0-5
  tipoMoradia: TipoMoradia | null;
  qtdMoradores: number | null;
  qtdFilhos: number | null;
  dataCriacao: string;      // ISO
  dataAtualizacao: string;  // ISO
  status: string;
  encaminhamentos: Encaminhamento[];
  interacoes: Interacao[];
}

export interface FichaRequest {
  nome: string;  // obrigatório
  cpf: string;   // obrigatório
  numeroCaso?: string;
  idade?: number | null;
  telefone?: string;
  estadoCivil?: string;
  pessoasDependentes?: number | null;
  idadeFilhos?: string;
  nivelSeguranca?: number | null; // 0-5
  tipoMoradia?: TipoMoradia | null;
  qtdMoradores?: number | null;
  qtdFilhos?: number | null;
  status?: string;
}

// ---------------------------------------------------------------------------
// Serviços
// ---------------------------------------------------------------------------

export interface Servico {
  id: number;
  nome: string;
  icone: string | null;
}

export interface ServicoRequest {
  nome: string; // obrigatório
  icone?: string;
}

// ---------------------------------------------------------------------------
// Profissionais
// ---------------------------------------------------------------------------

export interface Profissional {
  id: number;
  nome: string;
  cpf: string;
  carteiraProfissional: string | null;
  servicoId: number | null;
  servicoNome: string | null;
}

export interface ProfissionalRequest {
  nome: string;  // obrigatório
  cpf: string;   // obrigatório
  carteiraProfissional?: string;
  servicoId?: number | null;
}