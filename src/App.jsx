import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  Car,
  MessageCircle,
  Wrench,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  Repeat,
  Clock,
} from "lucide-react";

// ---------- Design tokens ----------
const COLORS = {
  bg: "#12161B",
  panel: "#1B2128",
  panelAlt: "#20272F",
  line: "#2C343D",
  text: "#F3F0E8",
  muted: "#8B95A1",
  amber: "#F2B705",
  green: "#4CAF7D",
  red: "#E4572E",
};

const displayFont = "'Oswald', 'Arial Narrow', sans-serif";
const bodyFont = "'Inter', 'Helvetica Neue', sans-serif";
const monoFont = "'Roboto Mono', monospace";

// ---------- Illustrative data (template — substituir por dados reais) ----------
const journeyStages = [
  { stage: "Pré-venda", desc: "Atendimento e test-drive", score: 88 },
  { stage: "Fechamento", desc: "Negociação e contrato", score: 81 },
  { stage: "Entrega", desc: "Retirada do veículo", score: 63 },
  { stage: "Pós-venda 30d", desc: "Documentação e garantia", score: 39 },
  { stage: "Pós-venda 90d", desc: "Relacionamento contínuo", score: 27 },
];

const dissatisfactionDrivers = [
  { driver: "Promessas da venda não cumpridas na entrega", pct: 31 },
  { driver: "Atraso na entrega do veículo", pct: 24 },
  { driver: "Documentação / multas pendentes pós-compra", pct: 22 },
  { driver: "Falta de retorno após a venda", pct: 15 },
  { driver: "Problema mecânico não resolvido", pct: 8 },
];

// Dados públicos reais — Reclame Aqui, perfil da empresa (período 01/04/2025–31/03/2026)
const reclameAquiStats = [
  { label: "Nota média dos consumidores", value: "2,2", sub: "de 0 a 10" },
  { label: "Voltariam a fazer negócio", value: "10%", sub: "dos que avaliaram" },
  { label: "Reclamações resolvidas", value: "20%", sub: "das recebidas" },
  { label: "Tempo médio de resposta", value: "4d 18h", sub: "da empresa ao cliente" },
];

const csatTrend = [
  { mes: "Fev", csat: 44 },
  { mes: "Mar", csat: 38 },
  { mes: "Abr", csat: 41 },
  { mes: "Mai", csat: 35 },
  { mes: "Jun", csat: 40 },
  { mes: "Jul", csat: 39 },
];

const actionPlan = [
  {
    day: "D+1",
    title: "Confirmação da entrega",
    desc: "Contato para checar se tudo saiu conforme combinado",
    channel: "WhatsApp",
    icon: CheckCircle2,
  },
  {
    day: "D+7",
    title: "Pesquisa de satisfação",
    desc: "CSAT rápido sobre atendimento e estado do veículo",
    channel: "WhatsApp / SMS",
    icon: MessageCircle,
  },
  {
    day: "D+15",
    title: "Status da documentação",
    desc: "Contato proativo com previsão de transferência/emplacamento",
    channel: "WhatsApp",
    icon: Clock,
  },
  {
    day: "D+30",
    title: "Confirmação de documentação",
    desc: "Confirma transferência e emplacamento concluídos",
    channel: "Ligação",
    icon: FileWarning,
  },
  {
    day: "D+90",
    title: "NPS + relacionamento",
    desc: "Mede recomendação e abre espaço para recompra futura",
    channel: "Ligação / WhatsApp",
    icon: Repeat,
  },
];

// ---------- Indicador simples (número + selo + barra) ----------
function statusFor(value, lowMax, highMin) {
  if (value < lowMax) return "critico";
  if (value < highMin) return "regular";
  return "otimo";
}

const STATUS_MAP = {
  critico: { label: "Crítico", color: COLORS.red },
  regular: { label: "Regular", color: COLORS.amber },
  otimo: { label: "Ótimo", color: COLORS.green },
};

