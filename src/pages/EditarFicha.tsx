import Layout from "@/components/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFicha, atualizarFicha } from "@/lib/api";
import type { FichaRequest, TipoMoradia } from "@/types/api";

type FormState = {
  nome: string;
  cpf: string;
  numeroCaso: string;
  idade: string;
  telefone: string;
  estadoCivil: string;
  pessoasDependentes: string;
  idadeFilhos: string;
  nivelSeguranca: string;
  tipoMoradia: TipoMoradia | "";
  qtdMoradores: string;
  qtdFilhos: string;
};

const emptyForm: FormState = {
  nome: "",
  cpf: "",
  numeroCaso: "",
  idade: "",
  telefone: "",
  estadoCivil: "",
  pessoasDependentes: "",
  idadeFilhos: "",
  nivelSeguranca: "0",
  tipoMoradia: "",
  qtdMoradores: "",
  qtdFilhos: "",
};

export default function EditarFicha() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data: ficha, isLoading } = useQuery({
    queryKey: ["ficha", id],
    queryFn: () => getFicha(id!),
    enabled: !!id,
  });

  // Popula o formulário quando os dados chegam
  useEffect(() => {
    if (!ficha) return;
    setForm({
      nome: ficha.nome ?? "",
      cpf: ficha.cpf ?? "",
      numeroCaso: ficha.numeroCaso ?? "",
      idade: ficha.idade != null ? String(ficha.idade) : "",
      telefone: ficha.telefone ?? "",
      estadoCivil: ficha.estadoCivil ?? "",
      pessoasDependentes: ficha.pessoasDependentes != null ? String(ficha.pessoasDependentes) : "",
      idadeFilhos: ficha.idadeFilhos ?? "",
      nivelSeguranca: ficha.nivelSeguranca != null ? String(ficha.nivelSeguranca) : "0",
      tipoMoradia: (ficha.tipoMoradia as TipoMoradia) ?? "",
      qtdMoradores: ficha.qtdMoradores != null ? String(ficha.qtdMoradores) : "",
      qtdFilhos: ficha.qtdFilhos != null ? String(ficha.qtdFilhos) : "",
    });
  }, [ficha]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const mutation = useMutation({
    mutationFn: (body: FichaRequest) => atualizarFicha(id!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ficha", id] });
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
      queryClient.invalidateQueries({ queryKey: ["acompanhamentos"] });
      toast.success("Ficha atualizada com sucesso!");
      navigate(`/acompanhamentos/${id}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.cpf.trim()) {
      toast.error("Nome e CPF são obrigatórios.");
      return;
    }
    const toNum = (v: string) => (v === "" ? undefined : Number(v));
    const body: FichaRequest = {
      nome: form.nome.trim(),
      cpf: form.cpf.trim(),
      numeroCaso: form.numeroCaso || undefined,
      idade: toNum(form.idade),
      telefone: form.telefone || undefined,
      estadoCivil: form.estadoCivil || undefined,
      pessoasDependentes: toNum(form.pessoasDependentes),
      idadeFilhos: form.idadeFilhos || undefined,
      nivelSeguranca: toNum(form.nivelSeguranca),
      tipoMoradia: form.tipoMoradia || undefined,
      qtdMoradores: toNum(form.qtdMoradores),
      qtdFilhos: toNum(form.qtdFilhos),
      status: (ficha?.status as "ATIVO" | "INATIVO") ?? "ATIVO",
    };
    mutation.mutate(body);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 max-w-3xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-3xl animate-fade-in">
        <Link
          to={`/acompanhamentos/${id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o acompanhamento
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-1">Editar Ficha PIA</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Ficha {ficha?.codigoFicha} — {ficha?.nome}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Parte A */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-aziz-blue">Parte A – Preenchida pela Mulher</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 1. Meus Dados */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">1. Meus Dados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="nome">Nome *</Label><Input id="nome" placeholder="Nome completo" value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
                  <div><Label htmlFor="cpf">CPF *</Label><Input id="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => set("cpf", e.target.value)} /></div>
                  <div><Label htmlFor="idade">Idade</Label><Input id="idade" type="number" placeholder="Idade" value={form.idade} onChange={(e) => set("idade", e.target.value)} /></div>
                  <div><Label htmlFor="telefone">Telefone</Label><Input id="telefone" placeholder="(00) 00000-0000" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} /></div>
                  <div><Label htmlFor="estado_civil">Estado civil</Label><Input id="estado_civil" placeholder="Estado civil" value={form.estadoCivil} onChange={(e) => set("estadoCivil", e.target.value)} /></div>
                  <div><Label htmlFor="dependentes">Pessoas dependentes</Label><Input id="dependentes" type="number" placeholder="Quantidade" value={form.pessoasDependentes} onChange={(e) => set("pessoasDependentes", e.target.value)} /></div>
                  <div className="md:col-span-2"><Label htmlFor="idade_filhos">Idade dos filhos/dependentes</Label><Input id="idade_filhos" placeholder="Ex: 3, 7, 12" value={form.idadeFilhos} onChange={(e) => set("idadeFilhos", e.target.value)} /></div>
                </div>
              </div>

              <Separator />

              {/* 2. Segurança */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">2. Minha Segurança</h3>
                <Label className="mb-3 block">No dia de hoje, de 0 a 5, quanto me sinto segura:</Label>
                <RadioGroup value={form.nivelSeguranca} onValueChange={(v) => set("nivelSeguranca", v)} className="space-y-2">
                  {[
                    { v: "0", l: "0 – Não me sinto segura de forma alguma" },
                    { v: "1", l: "1 – Me sinto muito pouco segura" },
                    { v: "2", l: "2 – Me sinto um pouco segura em alguns momentos" },
                    { v: "3", l: "3 – Me sinto segura em vários momentos" },
                    { v: "4", l: "4 – Segura" },
                    { v: "5", l: "5 – Muito segura" },
                  ].map((o) => (
                    <div key={o.v} className="flex items-center gap-3">
                      <RadioGroupItem value={o.v} id={`seg-${o.v}`} />
                      <Label htmlFor={`seg-${o.v}`} className="font-normal text-sm">{o.l}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* 3. Moradia */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">3. Minha Situação de Vida</h3>
                <Label className="mb-3 block">Atualmente moro em:</Label>
                <RadioGroup value={form.tipoMoradia} onValueChange={(v) => set("tipoMoradia", v as TipoMoradia)} className="space-y-2 mb-4">
                  {[
                    { v: "CASA_PROPRIA", l: "Casa própria" },
                    { v: "ALUGADA",      l: "Casa alugada" },
                    { v: "CEDIDA",       l: "Casa cedida (emprestada)" },
                    { v: "ABRIGO",       l: "Abrigo temporário" },
                    { v: "OUTRO",        l: "Outro" },
                  ].map((o) => (
                    <div key={o.v} className="flex items-center gap-3">
                      <RadioGroupItem value={o.v} id={`moradia-${o.v}`} />
                      <Label htmlFor={`moradia-${o.v}`} className="font-normal text-sm">{o.l}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <Label htmlFor="qtd_moradores">Quantidade de pessoas que moram comigo</Label>
                <Input id="qtd_moradores" type="number" className="max-w-[200px]" value={form.qtdMoradores} onChange={(e) => set("qtdMoradores", e.target.value)} />
              </div>

              <Separator />

              {/* 4. Filhos */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">4. Sobre meus filhos</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qtd_filhos">Quantidade de filhos</Label>
                    <Input id="qtd_filhos" type="number" className="max-w-[200px]" value={form.qtdFilhos} onChange={(e) => set("qtdFilhos", e.target.value)} />
                  </div>
                  <Label className="block">Meus filhos moram:</Label>
                  <RadioGroup className="space-y-2">
                    {["Comigo", "Com familiares/amigos", "Em abrigo institucional/família acolhedora", "Sozinho/cônjuge", "Não tenho filhos"].map((o) => (
                      <div key={o} className="flex items-center gap-3">
                        <RadioGroupItem value={o} id={`filhos-${o}`} />
                        <Label htmlFor={`filhos-${o}`} className="font-normal text-sm">{o}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <Separator />

              {/* 5. Renda (decorativo) */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">5. Minha Renda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="mb-2 block">Tenho renda hoje?</Label><RadioGroup className="flex gap-4"><div className="flex items-center gap-2"><RadioGroupItem value="sim" id="renda-sim" /><Label htmlFor="renda-sim" className="font-normal">Sim</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="nao" id="renda-nao" /><Label htmlFor="renda-nao" className="font-normal">Não</Label></div></RadioGroup></div>
                  <div><Label htmlFor="renda_valor">Quanto ganho mais ou menos?</Label><Input id="renda_valor" placeholder="R$" /></div>
                </div>
              </div>

              <Separator />

              {/* 9. Saúde (decorativo) */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">9. Minha Saúde</h3>
                <div className="space-y-4">
                  <div><Label className="mb-2 block">Realizo acompanhamento médico?</Label><RadioGroup className="flex gap-4"><div className="flex items-center gap-2"><RadioGroupItem value="sim" id="acomp-sim" /><Label htmlFor="acomp-sim" className="font-normal">Sim</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="nao" id="acomp-nao" /><Label htmlFor="acomp-nao" className="font-normal">Não</Label></div></RadioGroup></div>
                  <div><Label htmlFor="medicamentos">Medicamentos de uso contínuo</Label><Input id="medicamentos" placeholder="Quais medicamentos?" /></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parte B */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-aziz-blue">Parte B – Preenchida pela Equipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-4">1. Registro Processual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="n_processo">Nº do processo MPU</Label><Input id="n_processo" value={form.numeroCaso} onChange={(e) => set("numeroCaso", e.target.value)} /></div>
                  <div><Label htmlFor="data_acolhimento">Data da reunião de acolhimento</Label><Input id="data_acolhimento" type="date" /></div>
                  <div className="md:col-span-2"><Label htmlFor="servidor">Servidor(a) responsável</Label><Input id="servidor" /></div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-foreground mb-4">5. Observações Relevantes</h3>
                <Textarea placeholder="Observações..." className="min-h-[100px]" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Link to={`/acompanhamentos/${id}`}>
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-aziz-green hover:bg-aziz-green/90 text-primary-foreground px-8"
            >
              {mutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}