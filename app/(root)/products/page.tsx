import ProductsContainer from '@/components/prodcuts/ProductsContainer'
import React from 'react'


interface ProductsPageProps {
    searchParams: {
        layout?: string
        search?: string
        category?: string
    }
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
    const { layout = 'grid', search, category } = await searchParams || {};
    return (
        <ProductsContainer layout={layout} search={search} categoryId={category} />
    )
}

export default ProductsPage










//   const {layout} = await searchParams|| 'grid';