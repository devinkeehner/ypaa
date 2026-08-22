import config from "@payload-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { cache } from "react";

import { SiteFrame } from "@/components/site/SiteFrame";
import { lexicalToHTML } from "@/puck/native-rich-text";

import styles from "../blog.module.css";

type PageProps = { params: Promise<{ slug: string }> };

const getPost = cache(async (slug: string) => {
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: "posts", depth: 1, limit: 1, where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] } });
  return result.docs[0] || null;
});

function mediaValue(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const media = value as { alt?: unknown; url?: unknown };
  return typeof media.url === "string" ? { alt: typeof media.alt === "string" ? media.alt : "", url: media.url } : null;
}

function postDate(value: unknown) {
  if (typeof value !== "string") return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return { title: post.meta?.title || post.title, description: post.meta?.description || post.excerpt || undefined };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const image = mediaValue(post.heroImage);
  const html = lexicalToHTML(post.content);

  return <SiteFrame mainId="blog-main"><main className={styles.page} id="blog-main"><article><header className={styles.articleHeader}><span className={styles.eyebrow}>News &amp; updates</span><h1>{post.title}</h1>{post.publishedAt ? <time dateTime={post.publishedAt}>{postDate(post.publishedAt)}</time> : null}{post.excerpt ? <p>{post.excerpt}</p> : null}</header>{image ? <img alt={image.alt} className={styles.hero} src={image.url} /> : null}<div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} /></article></main></SiteFrame>;
}
