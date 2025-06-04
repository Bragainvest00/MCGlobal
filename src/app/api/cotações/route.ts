// src/app/api/cotacoes/route.ts

import { NextResponse } from "next/server";

const ativos = [
  "ES=F", "NQ=F", "YM=F", "VIX", "DXY", "USDBRL=X", "TNX",
  "EURUSD=X", "WTI=F", "BZ=F", "GC=F", "^BVSP", "WIN=F", "WDO=F",
];

export async function GET() {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ativos.join(",")}`
    );
    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar cotações." },
      { status: 500 }
    );
  }
}
