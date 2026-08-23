import SectionTitle from '../global/SectionTitle'
import ReviewCard from './ReviewCard';
import { fetchProductReview } from '@/utils/actions';

 async function ProductReviews({productId}: {productId: string}) {

    const reviews = await fetchProductReview(productId);

  return (
       <div className='mt-16'>
      <SectionTitle text='product reviews' />
      <div className='grid md:grid-cols-2 gap-8 my-8'>
        {reviews.map((review) => {
          const { comment, rating, authorImageUrl, authorName } = review;


          const reviewInfo = {
            comment:comment,
            rating:rating,
            image: authorImageUrl,
            name: authorName,
          };

          return <ReviewCard key={review.id} reviewInfo={reviewInfo} />;
        })}
      </div>
    </div>
  )
}

export default ProductReviews