import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | NECYPAA XXXVI",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="0;url=/" />
      </head>
      <body>
        <p>
          This page could not be found. <a href="/">Return to the home page</a>.
        </p>
      </body>
    </html>
  );
}
