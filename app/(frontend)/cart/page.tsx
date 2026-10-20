import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { getMerchandiseCatalog } from "@/lib/merchandise-catalog";

import { CartPage } from "@/components/site/CartPage";

export const metadata: Metadata = {
  title: "Cart | NECYPAA XXXVI",
  description: "Review merchandise and continue to the NECYPAA registration checkout.",
};

export const dynamic = "force-dynamic";

export default async function Cart() {
  if (!(await getMerchandiseCatalog()).enabled) notFound();
  return <CartPage />;
}
