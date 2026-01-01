// app/deals/parceiros/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Anuncie na Desapegrow | Deals para Lojistas e Marcas Grow",
  description:
    "A Desapegrow é o marketplace de equipamentos grow gamificado que gera tráfego qualificado e vendas para lojas, marcas e consultores de cultivo. Anuncie suas promoções na aba DEALS.",
};

export default function DealsPartnersPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="px-4 py-16 md:py-24 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Anuncie suas ofertas de cultivo para quem compra{" "}
            <span className="text-emerald-400">todos os dias</span>.
          </h1>
          <p className="mt-4 text-slate-200">
            A Desapegrow é o primeiro marketplace de equipamentos grow
            gamificado do Brasil. Alcance growers engajados, movidos por
            pontos, níveis e desafios, prontos para aproveitar os melhores
            deals do universo de cultivo.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="#form"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
            >
              Quero anunciar na Desapegrow
            </Link>
            <Link
              href="#planos"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-600 text-slate-100 hover:bg-slate-900 transition"
            >
              Ver formatos e planos
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Ideal para growshops, headshops, marcas de nutrientes, iluminação,
            armários, ventilação e consultores de cultivo.
          </p>
        </div>

        {/* “Visual” lado direito – pode virar ilustração/grafico depois */}
        <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/60">
          <h2 className="text-sm font-semibold text-emerald-300">
            Por que anunciar na Desapegrow?
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-100">
            <li>• Público 100% focado em cultivo indoor e outdoor.</li>
            <li>• Usuários gamificados com pontos, níveis e recompensas.</li>
            <li>• Deals em destaque na aba exclusiva de promoções.</li>
            <li>• Tráfego qualificado pronto para converter em vendas.</li>
          </ul>
          <p className="mt-4 text-xs text-slate-400">
            Inspirado nas melhores práticas de landing pages de alta conversão:
            mensagem clara, benefícios visíveis e CTA direto para ação.
          </p>
        </div>
      </section>

      {/* SEÇÃO: BENEFÍCIOS PRINCIPAIS */}
      <section
        id="beneficios"
        className="px-4 py-12 md:py-16 max-w-5xl mx-auto"
      >
        <header className="max-w-2xl mb-8">
          <h2 className="text-2xl font-semibold">
            Um canal de vendas feito sob medida para o mercado grow.
          </h2>
          <p className="mt-3 text-slate-200">
            Em vez de disputar atenção em plataformas genéricas de oferta,
            suas promoções aparecem em um ambiente criado exclusivamente para
            quem busca equipamentos e soluções de cultivo.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/50">
            <h3 className="font-semibold text-emerald-300 mb-2">
              Tráfego ultra segmentado
            </h3>
            <p className="text-sm text-slate-200">
              Seus anúncios aparecem para growers que já estão pesquisando por
              iluminação, armários, ventilação, nutrientes e acessórios de
              cultivo.
            </p>
          </div>

          <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/50">
            <h3 className="font-semibold text-emerald-300 mb-2">
              Gamificação que impulsiona compras
            </h3>
            <p className="text-sm text-slate-200">
              Cada compra gera pontos, badges e níveis. Ofertas patrocinadas
              podem conceder mais CultivoCoins e recompensas extras, aumentando
              a taxa de conversão.
            </p>
          </div>

          <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/50">
            <h3 className="font-semibold text-emerald-300 mb-2">
              Marca em evidência
            </h3>
            <p className="text-sm text-slate-200">
              Você pode destacar sua loja ou marca na aba DEALS, em posições
              premium e missões patrocinadas, fortalecendo branding e
              recorrência.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO: FORMATOS E PLANOS */}
      <section
        id="planos"
        className="px-4 py-12 md:py-16 max-w-5xl mx-auto border-t border-slate-800"
      >
        <header className="max-w-2xl mb-8">
          <h2 className="text-2xl font-semibold">
            Formatos flexíveis para diferentes estratégias.
          </h2>
          <p className="mt-3 text-slate-200">
            Escolha entre modelos de performance (por venda/lead) ou mídia
            focada em awareness e lançamento de produtos.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Plano 1 */}
          <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/60 flex flex-col">
            <h3 className="font-semibold text-emerald-300 mb-1">
              DEALS Afiliados
            </h3>
            <p className="text-sm text-slate-200 mb-3">
              Para lojas que já têm e-commerce próprio e querem vender mais.
            </p>
            <ul className="text-sm text-slate-200 space-y-1 flex-1">
              <li>• Links rastreados com UTM ou ID de afiliado.</li>
              <li>• Cobrança por venda (CPS) ou por lead (CPA).</li>
              <li>• Posicionamento em listas de ofertas da aba DEALS.</li>
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              Ideal para escalar vendas sem risco: você só paga quando a ação
              desejada acontece.
            </p>
          </div>

          {/* Plano 2 */}
          <div className="border border-emerald-500 rounded-xl p-5 bg-slate-900 flex flex-col shadow-lg shadow-emerald-500/15">
            <h3 className="font-semibold text-emerald-300 mb-1">
              Destaques &amp; Banners
            </h3>
            <p className="text-sm text-slate-200 mb-3">
              Para campanhas de visibilidade, lançamentos e queimas de estoque.
            </p>
            <ul className="text-sm text-slate-200 space-y-1 flex-1">
              <li>• Destaques na aba DEALS e na home do marketplace.</li>
              <li>• Banners em posições estratégicas para mobile e desktop.</li>
              <li>• Segmentação por categoria de produto ou tipo de público.</li>
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              Recomendado para novas marcas ou linhas que precisam ganhar
              relevância rápida entre growers.
            </p>
          </div>

          {/* Plano 3 */}
          <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/60 flex flex-col">
            <h3 className="font-semibold text-emerald-300 mb-1">
              Missões Gamificadas
            </h3>
            <p className="text-sm text-slate-200 mb-3">
              Transforme a compra na sua marca em desafio com recompensa.
            </p>
            <ul className="text-sm text-slate-200 space-y-1 flex-1">
              <li>• Criação de missões temáticas patrocinadas.</li>
              <li>• Pontos extras, badges e bônus em compras selecionadas.</li>
              <li>• Incentivo à recorrência e fidelização de clientes.</li>
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              Perfeito para quem quer construir comunidade em torno da marca e
              aumentar ticket médio.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="#form"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
          >
            Falar com time comercial
          </Link>
          <span className="text-xs text-slate-400 self-center">
            Planos personalizados para redes de lojas e fabricantes.
          </span>
        </div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA */}
      <section
        id="como-funciona"
        className="px-4 py-12 md:py-16 max-w-5xl mx-auto border-t border-slate-800"
      >
        <header className="max-w-2xl mb-8">
          <h2 className="text-2xl font-semibold">Como começar a anunciar.</h2>
          <p className="mt-3 text-slate-200">
            Um fluxo simples para você colocar suas promoções no ar rapidamente
            e começar a medir resultados.
          </p>
        </header>

        <ol className="space-y-4 text-slate-200 text-sm">
          <li>
            <span className="font-semibold text-emerald-300">
              1. Envie seus dados
            </span>{" "}
            – preencha o formulário abaixo com informações da sua loja, marca ou
            consultoria de cultivo.
          </li>
          <li>
            <span className="font-semibold text-emerald-300">
              2. Defina o modelo de parceria
            </span>{" "}
            – escolha entre performance (CPS/CPA) ou mídia (banners, destaques,
            missões).
          </li>
          <li>
            <span className="font-semibold text-emerald-300">
              3. Configure ofertas e tracking
            </span>{" "}
            – envie produtos, links, cupons e condições; a equipe da Desapegrow
            configura o rastreamento.
          </li>
          <li>
            <span className="font-semibold text-emerald-300">
              4. Acompanhe resultados
            </span>{" "}
            – receba relatórios com cliques, vendas, ticket médio e impacto das
            ações gamificadas.
          </li>
        </ol>
      </section>

      {/* SEÇÃO: PROVA SOCIAL / CONFIANÇA */}
      <section
        id="prova-social"
        className="px-4 py-12 md:py-16 max-w-5xl mx-auto border-t border-slate-800"
      >
        <header className="max-w-2xl mb-6">
          <h2 className="text-2xl font-semibold">
            Construído para o ecossistema de cultivo.
          </h2>
          <p className="mt-3 text-slate-200">
            A Desapegrow nasce como marketplace gamificado de equipamentos
            grow, com foco em comunidade, recorrência e experiência real de
            quem cultiva.
          </p>
        </header>

        {/* Aqui depois você pode plugar logos de marcas/lojistas e depoimentos reais */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/50 text-sm text-slate-200">
            <p className="italic">
              “Os clientes que chegam pela Desapegrow já sabem o que
              procuram. A taxa de conversão é maior e o ticket médio também.”
            </p>
            <p className="mt-3 text-xs text-slate-400">
              — Espaço para depoimento de lojista parceiro
            </p>
          </div>
          <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/50 text-sm text-slate-200">
            <p className="italic">
              “As missões gamificadas fizeram nossa marca aparecer mais e
              ajudaram a girar um estoque que estava parado.”
            </p>
            <p className="mt-3 text-xs text-slate-400">
              — Espaço para depoimento de fabricante / marca
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO: FAQ RÁPIDO PARA OBJEÇÕES */}
      <section
        id="faq"
        className="px-4 py-12 md:py-16 max-w-5xl mx-auto border-t border-slate-800"
      >
        <header className="max-w-2xl mb-6">
          <h2 className="text-2xl font-semibold">
            Perguntas frequentes de lojistas.
          </h2>
        </header>

        <div className="space-y-5 text-sm text-slate-200">
          <div>
            <h3 className="font-semibold text-emerald-300">
              Preciso ter loja virtual para anunciar?
            </h3>
            <p className="mt-1">
              Não necessariamente. Você pode usar Deals para gerar leads para
              atendimento via WhatsApp, por exemplo, ou combinar uma estrutura
              de pedido simples com a equipe da Desapegrow.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-emerald-300">
              Como funciona o pagamento por venda/lead?
            </h3>
            <p className="mt-1">
              Definimos em conjunto a comissão, criamos links rastreáveis ou
              cupons exclusivos e consolidamos os resultados em relatórios
              mensais para faturamento transparente.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-emerald-300">
              Posso começar com teste pequeno?
            </h3>
            <p className="mt-1">
              Sim. Muitos parceiros começam com uma campanha piloto em poucos
              produtos para validar conversão e depois ampliam o investimento.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO: FORM / CONTATO FINAL */}
      <section
        id="form"
        className="px-4 py-12 md:py-16 max-w-3xl mx-auto border-t border-slate-800"
      >
        <header className="mb-6">
          <h2 className="text-2xl font-semibold">
            Comece a divulgar seus deals de cultivo.
          </h2>
          <p className="mt-3 text-slate-200">
            Preencha os dados abaixo para que o time da Desapegrow entre em
            contato com uma proposta alinhada ao tamanho da sua operação.
          </p>
        </header>

        {/* Aqui você pluga seu form real (React Hook Form, serviço externo, etc.) */}
        <form className="grid gap-4 md:grid-cols-2 text-sm">
          <div className="md:col-span-2">
            <label className="block mb-1 text-slate-200">
              Nome / Razão social
            </label>
            <input
              type="text"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-200">E-mail</label>
            <input
              type="email"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-200">
              WhatsApp / Telefone
            </label>
            <input
              type="tel"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-slate-200">
              Site / Instagram da loja ou marca
            </label>
            <input
              type="text"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-slate-200">
              O que você deseja?
            </label>
            <select className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Vender mais com modelo afiliado (CPS/CPA)</option>
              <option>Divulgar marca/produtos com banners e destaques</option>
              <option>Criar missões gamificadas patrocinadas</option>
              <option>Outro tipo de parceria</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-slate-200">
              Conte um pouco sobre sua operação
            </label>
            <textarea
              rows={4}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex.: tipo de produtos, ticket médio, principais canais de venda hoje..."
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition w-full md:w-auto"
            >
              Enviar e falar com especialista
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-slate-500">
          Ao enviar, você concorda em ser contactado pela equipe da Desapegrow
          por e-mail ou WhatsApp para apresentação de propostas comerciais.
        </p>
      </section>
    </main>
  );
}
