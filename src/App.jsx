import React, { createContext, useContext } from "react";
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
  bg: "#F3F6F1",
  panel: "#FFFFFF",
  panelAlt: "#F2F5F0",
  line: "#C7CFC2",
  text: "#12161A",
  muted: "#5B655F",
  amber: "#B8790A",
  green: "#1F8A3D",
  red: "#C1451F",
};

const displayFont = "'Oswald', 'Arial Narrow', sans-serif";
const bodyFont = "'Inter', 'Helvetica Neue', sans-serif";
const monoFont = "'Roboto Mono', monospace";

const ColorContext = createContext(COLORS);
const useColors = () => useContext(ColorContext);

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

function StatusTag({ status }) {
  const colors = useColors();
  const map = {
    critico: { label: "Crítico", color: colors.red },
    regular: { label: "Regular", color: colors.amber },
    otimo: { label: "Ótimo", color: colors.green },
  };
  const s = map[status];
  return (
    <span
      style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}` }}
      className="text-[12px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
    >
      {s.label}
    </span>
  );
}

function KpiBar({ value, min = 0, max = 100, zones }) {
  const colors = useColors();
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div className="relative w-full h-2 rounded-full overflow-hidden flex" style={{ background: colors.line }}>
      {zones.map((z, i) => {
        const prevTo = i === 0 ? min : zones[i - 1].to;
        const widthPct = ((z.to - prevTo) / (max - min)) * 100;
        return <div key={i} style={{ width: `${widthPct}%`, background: z.color, opacity: 0.55 }} />;
      })}
      <div
        className="absolute top-1/2 w-[3px] h-4 -translate-y-1/2 rounded-full"
        style={{ left: `calc(${pct}% - 1.5px)`, background: colors.text }}
      />
    </div>
  );
}

function KpiCard({ value, displayValue, label, sublabel, min = 0, max = 100, zones, status }) {
  const colors = useColors();
  return (
    <div className="flex flex-col gap-3 flex-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div style={{ fontFamily: displayFont, color: colors.text }} className="text-4xl sm:text-5xl leading-none">
            {displayValue}
          </div>
          <div
            style={{ fontFamily: bodyFont, color: colors.text }}
            className="text-base font-medium mt-1.5 min-h-[2.75rem] sm:min-h-[2.5rem] leading-snug"
          >
            {label}
          </div>
        </div>
        <StatusTag status={status} />
      </div>
      <KpiBar value={value} min={min} max={max} zones={zones} />
      <div style={{ color: colors.muted, fontFamily: bodyFont }} className="text-sm">
        {sublabel}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, sub }) {
  const colors = useColors();
  return (
    <div
      className="flex items-center gap-4 rounded-lg p-4 flex-1 min-w-[200px]"
      style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
    >
      <div
        className="flex items-center justify-center rounded-md w-11 h-11 shrink-0"
        style={{ background: colors.panelAlt, color: colors.green }}
      >
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontFamily: displayFont, color: colors.text }} className="text-3xl leading-none">
          {value}
        </div>
        <div style={{ fontFamily: bodyFont, color: colors.muted }} className="text-sm mt-1">
          {label}
        </div>
        {sub && (
          <div style={{ fontFamily: monoFont, color: colors.green }} className="text-[12px] mt-0.5">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  const colors = useColors();
  return (
    <div className="mb-4">
      <div style={{ fontFamily: monoFont, color: colors.green }} className="text-[12px] uppercase tracking-widest mb-1">
        {eyebrow}
      </div>
      <div style={{ fontFamily: displayFont, color: colors.text }} className="text-lg sm:text-xl tracking-wide">
        {title}
      </div>
    </div>
  );
}

export default function PainelCS() {
  const colors = COLORS;

  const stageColor = (score) => {
    if (score >= 70) return colors.green;
    if (score >= 50) return colors.amber;
    return colors.red;
  };

  return (
    <ColorContext.Provider value={colors}>
      <div
        style={{ background: colors.bg, fontFamily: bodyFont, color: colors.text }}
        className="w-full min-h-full"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap');
        `}</style>

        {/* Header */}
        <div className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-6" style={{ borderBottom: `1px solid ${colors.line}` }}>
          <div className="flex items-start sm:items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 sm:h-12 px-3 py-2 rounded-md flex items-center shrink-0">
                <img
                  src="/logo-auto-esporte.png"
                  alt="Auto Esporte Multimarcas"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <div style={{ fontFamily: displayFont }} className="text-xl sm:text-2xl tracking-wide uppercase">
                  Auto Esporte Multimarcas
                </div>
                <div style={{ color: colors.muted }} className="text-sm">
                  Painel de Satisfação do Cliente — Proposta de Customer Success
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto sm:ml-0">
              <div
                className="text-sm px-3 py-1.5 rounded-lg"
                style={{ background: `${colors.green}1F`, color: colors.green, border: `1px solid ${colors.green}` }}
              >
                Informações coletadas a partir de avaliações reais na internet
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-10 py-8 space-y-10 max-w-[1100px] mx-auto">
          {/* Diagnóstico real (dados públicos) */}
          <section>
            <SectionTitle eyebrow="Diagnóstico real" title="O que os dados públicos já mostram" />
            <div
              className="rounded-xl p-5 sm:p-6"
              style={{ background: `${colors.red}14`, border: `1px solid ${colors.red}` }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {reclameAquiStats.map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: displayFont, color: colors.red }} className="text-3xl sm:text-4xl leading-none">
                      {s.value}
                    </div>
                    <div style={{ fontFamily: bodyFont, color: colors.text }} className="text-sm font-medium mt-1.5">
                      {s.label}
                    </div>
                    <div style={{ color: colors.muted }} className="text-[12px] mt-0.5">
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ color: colors.muted, fontFamily: bodyFont }} className="text-sm mt-5">
                Fonte: perfil público da empresa no Reclame Aqui, dados de 01/04/2025 a 31/03/2026. Padrão relatado
                nos comentários: atendimento na venda é elogiado, pós-venda é o ponto de ruptura — entregas com
                pendências prometidas e não cumpridas, atraso na entrega e documentação/multas resolvidas com
                lentidão.
              </div>
            </div>
          </section>

          {/* KPIs */}
          <section>
            <SectionTitle eyebrow="Modelo de acompanhamento" title="Indicadores-chave de CS (proposta)" />
            <div
              className="rounded-xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-7"
              style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
            >
              <KpiCard
                value={87}
                displayValue="87"
                label="CSAT — Atendimento na venda"
                sublabel="Pré-venda e negociação (escala 0–100)"
                min={0}
                max={100}
                zones={[{ to: 40, color: colors.red }, { to: 70, color: colors.amber }, { to: 100, color: colors.green }]}
                status={statusFor(87, 40, 70)}
              />
              <KpiCard
                value={38}
                displayValue="38"
                label="CSAT — Pós-venda"
                sublabel="Entrega, documentação e garantia (escala 0–100)"
                min={0}
                max={100}
                zones={[{ to: 40, color: colors.red }, { to: 70, color: colors.amber }, { to: 100, color: colors.green }]}
                status={statusFor(38, 40, 70)}
              />
              <KpiCard
                value={-22}
                displayValue="-22"
                label="NPS geral"
                sublabel="Puxado para baixo pelo pós-venda"
                min={-100}
                max={100}
                zones={[{ to: 0, color: colors.red }, { to: 50, color: colors.amber }, { to: 100, color: colors.green }]}
                status={statusFor(-22, 0, 50)}
              />
            </div>
            <div style={{ color: colors.muted, fontFamily: bodyFont }} className="text-sm mt-3">
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
              className="rounded-xl p-5 sm:p-6"
              style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
            >
              {/* Vertical: celular e tablet retrato */}
              <div className="md:hidden">
                {journeyStages.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ background: stageColor(s.score), border: `2px solid ${colors.panel}` }}
                      />
                      {i < journeyStages.length - 1 && (
                        <div className="w-[2px] flex-1 my-1" style={{ background: colors.line, minHeight: 32 }} />
                      )}
                    </div>
                    <div className={i < journeyStages.length - 1 ? "pb-6" : ""}>
                      <div className="flex items-baseline gap-2 -mt-1.5">
                        <span style={{ fontFamily: displayFont, color: stageColor(s.score) }} className="text-2xl">
                          {s.score}
                        </span>
                        <span style={{ fontFamily: bodyFont }} className="text-sm font-medium">
                          {s.stage}
                        </span>
                      </div>
                      <div style={{ color: colors.muted }} className="text-[12px] mt-0.5">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Horizontal: tablet paisagem, notebook, TV — linha única, sem quebra */}
              <div className="hidden md:grid grid-cols-5 gap-x-2">
                {journeyStages.map((s, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div style={{ fontFamily: displayFont, color: stageColor(s.score) }} className="text-3xl mb-2">
                      {s.score}
                    </div>
                    <div className="relative w-full flex items-center justify-center mb-3" style={{ height: 14 }}>
                      {i > 0 && (
                        <div
                          className="absolute right-1/2 top-1/2 -translate-y-1/2 h-[2px] w-full"
                          style={{ background: colors.line }}
                        />
                      )}
                      {i < journeyStages.length - 1 && (
                        <div
                          className="absolute left-1/2 top-1/2 -translate-y-1/2 h-[2px] w-full"
                          style={{ background: colors.line }}
                        />
                      )}
                      <div
                        className="w-3.5 h-3.5 rounded-full relative z-10"
                        style={{ background: stageColor(s.score), border: `2px solid ${colors.panel}` }}
                      />
                    </div>
                    <div style={{ fontFamily: bodyFont }} className="text-sm font-medium">
                      {s.stage}
                    </div>
                    <div style={{ color: colors.muted }} className="text-[12px] mt-1 max-w-[120px]">
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ color: colors.muted, fontFamily: bodyFont }} className="text-sm mt-6">
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
                className="lg:col-span-3 rounded-xl p-5 sm:p-6"
                style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dissatisfactionDrivers} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.line} horizontal={false} />
                    <XAxis type="number" tick={{ fill: colors.muted, fontSize: 11 }} stroke={colors.line} />
                    <YAxis
                      type="category"
                      dataKey="driver"
                      width={150}
                      tick={{ fill: colors.text, fontSize: 10 }}
                      stroke={colors.line}
                    />
                    <Tooltip
                      contentStyle={{ background: colors.panelAlt, border: `1px solid ${colors.line}`, fontSize: 12 }}
                      labelStyle={{ color: colors.text }}
                      formatter={(v) => [`${v}%`, "% dos relatos"]}
                    />
                    <Bar dataKey="pct" radius={[0, 4, 4, 0]} fill={colors.red} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ color: colors.muted, fontFamily: bodyFont }} className="text-sm mt-2">
                  Categorias extraídas de reclamações reais registradas no Reclame Aqui. Os percentuais são uma
                  estimativa de proporção até a primeira coleta estruturada de dados da loja.
                </div>
              </div>

              <div
                className="lg:col-span-2 rounded-xl p-5 sm:p-6"
                style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
              >
                <div style={{ fontFamily: bodyFont }} className="text-base font-medium mb-3">
                  Evolução do CSAT pós-venda (últimos 6 meses)
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={csatTrend}>
                    <defs>
                      <linearGradient id="csatFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.red} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={colors.red} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.line} vertical={false} />
                    <XAxis dataKey="mes" tick={{ fill: colors.muted, fontSize: 11 }} stroke={colors.line} />
                    <YAxis domain={[0, 100]} tick={{ fill: colors.muted, fontSize: 11 }} stroke={colors.line} />
                    <Tooltip contentStyle={{ background: colors.panelAlt, border: `1px solid ${colors.line}`, fontSize: 12 }} />
                    <Area type="monotone" dataKey="csat" stroke={colors.red} fill="url(#csatFill)" strokeWidth={2} />
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
                    style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span style={{ fontFamily: monoFont, color: colors.green }} className="text-sm px-2 py-0.5 rounded">
                        {a.day}
                      </span>
                      <Icon size={18} color={colors.muted} />
                    </div>
                    <div style={{ fontFamily: bodyFont }} className="text-base font-semibold mb-1">
                      {a.title}
                    </div>
                    <div style={{ color: colors.muted }} className="text-sm mb-3">
                      {a.desc}
                    </div>
                    <div style={{ fontFamily: monoFont, color: colors.text }} className="text-[12px] flex items-center gap-1">
                      <PhoneCall size={12} /> {a.channel}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Footer / assinatura */}
          <section
            className="rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
            style={{ background: colors.panelAlt, border: `1px solid ${colors.line}` }}
          >
            <div className="flex items-center gap-3">
              <Wrench size={20} color={colors.green} />
              <div style={{ fontFamily: bodyFont }} className="text-base">
                Proposta de estruturação de Customer Success para pós-venda
              </div>
            </div>
            <div style={{ color: colors.muted, fontFamily: bodyFont }} className="text-sm">
              João Vitor — Especialista em Customer Success
            </div>
          </section>
        </div>
      </div>
    </ColorContext.Provider>
  );
}