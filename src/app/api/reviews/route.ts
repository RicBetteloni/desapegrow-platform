// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

const createReviewSchema = z.object({
  productId: z.string(),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(100).optional(),
  content: z.string().min(20).max(2000),
  qualityRating: z.number().min(1).max(5).optional(),
  valueRating: z.number().min(1).max(5).optional(),
  shippingRating: z.number().min(1).max(5).optional(),
  images: z.array(z.string()).max(5).optional(),
});

// Funções mock que serão implementadas futuramente
async function awardAchievement(tx: Prisma.TransactionClient, userId: string, type: string, title: string, description: string, points: number) {
  console.log(`Awarding achievement: ${title} to user ${userId} with ${points} points.`);
}

async function checkAndAwardReviewBadges(tx: Prisma.TransactionClient, userId: string, categorySlug: string) {
  console.log(`Checking and awarding badges for user ${userId} in category ${categorySlug}.`);
}

async function updateProductReviewStats(tx: Prisma.TransactionClient, productId: string) {
  console.log(`Updating review stats for product ${productId}.`);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createReviewSchema.parse(body);

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: data.productId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          error: 'Você já avaliou este produto',
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: 'Produto não encontrado',
        },
        { status: 404 }
      );
    }

    let isVerifiedPurchase = false;
    if (data.orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: data.orderId,
          userId: session.user.id,
          status: 'DELIVERED',
          items: {
            some: {
              productId: data.productId,
            },
          },
        },
      });
      isVerifiedPurchase = !!order;
    }

    let pointsAwarded = 50;
    let expertisePoints = 10;

    if (isVerifiedPurchase) {
      pointsAwarded += 25;
      expertisePoints += 15;
    }
    if (data.content.length > 100) {
      pointsAwarded += 15;
      expertisePoints += 5;
    }
    if (data.title && data.title.length > 10) {
      pointsAwarded += 10;
    }
    if (data.images && data.images.length > 0) {
      pointsAwarded += 20;
      expertisePoints += 10;
    }
    if (data.qualityRating) pointsAwarded += 5;
    if (data.valueRating) pointsAwarded += 5;
    if (data.shippingRating) pointsAwarded += 5;

    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          userId: session.user.id,
          productId: data.productId,
          orderId: data.orderId,
          rating: data.rating,
          title: data.title,
          content: data.content,
          qualityRating: data.qualityRating,
          valueRating: data.valueRating,
          shippingRating: data.shippingRating,
          pointsAwarded,
          expertisePoints,
          isVerifiedPurchase,
          status: isVerifiedPurchase ? 'APPROVED' : 'PENDING',
        },
      });

      if (data.images && data.images.length > 0) {
        await tx.reviewMedia.createMany({
          data: data.images.map((url: string, index: number) => ({
            reviewId: review.id,
            type: 'IMAGE',
            url,
            order: index,
            approved: isVerifiedPurchase,
          })),
        });
      }

      await tx.gameProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          totalPoints: pointsAwarded,
          availablePoints: pointsAwarded
        },
        update: {
          totalPoints: { increment: pointsAwarded },
          availablePoints: { increment: pointsAwarded }
        },
      });

      await tx.pointTransaction.create({
        data: {
          userId: session.user.id,
          type: 'PRODUCT_REVIEW',
          amount: pointsAwarded,
          description: `Avaliação do produto: ${product.name}`,
          reference: review.id,
        },
      });

      const userReputation = await tx.userReputation.findUnique({
        where: { userId: session.user.id },
      });

      const newExpertiseScores = userReputation?.expertiseScores
        ? { ...(userReputation.expertiseScores as Record<string, number>), [product.category.slug]: ((userReputation.expertiseScores as Record<string, number>)[product.category.slug] || 0) + expertisePoints }
        : { [product.category.slug]: expertisePoints };

      await tx.userReputation.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          totalScore: pointsAwarded,
          totalReviews: 1,
          verifiedReviews: isVerifiedPurchase ? 1 : 0,
          expertiseScores: newExpertiseScores,
        },
        update: {
          totalScore: { increment: pointsAwarded },
          totalReviews: { increment: 1 },
          verifiedReviews: isVerifiedPurchase ? { increment: 1 } : undefined,
          expertiseScores: newExpertiseScores,
        },
      });

      await checkAndAwardReviewBadges(tx, session.user.id, product.category.slug);

      if (isVerifiedPurchase) {
        await updateProductReviewStats(tx, data.productId);
      }

      return { review, pointsAwarded };
    });

    return NextResponse.json({
      success: true,
      reviewId: result.review.id,
      pointsEarned: result.pointsAwarded,
      message: isVerifiedPurchase
        ? 'Avaliação publicada com sucesso!'
        : 'Avaliação enviada para moderação',
    });
  } catch (error: unknown) {
    console.error('Create review error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: error.issues,
      }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}