import { format, parseISO } from "date-fns";

/**
 * Formata uma data ISO vinda do backend para o padrão brasileiro dd/MM/yyyy.
 * Retorna "-" quando a data é nula/indefinida e a string original caso não
 * seja possível interpretá-la.
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  try {
    return format(parseISO(iso), "dd/MM/yyyy");
  } catch {
    return iso;
  }
}

const MESES_ABREV = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/** Converte um número de mês (1-12) para a abreviação em português. */
export function mesAbreviado(mes: number): string {
  return MESES_ABREV[mes - 1] ?? String(mes);
}
