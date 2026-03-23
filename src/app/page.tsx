'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Home() {
  const [currentCTA, setCurrentCTA] = useState(0)

  // Alterna automaticamente entre os CTAs a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCTA((prev) => (prev === 0 ? 1 : 0))
    }, 5000)
    return () => clearInterval(interval)
  }, [currentCTA]) // Reinicia o timer quando currentCTA muda

  // Função para navegar manualmente (reinicia o timer automaticamente via useEffect)
  const handleCTAChange = (index: number) => {
    setCurrentCTA(index)
  }

  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-white relative overflow-hidden">
        {/* Background decorativo com folhas */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <Image
            src="https://res.cloudinary.com/dasx39hlf/image/upload/v1767583834/desapegrow/home/hero-main.png"
            alt=""
            fill
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[60%_40%] gap-12 items-center relative z-10">
          
          {/* LEFT */}
          <div className="space-y-6 relative">
            
            {/* Logo como marca d'água */}
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.12] pointer-events-none z-0 w-[100%] h-[100%]">
              <Image
                src="/logo/logo.svg"
                alt=""
                fill
                className="text-[#2F5F39] scale-[1.25]"
                style={{ filter: 'brightness(1.2) sepia(20%) saturate(150%) hue-rotate(70deg)', objectFit: 'contain' }}
              />
            </div>

            {/* Tagline */}
            <p className="text-[#6E6E6E] text-base font-medium tracking-wide relative z-10">
              De Jardineiro para Jardineiro
            </p>

            {/* Headline */}
            <h1 className="text-[40px] leading-tight font-bold text-[#1F1F1F] relative z-10">
              A maior comunidade<br />
              <span className="text-[#2F5F39]">
                para cultivadores indoor
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-[#6E6E6E] text-lg max-w-md leading-relaxed relative z-10">
              Encontre, negocie e desapegue<br />
              de equipamentos de cultivo
            </p>

            {/* CTA */}
            <div className="relative z-10">
              <Link href="/marketplace">
                <button className="bg-[#2F5F39] hover:bg-[#3A7347] text-white font-semibold px-6 h-11 rounded-xl shadow-sm transition-all hover:shadow-md">
                  Anunciar agora
                </button>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-4 relative z-10">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <span className="text-green-700 text-sm">✔</span>
                <span className="text-sm text-gray-700">Equipamentos seminovos</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <span className="text-green-700 text-sm">✔</span>
                <span className="text-sm text-gray-700">Anunciantes verificados</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <span className="text-green-700 text-sm">✔</span>
                <span className="text-sm text-gray-700">Segurança e suporte</span>
              </div>

              <Link
                href="/marketplace"
                className="flex items-center gap-2 bg-white border border-[#E5A12A] rounded-full px-4 py-2 shadow-sm hover:bg-[#FFF9F0] transition"
              >
                <span className="text-sm font-medium text-[#E5A12A]">
                  Ver todas
                </span>
                <span className="text-[#E5A12A]">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT — tent / grow image */}
          <div className="relative w-full md:w-auto mt-8 md:mt-0">
            <div className="relative w-full h-[280px] md:h-[520px] rounded-[24px] overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,.15)]">
              <Image
                src="https://res.cloudinary.com/dasx39hlf/image/upload/v1768727003/desapegrow/home/hero-grow-logo.png"
                alt="Grow indoor"
                fill
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="w-full bg-[#FAF9F6]">
        <div className="max-w-[1280px] mx-auto px-6 py-14 space-y-6">

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl">⭐</span>
              <h2 className="text-[20px] sm:text-[24px] md:text-[26px] font-semibold text-[#1F1F1F]">
                Produtos em Destaque
              </h2>
              <span className="bg-[#E5A12A] text-white text-xs font-bold px-2 py-1 rounded-full">
                PREMIUM
              </span>
            </div>

            <Link
              href="/marketplace"
              className="text-[#2F5F39] font-semibold hover:text-[#3A7347] whitespace-nowrap text-sm sm:text-base"
            >
              Ver todos →
            </Link>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {/* PRODUCT CARD - Climatização */}
            <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_12px_28px_rgba(0,0,0,.05)] overflow-hidden hover:shadow-[0_16px_36px_rgba(0,0,0,.08)] transition relative">
              
              {/* Badge Premium */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-[#E5A12A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ DESTAQUE
                </span>
              </div>

              <div className="relative h-[190px] bg-gray-100">
                <Image
                  src="https://res.cloudinary.com/dasx39hlf/image/upload/v1767583838/desapegrow/home/hero-feature-1.png"
                  alt="Climatização"
                  fill
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <span className="text-sm text-green-700">● Seminovo</span>

                <h3 className="font-semibold text-[#1F1F1F]">
                  Climatização
                </h3>

                <div className="text-2xl font-bold text-[#2F5F39]">
                  R$ 399
                </div>

                <Link href="/marketplace">
                  <button className="w-full mt-2 bg-[#2F5F39] hover:bg-[#3A7347] text-white rounded-xl h-10 font-semibold">
                    Ver mais
                  </button>
                </Link>
              </div>
            </div>

            {/* PRODUCT CARD - Balança */}
            <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_12px_28px_rgba(0,0,0,.05)] overflow-hidden hover:shadow-[0_16px_36px_rgba(0,0,0,.08)] transition relative">
              
              {/* Badge Premium */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-[#E5A12A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ DESTAQUE
                </span>
              </div>

              <div className="relative h-[190px] bg-gray-100">
                <Image
                  src="https://res.cloudinary.com/dasx39hlf/image/upload/v1767583840/desapegrow/home/hero-feature-2.png"
                  alt="Kit Grow"
                  fill
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <span className="text-sm text-green-700">● Seminovo</span>

                <h3 className="font-semibold text-[#1F1F1F]">
                  Balança Digital de Precisão
                </h3>

                <div className="text-2xl font-bold text-[#2F5F39]">
                  R$ 120
                </div>

                <Link href="/marketplace">
                  <button className="w-full mt-2 bg-[#2F5F39] hover:bg-[#3A7347] text-white rounded-xl h-10 font-semibold">
                    Ver mais
                  </button>
                </Link>
              </div>
            </div>

            {/* PRODUCT CARD - Controle Estufa */}
            <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_12px_28px_rgba(0,0,0,.05)] overflow-hidden hover:shadow-[0_16px_36px_rgba(0,0,0,.08)] transition relative">
              
              {/* Badge Premium */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-[#E5A12A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ DESTAQUE
                </span>
              </div>

              <div className="relative h-[190px] bg-gray-100">
                <Image
                  src="https://res.cloudinary.com/dasx39hlf/image/upload/v1767583841/desapegrow/home/hero-feature-3.png"
                  alt="Tenda Grow"
                  fill
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <span className="text-sm text-green-700">● Seminovo</span>

                <h3 className="font-semibold text-[#1F1F1F]">
                  Controle Estufa Smart
                </h3>

                <div className="text-2xl font-bold text-[#2F5F39]">
                  R$ 259
                </div>

                <Link href="/marketplace">
                  <button className="w-full mt-2 bg-[#2F5F39] hover:bg-[#3A7347] text-white rounded-xl h-10 font-semibold">
                    Ver mais
                  </button>
                </Link>
              </div>
            </div>

            {/* REVIEW CARD */}
            <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_12px_28px_rgba(0,0,0,.05)] p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4.9</span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  &quot;Muito bom! Consegui os equipamentos que precisava com um preço ótimo.
                  Recomendo sempre anunciar e desapegar pelo Desapegrow.&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  👤
                </div>
                <div>
                  <p className="font-semibold text-[#1F1F1F]">João Silva</p>
                  <p className="text-xs text-gray-500">Jardineiro Indoor</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Banner Ads */}
      <section className="w-full bg-[#FAF9F6]">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl border-2 border-dashed border-gray-300 h-[120px] flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-sm font-medium">📢 Espaço Publicitário</p>
              <p className="text-xs mt-1">728x90 • Entre em contato para anunciar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Carrossel de CTAs */}
      <section className="w-full bg-[#FAF9F6]">
        <div className="max-w-[1280px] mx-auto px-6 pb-16">
          <div className="relative">
            
            {/* Botão Anterior */}
            <button
              onClick={() => handleCTAChange(currentCTA === 0 ? 1 : 0)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all -ml-6"
              aria-label="CTA anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Botão Próximo */}
            <button
              onClick={() => handleCTAChange(currentCTA === 0 ? 1 : 0)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all -mr-6"
              aria-label="Próximo CTA"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* CTA #1 — Anuncie agora (vendedores) */}
            <div 
              className={`transition-opacity duration-500 ${currentCTA === 0 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
            >
              <div className="bg-gradient-to-r from-[#2F5F39] to-[#3A7347] rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(47,95,57,0.2)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  <div className="flex-1 space-y-3 text-white text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="text-3xl">🎯</span>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        Anuncie agora e venda rápido!
                      </h2>
                    </div>
                    <p className="text-lg text-white/90 max-w-xl">
                      Tenha acesso a milhares de compradores. Cadastre-se como vendedor e transforme seus equipamentos parados em dinheiro hoje mesmo.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/auth/signup?vendor=true">
                      <button className="bg-[#E5A12A] hover:bg-[#F5B13A] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition whitespace-nowrap">
                        Criar conta grátis
                      </button>
                    </Link>
                    <Link href="/vendedor">
                      <button className="bg-white/10 hover:bg-white/20 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg transition whitespace-nowrap">
                        Saiba mais
                      </button>
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            {/* CTA #2 — Compre com desconto (compradores) */}
            <div 
              className={`transition-opacity duration-500 ${currentCTA === 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
            >
              <div className="bg-gradient-to-r from-[#E5A12A] to-[#F5B13A] rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(229,161,42,0.2)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  <div className="flex-1 space-y-3 text-white text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="text-3xl">🌱</span>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        Compre com até 40% de desconto!
                      </h2>
                    </div>
                    <p className="text-lg text-white/90 max-w-xl">
                      Equipamentos seminovos e novos com preços incríveis. Cadastre-se grátis e comece a economizar agora mesmo no maior marketplace de grow do Brasil.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/marketplace">
                      <button className="bg-white hover:bg-gray-50 text-[#E5A12A] px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition whitespace-nowrap">
                        Ver marketplace
                      </button>
                    </Link>
                    <Link href="/auth/signup">
                      <button className="bg-white/10 hover:bg-white/20 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg transition whitespace-nowrap">
                        Cadastrar grátis
                      </button>
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            {/* Indicadores de navegação */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => handleCTAChange(0)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentCTA === 0 ? 'bg-[#2F5F39] w-8' : 'bg-gray-300'
                }`}
                aria-label="Ver CTA vendedores"
              />
              <button
                onClick={() => handleCTAChange(1)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentCTA === 1 ? 'bg-[#E5A12A] w-8' : 'bg-gray-300'
                }`}
                aria-label="Ver CTA compradores"
              />
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
