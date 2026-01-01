'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AgeVerification() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Verificar se já foi aceito
    const ageVerified = localStorage.getItem('ageVerified')
    if (!ageVerified) {
      setShowModal(true)
    }
  }, [])

  const handleConfirm = () => {
    localStorage.setItem('ageVerified', 'true')
    setShowModal(false)
  }

  const handleDeny = () => {
    // Redirecionar para site de informações sobre cultivo responsável
    window.location.href = 'https://www.gov.br/anvisa/'
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-2xl border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-4 rounded-full">
              <span className="text-5xl">⚠️</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verificação de Idade</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-gray-800 leading-relaxed">
              <strong>Aviso Importante:</strong> Este site comercializa equipamentos para cultivo indoor. 
              O uso destes produtos deve estar em conformidade com a legislação brasileira vigente.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-center text-gray-700 font-medium text-lg">
              Você confirma que possui <strong>18 anos ou mais</strong>?
            </p>
            
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              O cultivo de plantas controladas sem autorização legal é crime no Brasil (Lei 11.343/2006). 
              Esta plataforma não incentiva ou facilita atividades ilegais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold h-12 text-base"
            >
              ✓ Sim, tenho 18+ anos
            </Button>
            <Button
              onClick={handleDeny}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold h-12 text-base"
            >
              ✗ Não tenho 18 anos
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Ao continuar, você declara ter lido e concordado com nossos{' '}
            <a href="/termos-de-uso" className="text-blue-600 hover:underline">Termos de Uso</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
