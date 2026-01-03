import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
              🌱 Desapegrow
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              O primeiro <strong>marketplace de cultivo gamificado</strong> do Brasil
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Compre equipamentos, ganhe pontos, suba de nível e cultive sua paixão! 🎮
            </p>
          </div>

          {/* Gamification Preview */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Card className="w-full max-w-sm">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">🪙</span>
                  <span>CultivoCoins</span>
                </CardTitle>
                <CardDescription>Sistema de pontos gamificado</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <Badge className="bg-green-100 text-green-800">Iniciante</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/auth/signup">
                🚀 Começar Jornada
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/marketplace">
                🛒 Ver Produtos
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-all">
            <CardHeader>
              <div className="text-4xl mb-4">🎮</div>
              <CardTitle>Sistema Gamificado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ganhe pontos, badges e suba de nível a cada compra!
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all">
            <CardHeader>
              <div className="text-4xl mb-4">🌿</div>
              <CardTitle>Equipamentos de Cultivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tudo que você precisa para seu jardim e horta
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all">
            <CardHeader>
              <div className="text-4xl mb-4">🏆</div>
              <CardTitle>Ranking & Desafios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Compita com outros cultivadores e ganhe recompensas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Levels Preview */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Sistema de Níveis</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🌱</div>
                <h3 className="font-bold">Iniciante</h3>
                <p className="text-sm text-gray-600">0-999 pontos</p>
                <Badge className="mt-2 bg-green-100 text-green-800">2% desconto</Badge>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🌿</div>
                <h3 className="font-bold">Jardineiro</h3>
                <p className="text-sm text-gray-600">1000-2499 pontos</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">5% desconto</Badge>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🌳</div>
                <h3 className="font-bold">Especialista</h3>
                <p className="text-sm text-gray-600">2500-4999 pontos</p>
                <Badge className="mt-2 bg-purple-100 text-purple-800">8% desconto</Badge>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-bold">Mestre</h3>
                <p className="text-sm text-gray-600">5000+ pontos</p>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">12% desconto</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
