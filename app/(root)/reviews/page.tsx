import Link from 'next/link';
import ReviewCard from '@/components/reviews/ReviewCard';
import SectionTitle from '@/components/global/SectionTitle';
import { fetchAllReviews } from '@/utils/actions';

const ReviewsPage = async () => {
    const reviews = await fetchAllReviews();

    return (
        <section className='py-12 px-4 sm:px-8'>
            <SectionTitle text='all reviews' />

            {reviews.length === 0 ? (
                <p className='py-12 text-center text-muted-foreground'>
                    No customer reviews yet.
                </p>
            ) : (
                <div className='grid gap-6 py-8 md:grid-cols-2 xl:grid-cols-3'>
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            reviewInfo={{
                                name: review.authorName,
                                image: review.authorImageUrl,
                                rating: review.rating,
                                comment: review.comment,
                            }}
                        >
                            <div className='px-6 pb-6 text-sm text-muted-foreground'>
                                Review for{' '}
                                <Link
                                    href={`/products/${review.product.id}`}
                                    className='font-medium text-primary underline-offset-4 hover:underline'
                                >
                                    {review.product.name}
                                </Link>
                            </div>
                        </ReviewCard>
                    ))}
                </div>
            )}
        </section>
    )
}

export default ReviewsPage
