"use client";
import React, { useEffect, useState } from "react";
import Thermometer from "../components/Thermometer";

type Viés = "Alta" | "Baixa" | "Lateral";

type Ativo = {
  simbolo: string;
  nome: string;
  regiao: "EUA" | "Europa" | "Ásia";
};

type DadosAtivo = {
  precoAtual: number;
  fechamentoAnterior: number;
  vies: Viés;
};

const ativos: Ativo[] = [
  // EUA
  { simbolo: "ES=F", nome: "S&P 500 Fut.", regiao: "EUA" },
  { simbolo: "NQ=F", nome: "Nasdaq 100 Fut.", regiao: "EUA" },
  { simbolo: "YM=F", nome: "Dow Jones Fut.", regiao: "EUA" },
  { simbolo: "VIX", nome: "VIX", regiao: "EUA" },
  { simbolo: "DXY", nome: "Índice Dólar", regiao: "EUA" },
  { simbolo: "USDBRL=X", nome: "USD/BRL", regiao: "EUA" },
  { simbolo: "TNX", nome: "10y US Treasury", regiao: "EUA" },

  // Europa
  { simbolo: "EURUSD=X", nome: "EUR/USD", regiao: "Europa" },

  // Ásia
  { simbolo: "WTI=F", nome: "Petróleo WTI", regiao: "Ásia" },
  { simbolo: "BZ=F", nome: "Petróleo Brent", regiao: "Ásia" },
  { simbolo: "GC=F", nome: "Ouro", regiao: "Ásia" },
  { simbolo: "^BVSP", nome: "Ibovespa", regiao: "Ásia" },
  { simbolo: "WIN=F", nome: "Mini Índice", regiao: "Ásia" },
  { simbolo: "WDO=F", nome: "Mini Dólar", regiao: "Ásia" },
];

function getVies(precoAtual: number, fechamentoAnterior: number): Viés {
  const diff = precoAtual - fechamentoAnterior;
  const diffPercent = (diff / fechamentoAnterior) * 100;
  if (diffPercent > 0.1) return "Alta";
  if (diffPercent < -0.1) return "Baixa";
  return "Lateral";
}

function getMediaVies(vies: Viés[]): number {
  const valores = vies.map((v) => (v === "Alta" ? 1 : v === "Baixa" ? -1 : 0));
  const soma = valores.reduce((acc: number, val: number) => acc + val, 0);
  return valores.length > 0 ? soma / valores.length : 0;
}


function getCorETexto(media: number) {
  if (media > 0.3) {
    return {
      corBg: "bg-green-600/20",
      corBorda: "border-green-500",
      textoCor: "text-green-300",
      texto: "Tendência de alta",
    };
  }
  if (media < -0.3) {
    return {
      corBg: "bg-red-600/20",
      corBorda: "border-red-500",
      textoCor: "text-red-300",
      texto: "Baixa tensão no mercado",
    };
  }
  return {
    corBg: "bg-yellow-500/20",
    corBorda: "border-yellow-400",
    textoCor: "text-yellow-200",
    texto: "Mercado neutro",
  };
}

export default function Home() {
  const [dados, setDados] = useState<Record<string, DadosAtivo>>({});

  useEffect(() => {
    async function fetchDados() {
      const newDados: Record<string, DadosAtivo> = {};

      for (const ativo of ativos) {
        try {
          const res = await fetch(`/api/quote?symbols=${ativo.simbolo}`);
          const json = await res.json();
          const quote = json.quoteResponse.result[0];

          const precoAtual = quote.regularMarketPrice;
          const fechamentoAnterior = quote.regularMarketPreviousClose;

          const vies = getVies(precoAtual, fechamentoAnterior);

          newDados[ativo.simbolo] = {
            precoAtual,
            fechamentoAnterior,
            vies,
          };
        } catch (error) {
          console.error("Erro ao buscar dados do ativo", ativo.simbolo, error);
        }
      }

      setDados(newDados);
    }

    fetchDados();
    const interval = setInterval(fetchDados, 300000); // atualiza a cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  const viesPorRegiao: Record<string, Viés[]> = { EUA: [], Europa: [], Ásia: [] };

  ativos.forEach(({ simbolo, regiao }) => {
    if (dados[simbolo]) {
      viesPorRegiao[regiao].push(dados[simbolo].vies);
    }
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-center text-cyan-400">🌐 MCGlobal</h1>
        <p className="text-center text-sm text-gray-400">Análise mundial do clima de mercado</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">🌡️ Termômetro Global do Mercado</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {["EUA", "Europa", "Ásia"].map((regiao) => {
            const media = getMediaVies(viesPorRegiao[regiao]);
            const { corBg, corBorda, textoCor, texto } = getCorETexto(media);
            const bandeira = regiao === "EUA" ? "🇺🇸" : regiao === "Europa" ? "🇪🇺" : "🇨🇳";

            return (
              <div key={regiao} className={`${corBg} p-4 rounded-xl border ${corBorda}`}>
                <h3 className="text-lg font-semibold">
                  {bandeira} {regiao}
                </h3>
                <p className={`text-sm ${textoCor}`}>{texto}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Thermometer />
    </main>
  );
}

