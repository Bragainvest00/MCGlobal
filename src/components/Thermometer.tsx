"use client";
import React, { useEffect, useState } from "react";

type Ativo = {
  simbolo: string;
  nome: string;
};

type DadosAtivo = {
  precoAtual: number;
  fechamentoAnterior: number;
  viés: "Alta" | "Baixa" | "Lateral";
  variacaoPercent: number;
};

const ativos: Ativo[] = [
  { simbolo: "ES=F", nome: "S&P 500 Fut." },
  { simbolo: "NQ=F", nome: "Nasdaq 100 Fut." },
  { simbolo: "YM=F", nome: "Dow Jones Fut." },
  { simbolo: "VIX", nome: "VIX" },
  { simbolo: "DXY", nome: "Índice Dólar" },
  { simbolo: "USDBRL=X", nome: "USD/BRL" },
  { simbolo: "EURUSD=X", nome: "EUR/USD" },
  { simbolo: "TNX", nome: "10y US Treasury" },
  { simbolo: "WTI=F", nome: "Petróleo WTI" },
  { simbolo: "BZ=F", nome: "Petróleo Brent" },
  { simbolo: "GC=F", nome: "Ouro" },
  { simbolo: "^BVSP", nome: "Ibovespa" },
  { simbolo: "WIN=F", nome: "Mini Índice" },
  { simbolo: "WDO=F", nome: "Mini Dólar" },
];

function getVies(precoAtual: number, fechamentoAnterior: number): "Alta" | "Baixa" | "Lateral" {
  const diffPercent = ((precoAtual - fechamentoAnterior) / fechamentoAnterior) * 100;
  if (diffPercent > 0.1) return "Alta";
  if (diffPercent < -0.1) return "Baixa";
  return "Lateral";
}

export default function Thermometer() {
  const [dados, setDados] = useState<Record<string, DadosAtivo>>({});
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchDados() {
      const newDados: Record<string, DadosAtivo> = {};

      for (const ativo of ativos) {
        try {
          const res = await fetch(
            `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ativo.simbolo}`
          );
          const json = await res.json();
          const quote = json.quoteResponse.result[0];

          const precoAtual = quote.regularMarketPrice;
          const fechamentoAnterior = quote.regularMarketPreviousClose;
          const variacaoPercent = ((precoAtual - fechamentoAnterior) / fechamentoAnterior) * 100;
          const vies = getVies(precoAtual, fechamentoAnterior);

          newDados[ativo.simbolo] = {
            precoAtual,
            fechamentoAnterior,
            viés: vies,
            variacaoPercent,
          };
        } catch (error) {
          console.error("Erro ao buscar dados do ativo", ativo.simbolo, error);
        }
      }

      setDados(newDados);
      setUltimaAtualizacao(new Date());
    }

    fetchDados();

    const interval = setInterval(fetchDados, 300000); // 5 min

    return () => clearInterval(interval);
  }, []);

  function formatarHora(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-900 rounded-md text-white">
      <h2 className="text-2xl font-bold mb-2 text-center">Termômetro do Mercado</h2>
      {ultimaAtualizacao && (
        <p className="text-sm text-gray-400 mb-4 text-center">
          Última atualização: {formatarHora(ultimaAtualizacao)}
        </p>
      )}

      <ul>
        {ativos.map(({ simbolo, nome }) => {
          const d = dados[simbolo];
          let color = "text-gray-400";
          let arrow = "→"; // lateral

          if (d) {
            if (d.viés === "Alta") {
              color = "text-green-400";
              arrow = "⬆";
            } else if (d.viés === "Baixa") {
              color = "text-red-400";
              arrow = "⬇";
            }
          }

          return (
            <li
              key={simbolo}
              className="flex justify-between border-b border-gray-700 py-2"
              title={`Variação: ${d ? d.variacaoPercent.toFixed(2) : "0"}%`}
            >
              <span>{nome}</span>
              <span className={`${color} font-bold`}>
                {arrow} {d ? d.precoAtual.toFixed(2) : "..."}{" "}
                {d && <span className="text-sm ml-2">({d.variacaoPercent.toFixed(2)}%)</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
