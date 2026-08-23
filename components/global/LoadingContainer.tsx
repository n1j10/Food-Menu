import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export function LoadingContainer() {
  return (
    <div className='pt-12 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      <LoadingProduct/>
      <LoadingProduct/>
      <LoadingProduct/>

      </div>
  )
}

export function LoadingHero() {
  return (
    <div className='pt-12 grid gap-4 '>
      <LoadingProduct/>

      </div>
  )
}




export  function LoadingProduct() {

  return (
    <Card>
      <CardContent className='p-4'>
        <Skeleton className='h-48 w-full'/>
        <Skeleton className='h-4 w-3/4 mt-4'/>
        <Skeleton className='h-4 w-3/4 mt-4'/>
      </CardContent>
      
    </Card>
  )
}

