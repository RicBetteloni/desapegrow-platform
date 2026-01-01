export default function PoliticaPrivacidadePage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
          <p className="text-sm text-gray-600 mb-8">Última atualização: Janeiro de 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Introdução</h2>
              <p className="text-gray-700 mb-4">
                A Desapegrow está comprometida com a proteção de seus dados pessoais. Esta política explica 
                como coletamos, usamos e protegemos suas informações, em conformidade com a Lei Geral de 
                Proteção de Dados (LGPD - Lei 13.709/2018).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Dados Coletados</h2>
              <h3 className="text-lg font-semibold mb-2">2.1 Dados fornecidos por você:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Nome completo</li>
                <li>E-mail</li>
                <li>Telefone</li>
                <li>Endereço de entrega</li>
                <li>CPF/CNPJ (para vendedores)</li>
                <li>Informações de pagamento</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">2.2 Dados coletados automaticamente:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Endereço IP</li>
                <li>Dados de navegação (cookies)</li>
                <li>Dispositivo e navegador utilizados</li>
                <li>Páginas visitadas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Como Usamos Seus Dados</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Processar compras e vendas</li>
                <li>Enviar notificações sobre pedidos</li>
                <li>Melhorar a experiência na plataforma</li>
                <li>Prevenir fraudes e garantir segurança</li>
                <li>Cumprir obrigações legais</li>
                <li>Enviar comunicações de marketing (com seu consentimento)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Compartilhamento de Dados</h2>
              <p className="text-gray-700 mb-4">
                Seus dados podem ser compartilhados com:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Vendedores/Compradores:</strong> Informações necessárias para completar transações</li>
                <li><strong>Processadores de pagamento:</strong> Mercado Pago, Stripe, etc.</li>
                <li><strong>Serviços de entrega:</strong> Correios, transportadoras</li>
                <li><strong>Autoridades:</strong> Quando exigido por lei</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Seus Direitos (LGPD)</h2>
              <p className="text-gray-700 mb-4">Você tem direito a:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados</li>
                <li>Corrigir dados incompletos ou incorretos</li>
                <li>Solicitar anonimização ou exclusão</li>
                <li>Revogar consentimento</li>
                <li>Portabilidade de dados</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Para exercer seus direitos, envie e-mail para: <a href="mailto:privacidade@desapegrow.com" className="text-green-600 hover:underline">privacidade@desapegrow.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies para melhorar sua experiência. Você pode gerenciar preferências de cookies 
                nas configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Segurança</h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia 
                SSL, firewalls e controle de acesso restrito.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. Retenção de Dados</h2>
              <p className="text-gray-700 mb-4">
                Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas, ou 
                conforme exigido por lei (ex: nota fiscal por 5 anos).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">9. Menores de Idade</h2>
              <p className="text-gray-700 mb-4">
                Nossos serviços são destinados a maiores de 18 anos. Não coletamos intencionalmente dados de menores.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">10. Contato - Encarregado de Dados (DPO)</h2>
              <p className="text-gray-700">
                E-mail: <a href="mailto:dpo@desapegrow.com" className="text-green-600 hover:underline">dpo@desapegrow.com</a><br />
                Telefone: (11) 0000-0000
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
