import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Cart | NECYPAA XXXVI",
  description: "Review your NECYPAA XXXVI merchandise selections.",
};

export default function Cart() {
  notFound();
}
