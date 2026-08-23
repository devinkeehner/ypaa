import type { Metadata } from "next";

import { CartPage } from "@/components/site/CartPage";

export const metadata: Metadata = {
  title: "Cart | NECYPAA XXXVI",
  description: "Review merchandise and continue to the NECYPAA registration checkout.",
};

export default function Cart() {
  return <CartPage />;
}
