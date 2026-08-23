import React from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'

function Rating({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1 <= rating)
  return (
    <div className='flex items-center gap-x-1'>
      {
        stars.map((fullStar, index) => {
          return (
            fullStar ? (<FaStar key={index} />)
              : (<FaRegStar key={index} />)
            );
        })
      }

    </div>
  )
}

export default Rating

