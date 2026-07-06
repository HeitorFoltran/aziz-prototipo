import Layout from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFicha } from "@/lib/api";
import type { FichaRequest, TipoMoradia } from "@/types/api";

// Estado inicial apenas dos campos que compõem o FichaRequestDTO.
const initialForm = {
  nome: "",
  cpf: "",
  numeroCaso: "",
  idade: "",
  telefone: "",
  estadoCivil: "",
  pessoasDependentes: "",
  idadeFilhos: "",
  nivelSeguranca: "0",
  tipoMoradia: "" as TipoMoradia | "",
  qtdMoradores: "",
  qtdFilhos: "",
};

export default function NovaFicha() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);

  const set = <K extends keyof typeof initialForm>(key: K, value: (typeof initialForm)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const mutation = useMutation({
    mutationFn: (body: FichaRequest) => createFicha(body),
    onSuccess: () => {
      toast.success("Ficha salva com sucesso!");
      navigate("/cadastros");
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
      status: "ATIVO",
    };

    mutation.mutate(body);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl animate-fade-in">
        <Link to="/cadastros" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar para cadastros
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-2">Plano Individual de Atendimento</h1>
        <p className="text-sm text-muted-foreground mb-8">Preencha as informações abaixo para cadastrar uma nova ficha PIA.</p>

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
                  <div><Label htmlFor="nome">Nome</Label><Input id="nome" placeholder="Nome completo" value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
                  <div><Label htmlFor="cpf">CPF</Label><Input id="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => set("cpf", e.target.value)} /></div>
                  <div><Label htmlFor="idade">Idade</Label><Input id="idade" type="number" placeholder="Idade" value={form.idade} onChange={(e) => set("idade", e.target.value)} /></div>
                  <div><Label htmlFor="telefone">Telefone</Label><Input id="telefone" placeholder="(00) 00000-0000" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} /></div>
                  <div><Label htmlFor="estado_civil">Estado civil</Label><Input id="estado_civil" placeholder="Estado civil" value={form.estadoCivil} onChange={(e) => set("estadoCivil", e.target.value)} /></div>
                  <div><Label htmlFor="dependentes">Pessoas dependentes</Label><Input id="dependentes" type="number" placeholder="Quantidade" value={form.pessoasDependentes} onChange={(e) => set("pessoasDependentes", e.target.value)} /></div>
                  <div className="md:col-span-2"><Label htmlFor="idade_filhos">Idade dos filhos/dependentes</Label><Input id="idade_filhos" placeholder="Ex: 3, 7, 12" value={form.idadeFilhos} onChange={(e) => set("idadeFilhos", e.target.value)} /></div>
                </div>
              </div>

              <Separator />

              {/* 2. Minha Segurança */}
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

              {/* 3. Situação de Vida */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">3. Minha Situação de Vida</h3>
                <Label className="mb-3 block">Atualmente moro em:</Label>
                <RadioGroup value={form.tipoMoradia} onValueChange={(v) => set("tipoMoradia", v as TipoMoradia)} className="space-y-2 mb-4">
                  {[
                    { v: "CASA_PROPRIA", l: "Casa própria" },
                    { v: "ALUGADA", l: "Casa alugada" },
                    { v: "CEDIDA", l: "Casa cedida (emprestada)" },
                    { v: "ABRIGO", l: "Abrigo temporário" },
                    { v: "OUTRO", l: "Outro" },
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
                  <div><Label htmlFor="qtd_filhos">Quantidade de filhos</Label><Input id="qtd_filhos" type="number" className="max-w-[200px]" value={form.qtdFilhos} onChange={(e) => set("qtdFilhos", e.target.value)} /></div>
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

              {/* 5. Renda */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">5. Minha Renda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Tenho renda hoje?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="renda-sim" /><Label htmlFor="renda-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="renda-nao" /><Label htmlFor="renda-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div><Label htmlFor="renda_valor">Quanto ganho mais ou menos?</Label><Input id="renda_valor" placeholder="R$" /></div>
                  <div><Label htmlFor="renda_dependentes">Pessoas que dependem da minha renda</Label><Input id="renda_dependentes" type="number" /></div>
                  <div><Label htmlFor="renda_origem">De onde vem minha renda?</Label><Input id="renda_origem" /></div>
                  <div>
                    <Label className="mb-2 block">Trabalho formal?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="formal-sim" /><Label htmlFor="formal-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="formal-nao" /><Label htmlFor="formal-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">Renda suficiente?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="suficiente-sim" /><Label htmlFor="suficiente-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="suficiente-nao" /><Label htmlFor="suficiente-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 6. Trabalho */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">6. Minha Situação de Trabalho</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Estou trabalhando hoje?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="trab-sim" /><Label htmlFor="trab-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="trab-nao" /><Label htmlFor="trab-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div><Label htmlFor="trab_area">Se sim, em que?</Label><Input id="trab_area" /></div>
                  <div>
                    <Label className="mb-2 block">Gostaria de trabalhar? Em qual período?</Label>
                    <RadioGroup className="space-y-2">
                      {["Durante o dia", "Durante a noite", "Meio período"].map((o) => (
                        <div key={o} className="flex items-center gap-3">
                          <RadioGroupItem value={o} id={`periodo-${o}`} />
                          <Label htmlFor={`periodo-${o}`} className="font-normal text-sm">{o}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 7. Estudo */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">7. Meu Estudo</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Sei ler?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="ler-sim" /><Label htmlFor="ler-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="ler-nao" /><Label htmlFor="ler-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">Estudei até:</Label>
                    <RadioGroup className="space-y-2">
                      {["Não estudei", "Ensino Fundamental", "Ensino Médio", "Ensino Técnico", "Faculdade"].map((o) => (
                        <div key={o} className="flex items-center gap-3">
                          <RadioGroupItem value={o} id={`estudo-${o}`} />
                          <Label htmlFor={`estudo-${o}`} className="font-normal text-sm">{o}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 8. Rede de Apoio */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">8. Minha Rede de Apoio</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Tenho familiares/amigos de confiança?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="rede-sim" /><Label htmlFor="rede-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="rede-nao" /><Label htmlFor="rede-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">Filhos precisam de vaga em:</Label>
                    <div className="space-y-2">
                      {["Creche", "Escola", "Atendimento Psicossocial", "Não precisa"].map((o) => (
                        <div key={o} className="flex items-center gap-3">
                          <Checkbox id={`vaga-${o}`} />
                          <Label htmlFor={`vaga-${o}`} className="font-normal text-sm">{o}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Preciso de ajuda para moradia?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="moradia-sim" /><Label htmlFor="moradia-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="moradia-nao" /><Label htmlFor="moradia-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">Tenho o que comer todos os dias?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="comer-sim" /><Label htmlFor="comer-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="comer-nao" /><Label htmlFor="comer-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 9. Saúde */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">9. Minha Saúde</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Realizo acompanhamento médico?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="acomp-sim" /><Label htmlFor="acomp-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="acomp-nao" /><Label htmlFor="acomp-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="medicamentos">Medicamentos de uso contínuo</Label>
                    <Input id="medicamentos" placeholder="Quais medicamentos?" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 10. Atendimentos */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">10. Atendimentos que já procurei</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Já procurei serviço de apoio antes?</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="sim" id="apoio-sim" /><Label htmlFor="apoio-sim" className="font-normal">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="nao" id="apoio-nao" /><Label htmlFor="apoio-nao" className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div><Label htmlFor="apoio_qual">Se sim, qual/onde?</Label><Input id="apoio_qual" /></div>
                  <div><Label htmlFor="atendimento_desc">Como foi o atendimento?</Label><Textarea id="atendimento_desc" placeholder="Descreva..." /></div>
                </div>
              </div>

              <Separator />

              {/* 11. O que preciso */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">11. O que eu preciso agora</h3>
                <div className="space-y-2">
                  {["Informações sobre meus direitos", "Atendimento de saúde", "Apoio psicológico", "Atendimento da assistência social", "Apoio para moradia", "Apoio para trabalho/emprego"].map((o) => (
                    <div key={o} className="flex items-center gap-3">
                      <Checkbox id={`preciso-${o}`} />
                      <Label htmlFor={`preciso-${o}`} className="font-normal text-sm">{o}</Label>
                    </div>
                  ))}
                  <div><Label htmlFor="preciso_outro">Outro</Label><Input id="preciso_outro" /></div>
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
              {/* Registro Processual */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">1. Registro Processual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="n_processo">Nº do processo MPU</Label><Input id="n_processo" value={form.numeroCaso} onChange={(e) => set("numeroCaso", e.target.value)} /></div>
                  <div><Label htmlFor="data_acolhimento">Data da reunião de acolhimento</Label><Input id="data_acolhimento" type="date" /></div>
                  <div className="md:col-span-2"><Label htmlFor="servidor">Servidor(a) responsável</Label><Input id="servidor" /></div>
                </div>
              </div>

              <Separator />

              {/* Síntese */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">2. Síntese do Caso</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Tipo de violência identificada:</Label>
                    <div className="space-y-2">
                      {["Física", "Psicológica", "Moral", "Patrimonial", "Outra"].map((o) => (
                        <div key={o} className="flex items-center gap-3">
                          <Checkbox id={`viol-${o}`} />
                          <Label htmlFor={`viol-${o}`} className="font-normal text-sm">{o}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Frequência/Histórico:</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="unico" id="freq-unico" /><Label htmlFor="freq-unico" className="font-normal">Episódio único</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="recorrente" id="freq-recorrente" /><Label htmlFor="freq-recorrente" className="font-normal">Recorrente</Label></div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Classificação */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">3. Classificação</h3>
                <RadioGroup className="space-y-3">
                  {[
                    { v: "1", l: "Categoria 1 – Mulheres com trabalho adequado" },
                    { v: "2", l: "Categoria 2 – Sem trabalho adequado, com condições de trabalhar" },
                    { v: "3", l: "Categoria 3 – Sem trabalho adequado e sem condições de trabalhar" },
                    { v: "4", l: "Categoria 4 – Vítimas de crimes sexuais" },
                  ].map((o) => (
                    <div key={o.v} className="flex items-center gap-3">
                      <RadioGroupItem value={o.v} id={`cat-${o.v}`} />
                      <Label htmlFor={`cat-${o.v}`} className="font-normal text-sm">{o.l}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* Encaminhamentos */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">4. Encaminhamentos sugeridos</h3>
                <div className="space-y-3">
                  {["Serviços de saúde em geral", "Serviço de saúde mental", "Habitação", "Trabalho/emprego", "Assistência social (CRAS/CREAS)", "Assistência educacional"].map((s) => (
                    <div key={s} className="flex items-center gap-3">
                      <Checkbox id={`enc-${s}`} />
                      <Label htmlFor={`enc-${s}`} className="font-normal text-sm">{s}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Observações */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">5. Observações Relevantes</h3>
                <Textarea placeholder="Observações..." className="min-h-[100px]" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Link to="/cadastros">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={mutation.isPending} className="bg-aziz-green hover:bg-aziz-green/90 text-primary-foreground px-8">
              {mutation.isPending ? "Salvando..." : "Salvar Ficha"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