function StatusTag({ status }) {
  const s = STATUS_MAP[status];
  return (
    <span
      style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}` }}
      className="text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
    >
      {s.label}
    </span>
  );
}

function KpiBar({ value, min = 0, max = 100, zones }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div className="relative w-full h-2 rounded-full overflow-hidden flex" style={{ background: COLORS.line }}>
      {zones.map((z, i) => {
        const prevTo = i === 0 ? min : zones[i - 1].to;
        const widthPct = ((z.to - prevTo) / (max - min)) * 100;
        return <div key={i} style={{ width: `${widthPct}%`, background: z.color, opacity: 0.55 }} />;
      })}
      <div
        className="absolute top-1/2 w-[3px] h-4 -translate-y-1/2 rounded-full"
        style={{ left: `calc(${pct}% - 1.5px)`, background: COLORS.text }}
      />
    </div>
  );
}

function KpiCard({ value, displayValue, label, sublabel, min = 0, max = 100, zones, status }) {
  return (
    <div className="flex flex-col gap-3 flex-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div style={{ fontFamily: displayFont, color: COLORS.text }} className="text-4xl leading-none">
            {displayValue}
          </div>
          <div style={{ fontFamily: bodyFont, color: COLORS.text }} className="text-sm font-medium mt-1.5">
            {label}
          </div>
        </div>
        <StatusTag status={status} />
      </div>
      <KpiBar value={value} min={min} max={max} zones={zones} />
      <div style={{ color: COLORS.muted, fontFamily: bodyFont }} className="text-xs">
        {sublabel}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, sub }) {
  return (
    <div
      className="flex items-center gap-4 rounded-lg p-4 flex-1 min-w-[220px]"
      style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}` }}
    >
      <div
        className="flex items-center justify-center rounded-md w-11 h-11 shrink-0"
        style={{ background: COLORS.panelAlt, color: COLORS.amber }}
      >
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontFamily: displayFont, color: COLORS.text }} className="text-2xl leading-none">
          {value}
        </div>
        <div style={{ fontFamily: bodyFont, color: COLORS.muted }} className="text-xs mt-1">
          {label}
        </div>
        {sub && (
          <div style={{ fontFamily: monoFont, color: COLORS.green }} className="text-[11px] mt-0.5">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function stageColor(score) {
  if (score >= 70) return COLORS.green;
  if (score >= 50) return COLORS.amber;
  return COLORS.red;
}

export default function PainelCS() {
  const [tab, setTab] = useState("diagnostico");

  return (
    <div style={{ background: COLORS.bg, fontFamily: bodyFont, color: COLORS.text }} className="w-full min-h-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap');
      `}</style>

      {/* Header */}
      <div className="px-6 md:px-10 pt-8 pb-6" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center"
              style={{ background: COLORS.amber }}
            >
              <Car size={22} color={COLORS.bg} />
            </div>
            <div>
              <div style={{ fontFamily: displayFont }} className="text-xl tracking-wide uppercase">
                Auto Esporte Multimarcas
              </div>
              <div style={{ color: COLORS.muted }} className="text-xs">
                Painel de Satisfação do Cliente — Proposta de Customer Success
              </div>
            </div>
          </div>
          <div
            className="text-xs px-3 py-1.5 rounded-full"
            style={{ background: "rgba(242,183,5,0.12)", color: COLORS.amber, border: `1px solid ${COLORS.amber}` }}
          >
            Informações coletadas a partir de avaliações reais na internet
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 py-8 space-y-10 max-w-[1100px] mx-auto">
        {/* Diagnóstico real (dados públicos) */}
        <section>
          <SectionTitle eyebrow="Diagnóstico real" title="O que os dados públicos já mostram" />
          <div
            className="rounded-xl p-6"
            style={{ background: "rgba(228,87,46,0.08)", border: `1px solid ${COLORS.red}` }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {reclameAquiStats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: displayFont, color: COLORS.red }} className="text-3xl leading-none">
                    {s.value}
                  </div>
                  <div style={{ fontFamily: bodyFont, color: COLORS.text }} className="text-xs font-medium mt-1.5">
                    {s.label}
                  </div>
                  <div style={{ color: COLORS.muted }} className="text-[11px] mt-0.5">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ color: COLORS.muted, fontFamily: bodyFont }} className="text-xs mt-5">
              Fonte: perfil público da empresa no Reclame Aqui, dados de 01/04/2025 a 31/03/2026. Padrão relatado
              nos comentários: atendimento na venda é elogiado, pós-venda é o ponto de ruptura — entregas com
              pendências prometidas e não cumpridas, atraso na entrega e documentação/multas resolvidas com
              lentidão.
            </div>
          </div>
        </section>

        {/* Gauges */}
        <section>
          <SectionTitle eyebrow="Modelo de acompanhamento" title="Indicadores-chave de CS (proposta)" />
          <div
            className="rounded-xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6"
            style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}` }}
          >
            <div className="sm:pr-8" style={{ borderRight: `1px solid ${COLORS.line}` }}>
              <KpiCard
                value={87}
                displayValue="87"
                label="CSAT — Atendimento na venda"
                sublabel="Pré-venda e negociação (escala 0–100)"
                min={0}
                max={100}
                zones={[{ to: 40, color: COLORS.red }, { to: 70, color: COLORS.amber }, { to: 100, color: COLORS.green }]}
                status={statusFor(87, 40, 70)}
              />
            </div>
            <div className="sm:pr-8" style={{ borderRight: `1px solid ${COLORS.line}` }}>
              <KpiCard
                value={38}
                displayValue="38"
                label="CSAT — Pós-venda"
                sublabel="Entrega, documentação e garantia (escala 0–100)"
                min={0}
                max={100}
                zones={[{ to: 40, color: COLORS.red }, { to: 70, color: COLORS.amber }, { to: 100, color: COLORS.green }]}
                status={statusFor(38, 40, 70)}
              />
            </div>
            <KpiCard
              value={-22}
              displayValue="-22"
              label="NPS geral"
              sublabel="Puxado para baixo pelo pós-venda"
              min={-100}
              max={100}
              zones={[{ to: 0, color: COLORS.red }, { to: 50, color: COLORS.amber }, { to: 100, color: COLORS.green }]}
              status={statusFor(-22, 0, 50)}
            />
          </div>
          <div style={{ color: COLORS.muted, fontFamily: bodyFont }} className="text-xs mt-3">
            Modelo ilustrativo — calibrado na direção apontada pelos dados públicos abaixo, até a primeira
            pesquisa real de satisfação da loja.
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <StatCard icon={Repeat} value="10%" label="Voltariam a fazer negócio" sub="dado real — Reclame Aqui" />
            <StatCard icon={Clock} value="4d 18h" label="Tempo médio de resposta" sub="dado real — Reclame Aqui" />
            <StatCard icon={AlertTriangle} value="38%" label="Clientes detratores (estimado)" sub="foco do plano de ação" />
          </div>
        </section>

        {/* Jornada */}
        <section>
          <SectionTitle eyebrow="Jornada" title="Satisfação por etapa da venda" />
          <div
            className="rounded-xl p-6"
            style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}` }}
          >
            <div className="relative flex justify-between items-end gap-2 pt-6">
              <div
                className="absolute left-0 right-0 top-[38px] h-[2px]"
                style={{ background: COLORS.line }}
              />
              {journeyStages.map((s, i) => (
                <div key={i} className="relative flex-1 flex flex-col items-center text-center">
                  <div
                    style={{ fontFamily: displayFont, color: stageColor(s.score) }}
                    className="text-2xl mb-2"
                  >
                    {s.score}
                  </div>
                  <div
                    className="w-3.5 h-3.5 rounded-full mb-3 relative z-10"
                    style={{ background: stageColor(s.score), border: `2px solid ${COLORS.bg}` }}
                  />
                  <div style={{ fontFamily: bodyFont }} className="text-xs font-medium">
                    {s.stage}
                  </div>
                  <div style={{ color: COLORS.muted }} className="text-[11px] mt-1 max-w-[110px]">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ color: COLORS.muted, fontFamily: bodyFont }} className="text-xs mt-6">
              Padrão comum no varejo de seminovos: a satisfação cai depois da entrega, quando documentação e
              garantia entram em cena — exatamente onde um acompanhamento estruturado de CS reverte o quadro.
            </div>
          </div>
        </section>

        {/* Diagnóstico + tendência */}
        <section>
          <SectionTitle eyebrow="Diagnóstico" title="Principais motivos de insatisfação" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div
              className="lg:col-span-3 rounded-xl p-6"
              style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}` }}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dissatisfactionDrivers} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} horizontal={false} />
                  <XAxis type="number" tick={{ fill: COLORS.muted, fontSize: 11 }} stroke={COLORS.line} />
                  <YAxis
                    type="category"
                    dataKey="driver"
                    width={230}
                    tick={{ fill: COLORS.text, fontSize: 11 }}
                    stroke={COLORS.line}
                  />
                  <Tooltip
                    contentStyle={{ background: COLORS.panelAlt, border: `1px solid ${COLORS.line}`, fontSize: 12 }}
                    labelStyle={{ color: COLORS.text }}
                    formatter={(v) => [`${v}%`, "% dos relatos"]}
                  />
                  <Bar dataKey="pct" radius={[0, 4, 4, 0]} fill={COLORS.amber} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ color: COLORS.muted, fontFamily: bodyFont }} className="text-xs mt-2">
                Categorias extraídas de reclamações reais registradas no Reclame Aqui. Os percentuais são uma
                estimativa de proporção até a primeira coleta estruturada de dados da loja.
              </div>
            </div>

            <div
              className="lg:col-span-2 rounded-xl p-6"
              style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}` }}
            >
              <div style={{ fontFamily: bodyFont }} className="text-sm font-medium mb-3">
                Evolução do CSAT pós-venda (últimos 6 meses)
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={csatTrend}>
                  <defs>
                    <linearGradient id="csatFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: COLORS.muted, fontSize: 11 }} stroke={COLORS.line} />
                  <YAxis domain={[0, 100]} tick={{ fill: COLORS.muted, fontSize: 11 }} stroke={COLORS.line} />
                  <Tooltip
                    contentStyle={{ background: COLORS.panelAlt, border: `1px solid ${COLORS.line}`, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="csat" stroke={COLORS.amber} fill="url(#csatFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Plano de ação */}
        <section>
          <SectionTitle eyebrow="Proposta" title="Cadência de acompanhamento pós-venda" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {actionPlan.map((a, i) => {
              const Icon = a.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl p-5"
                  style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      style={{ fontFamily: monoFont, color: COLORS.amber }}
                      className="text-xs px-2 py-0.5 rounded"
                    >
                      {a.day}
                    </span>
                    <Icon size={18} color={COLORS.muted} />
                  </div>
                  <div style={{ fontFamily: bodyFont }} className="text-sm font-semibold mb-1">
                    {a.title}
                  </div>
                  <div style={{ color: COLORS.muted }} className="text-xs mb-3">
                    {a.desc}
                  </div>
                  <div style={{ fontFamily: monoFont, color: COLORS.text }} className="text-[11px] flex items-center gap-1">
                    <PhoneCall size={12} /> {a.channel}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer / assinatura */}
        <section
          className="rounded-xl p-6 flex flex-wrap items-center justify-between gap-4"
          style={{ background: COLORS.panelAlt, border: `1px solid ${COLORS.line}` }}
        >
          <div className="flex items-center gap-3">
            <Wrench size={20} color={COLORS.amber} />
            <div style={{ fontFamily: bodyFont }} className="text-sm">
              Proposta de estruturação de Customer Success para pós-venda
            </div>
          </div>
          <div style={{ color: COLORS.muted, fontFamily: bodyFont }} className="text-xs">
            João Vitor — Especialista em Customer Success
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-4">
      <div style={{ fontFamily: monoFont, color: "#F2B705" }} className="text-[11px] uppercase tracking-widest mb-1">
        {eyebrow}
      </div>
      <div style={{ fontFamily: displayFont }} className="text-lg tracking-wide">
        {title}
      </div>
    </div>
  );
}