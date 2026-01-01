export default function TermosDeUsoPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
          <p className="text-sm text-gray-600 mb-8">Última atualização: Janeiro de 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Ao acessar e usar a plataforma Desapegrow, você concorda com estes Termos de Uso. 
                Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-700 mb-4">
                A Desapegrow é um marketplace (plataforma intermediadora) que conecta vendedores e compradores 
                de equipamentos para cultivo indoor. Não somos fabricantes, vendedores diretos ou responsáveis 
                pelos produtos anunciados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Responsabilidade Legal</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ IMPORTANTE:</strong> É responsabilidade exclusiva do usuário garantir que o uso dos 
                  equipamentos adquiridos esteja em conformidade com a legislação brasileira vigente, especialmente 
                  a Lei 11.343/2006 (Lei de Drogas).
                </p>
              </div>
              <p className="text-gray-700 mb-4">
                O cultivo de plantas controladas sem autorização legal é crime no Brasil. A Desapegrow não 
                incentiva, promove ou facilita atividades ilegais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Cadastro e Conta</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Você deve ter 18 anos ou mais para usar a plataforma</li>
                <li>Você é responsável por manter a confidencialidade de sua conta</li>
                <li>Não compartilhe suas credenciais de acesso</li>
                <li>Notifique-nos imediatamente sobre qualquer uso não autorizado</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Proibições</h2>
              <p className="text-gray-700 mb-4">É expressamente proibido:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Anunciar produtos ilegais ou substâncias controladas</li>
                <li>Usar a plataforma para fins fraudulentos</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Fazer spam ou enviar mensagens não solicitadas</li>
                <li>Tentar acessar sistemas de forma não autorizada</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Transações</h2>
              <p className="text-gray-700 mb-4">
                A Desapegrow facilita a conexão entre compradores e vendedores, mas não é parte das transações. 
                Vendedores e compradores são responsáveis por cumprir suas obrigações contratuais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Propriedade Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Todo o conteúdo da plataforma (textos, imagens, logos, código) é protegido por direitos autorais 
                e pertence à Desapegrow ou seus licenciadores.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. Modificações</h2>
              <p className="text-gray-700 mb-4">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas 
                serão notificadas aos usuários.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">9. Contato</h2>
              <p className="text-gray-700">
                Para dúvidas sobre estes termos: <a href="mailto:juridico@desapegrow.com" className="text-green-600 hover:underline">juridico@desapegrow.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
