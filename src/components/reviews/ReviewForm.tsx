// src/components/reviews/ReviewForm.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  Upload, 
  X, 
  Zap, 
  Award,
  CheckCircle,
  Camera,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(100),
  content: z.string().min(20, 'Avaliação deve ter pelo menos 20 caracteres').max(2000),
  
  // Detailed ratings
  qualityRating: z.number().min(1).max(5).optional(),
  valueRating: z.number().min(1).max(5).optional(),
  shippingRating: z.number().min(1).max(5).optional(),
  
  // Media
  images: z.array(z.string()).max(5, 'Máximo 5 imagens').optional()
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  productId: string
  productName: string
  orderId?: string
  isVerifiedPurchase?: boolean
  onSubmitSuccess?: () => void
  className?: string
}

export function ReviewForm({
  productId,
  productName,
  orderId,
  isVerifiedPurchase = false,
  onSubmitSuccess,
  className
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [pointsPreview, setPointsPreview] = useState(0)

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      content: '',
      images: []
    }
  })

  const watchedValues = form.watch()

  // Calculate points preview based on review quality
  const calculatePointsPreview = () => {
    let points = 50 // Base points for review

    if (isVerifiedPurchase) points += 25
    if (watchedValues.content.length > 100) points += 15
    if (watchedValues.title && watchedValues.title.length > 10) points += 10
    if (uploadedImages.length > 0) points += 20
    if (watchedValues.qualityRating) points += 5
    if (watchedValues.valueRating) points += 5
    if (watchedValues.shippingRating) points += 5

    return points
  }

  // Update points preview when form changes
  React.useEffect(() => {
    setPointsPreview(calculatePointsPreview())
  }, [watchedValues, uploadedImages.length, isVerifiedPurchase])

  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return
    if (uploadedImages.length + files.length > 5) {
      toast.error('Máximo 5 imagens permitidas')
      return
    }

    setUploadingImages(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'review')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) throw new Error('Upload failed')

        const result = await response.json()
        return result.url
      })

      const newImages = await Promise.all(uploadPromises)
      const updatedImages = [...uploadedImages, ...newImages]
      setUploadedImages(updatedImages)
      form.setValue('images', updatedImages)

      toast.success(`${newImages.length} imagem(ns) adicionada(s)!`)
    } catch (error) {
      toast.error('Erro ao fazer upload das imagens')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove)
    setUploadedImages(updatedImages)
    form.setValue('images', updatedImages)
  }

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          productId,
          orderId,
          images: uploadedImages
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar avaliação')
      }

      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <div>
            <p className="font-semibold">Avaliação enviada!</p>
            <p className="text-sm">Você ganhou {result.pointsEarned} CultivoCoins</p>
          </div>
        </div>
      )

      onSubmitSuccess?.()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao enviar avaliação'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (rating: number) => void; 
    label: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(star)}
            className={`p-1 rounded transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </motion.button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value > 0 ? `${value} estrela${value !== 1 ? 's' : ''}` : 'Clique para avaliar'}
        </span>
      </div>
    </div>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5" />
          <span>Avaliar Produto</span>
          {isVerifiedPurchase && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Compra Verificada
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Compartilhe sua experiência com <strong>{productName}</strong>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Points Preview */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Você vai ganhar
              </span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {pointsPreview} CultivoCoins
            </Badge>
          </div>
          <div className="mt-2 text-xs text-green-600 space-y-1">
            <div>• Avaliação base: 50 pontos</div>
            {isVerifiedPurchase && <div>• Compra verificada: +25 pontos</div>}
            {watchedValues.content.length > 100 && <div>• Avaliação detalhada: +15 pontos</div>}
            {uploadedImages.length > 0 && <div>• Com fotos: +20 pontos</div>}
          </div>
        </motion.div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Overall Rating */}
          <StarRating
            value={form.watch('rating')}
            onChange={(rating) => form.setValue('rating', rating)}
            label="Avaliação Geral *"
          />

          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StarRating
              value={form.watch('qualityRating') || 0}
              onChange={(rating) => form.setValue('qualityRating', rating)}
              label="Qualidade"
            />
            <StarRating
              value={form.watch('valueRating') || 0}
              onChange={(rating) => form.setValue('valueRating', rating)}
              label="Custo-Benefício"
            />
            <StarRating
              value={form.watch('shippingRating') || 0}
              onChange={(rating) => form.setValue('shippingRating', rating)}
              label="Entrega"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título da Avaliação *</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Resumo da sua experiência..."
              maxLength={100}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{form.formState.errors.title?.message}</span>
              <span>{form.watch('title')?.length || 0}/100</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Sua Avaliação *</Label>
            <Textarea
              id="content"
              {...form.register('content')}
              placeholder="Conte como foi sua experiência com este produto..."
              rows={4}
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{form.formState.errors.content?.message}</span>
              <span>{form.watch('content')?.length || 0}/2000</span>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label>Fotos do Produto (opcional)</Label>
            
            {/* Upload Button */}
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                disabled={uploadingImages || uploadedImages.length >= 5}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {uploadingImages ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                {uploadingImages ? 'Enviando...' : 'Adicionar Fotos'}
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {uploadedImages.length}/5 imagens
              </span>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              />
            </div>

            {/* Image Preview */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                <AnimatePresence>
                  {uploadedImages.map((imageUrl, index) => (
                    <motion.div
                      key={imageUrl}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-square rounded-lg overflow-hidden border"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || form.watch('rating') === 0}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando Avaliação...
              </>
            ) : (
              <>
                <Award className="mr-2 h-4 w-4" />
                Enviar e Ganhar {pointsPreview} Pontos
              </>
            )}
          </Button>

          {/* Requirements */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Avaliações passam por moderação antes de serem publicadas</p>
            <p>• Seja honesto e construtivo em sua avaliação</p>
            <p>• Fotos de qualidade aumentam seus pontos</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}