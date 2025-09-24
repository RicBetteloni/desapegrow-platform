'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Star, Send, Coins } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Review {
  id: string
  productId: string
  rating: number
  title: string
  content: string
  createdAt?: string
  // Add other fields as needed
}

interface ReviewFormProps {
  productId: string
  productName: string
  onReviewSubmitted?: (review: Review) => void
}

export function ReviewForm({ productId, productName, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            Faça login para avaliar este produto
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rating) {
      setMessage('❌ Selecione uma avaliação com estrelas')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          title,
          content
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`🎉 Review enviado! Você ganhou ${data.pointsEarned} CultivoCoins!`)
        setRating(0)
        setTitle('')
        setContent('')
        onReviewSubmitted?.(data.review)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Erro ao enviar review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>Avaliar Produto</span>
          <div className="flex items-center space-x-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
            <Coins className="h-4 w-4" />
            <span>+50 pontos</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {message && (
          <div className={`p-3 rounded mb-4 ${
            message.includes('🎉') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Avaliação *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 && (
                  <>
                    {rating} de 5 estrelas
                    {rating === 5 && ' - Excelente!'}
                    {rating === 4 && ' - Muito bom!'}
                    {rating === 3 && ' - Bom'}
                    {rating === 2 && ' - Regular'}
                    {rating === 1 && ' - Ruim'}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Título da avaliação
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resuma sua experiência..."
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sua avaliação *
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Conte sobre sua experiência com este produto..."
              rows={4}
              maxLength={500}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.length}/500 caracteres
            </p>
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            disabled={loading || !rating || !content.trim()}
            className="w-full"
          >
            {loading ? (
              'Enviando...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Avaliação e Ganhar Pontos
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}