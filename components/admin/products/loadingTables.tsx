import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export function loadingTables({rows = 4}) {
    const fiveRows = Array.from({ length: rows }, ((_, index) => {
    return (
        <div className='mt-4' key={index}>
            <Skeleton className='w-[60vw] h-8 rounded' />
        </div>
    )
    }))

    return (
        <>
        {fiveRows}
        </>
        
    )


}

export default loadingTables