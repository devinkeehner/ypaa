import config from "@payload-config";
import Link from "next/link";
import { getPayload } from "payload";

import { SiteFrame } from "@/components/site/SiteFrame";

import styles from "./blog.module.css";

export const dynamic = "force-dynamic";

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

export default async function BlogIndex() {
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: "posts", depth: 1, limit: 50, sort: "-publishedAt", where: { _status: { equals: "published" } } });

  return <SiteFrame mainId="blog-main"><main className={styles.page} id="blog-main"><div className={styles.shell}><header className={styles.header}><span className={styles.eyebrow}>News &amp; updates</span><h1>From NECYPAA</h1><p>Convention news, service updates, and stories from the fellowship.</p></header>{result.docs.length ? <div className={styles.grid}>{result.docs.map((post) => { const image = mediaValue(post.heroImage); return <Link className={styles.card} href={`/blog/${post.slug}`} key={post.id}>{image ? <img alt={image.alt} src={image.url} /> : null}<div>{post.publishedAt ? <time dateTime={post.publishedAt}>{postDate(post.publishedAt)}</time> : null}<h2>{post.title}</h2>{post.excerpt ? <p>{post.excerpt}</p> : null}</div></Link>; })}</div> : <p className={styles.empty}>No posts have been published yet.</p>}</div></main></SiteFrame>;
}
