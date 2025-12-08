import { Card, CardContent } from '@/components/ui/card'

export function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-green-700">
            <span className="animate-bounce">🌱</span>
            <span>Desapegrow</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </CardContent>
      </Card>
    </div>
  )
}
