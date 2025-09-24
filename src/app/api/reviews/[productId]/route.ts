// src/app/api/reviews/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        status: 'APPROVED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: {
              include: {
                badges: {
                  include: {
                    badge: true,
                  },
                },
              },
            },
          },
        },
        images: {
          where: { approved: true },
          orderBy: { order: 'asc' },
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const reviewsCount = await prisma.review.aggregate({
      where: {
        productId,
        status: 'APPROVED',
      },
      _count: {
        rating: true,
      },
      _avg: {
        rating: true,
      },
    });

    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        productId,
        status: 'APPROVED',
      },
      _count: {
        _all: true,
      },
    });

    const formattedRatingDistribution = {
      5: ratingDistribution.find((r) => r.rating === 5)?._count._all || 0,
      4: ratingDistribution.find((r) => r.rating === 4)?._count._all || 0,
      3: ratingDistribution.find((r) => r.rating === 3)?._count._all || 0,
      2: ratingDistribution.find((r) => r.rating === 2)?._count._all || 0,
      1: ratingDistribution.find((r) => r.rating === 1)?._count._all || 0,
    };

    return NextResponse.json({
      reviews,
      totalReviews: reviewsCount._count.rating,
      averageRating: reviewsCount._avg.rating || 0,
      ratingDistribution: formattedRatingDistribution,
    });
  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}