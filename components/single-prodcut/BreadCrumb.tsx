import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { links } from '@/utils/links'

function BreadCrumb({name}:{name:string}) {
  return (
    <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href={links.PRODUCTS.href} className='capitalize text-lg'>Home</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbSeparator />

    <BreadcrumbItem>
      <BreadcrumbLink href={links.PRODUCTS.href} className='capitalize text-lg'>Products</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbSeparator />


    <BreadcrumbItem>
      <BreadcrumbPage className='capitalize text-lg'>{name}</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
  )
}

export default BreadCrumb