import type { Metadata } from "next";

import { CartPage } from "@/components/site/CartPage";

export const metadata: Metadata = {
  title: "Cart | NECYPAA XXXVI",
  description: "Review your NECYPAA XXXVI merchandise selections.",
};

export default function Cart() {
  return <CartPage />;
}
