"use client";

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { useSearchParams,useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { links } from '@/utils/links';

function NavSearch() {

  const searchParams = useSearchParams();   //react hook
  const [search, setSearch] = useState(
    searchParams.get('search')?.toString() || ''
  );
  const {replace} = useRouter()   //when I search will take me to product page and replace  current
  console.log(search, 'search')

  const handleSearch = useDebouncedCallback((value: string) => {  //useDebouncedCallback is fuction to delay search 
    const params = new URLSearchParams(searchParams); //read from url query parametrd
  if(value){
      params.set('search', value); 
  }else{
    params.delete('search');
  }
replace(`${links.PRODUCTS.href}?${params.toString()}`); //when I search will take me to product page and replace  current
},700);


  return (
    <Input
      type='search'
      placeholder='search...'
      className='max-w  h-12  dark:bg-muted'
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}

    />
  )
}

export default NavSearch