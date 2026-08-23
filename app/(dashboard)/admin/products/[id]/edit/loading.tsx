'use client';

import LoadingTables from "@/components/admin/products/loadingTables";

function loading() {
  return (
    <LoadingTables rows={5} />
  )
}

export default loading