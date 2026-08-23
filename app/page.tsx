import { LoadingContainer } from "@/components/global/LoadingContainer";
import FeaturedProducts from "@/components/home/HeroProducts";
import Hero from "@/components/home/Hero";
import { Button } from "@base-ui/react";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<LoadingContainer />}>
        <FeaturedProducts />
      </Suspense>


    </>

  );
}
