export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-center text-cyan-400">🌐 MCGlobal</h1>
        <p className="text-center text-sm text-gray-400">Análise mundial do clima de mercado</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">🌡️ Termômetro Global do Mercado</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-red-600/20 p-4 rounded-xl border border-red-500">
            <h3 className="text-lg font-semibold">🇺🇸 EUA</h3>
            <p className="text-sm text-red-300">Baixa tensão no mercado</p>
          </div>

          <div className="bg-yellow-500/20 p-4 rounded-xl border border-yellow-400">
            <h3 className="text-lg font-semibold">🇪🇺 Europa</h3>
            <p className="text-sm text-yellow-200">Mercado neutro</p>
          </div>

          <div className="bg-green-600/20 p-4 rounded-xl border border-green-500">
            <h3 className="text-lg font-semibold">🇨🇳 Ásia</h3>
            <p className="text-sm text-green-300">Tendência de alta</p>
          </div>
        </div>
      </section>
    </main>
  );
}
