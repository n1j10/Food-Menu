import React from 'react'
import { FaStar } from 'react-icons/fa';

function ProductRating({ productId }: { productId: string }) {

  const rating = 4.2;
  const reviews = 42;
  const reviewsText = `(${reviews}) Reviews`;

  const className = `flex gap-1 items-center text-md mt-1 mb-4`;
  return (
    <span className={className}>
          <FaStar className='w-3 h-3' />
      {rating} {reviewsText} 
      
      
      </span>
  )
}

export default ProductRating