import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
    return new Response(
        `
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset
          xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="https://www.w3.org/1999/xhtml"
          xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
          xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
          xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
          xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
        >
        <url>
        <loc>https://augstools.com/</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>1.00</priority>
    </url>
    <url>
        <loc>https://augstools.com/donate</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.80</priority>
    </url>
    <url>
        <loc>https://augstools.com/homebrew</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.80</priority>
    </url>
    <url>
        <loc>https://augstools.com/create</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.80</priority>
    </url>
    <url>
        <loc>https://augstools.com/assistant</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.80</priority>
    </url>
    <url>
        <loc>https://augstools.com/resources</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.80</priority>
    </url>
    <url>
        <loc>https://augstools.com/about</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.80</priority>
    </url>
    <url>
        <loc>https://augstools.com/homebrew/heroes</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.64</priority>
    </url>
    <url>
        <loc>https://augstools.com/homebrew/skillcards</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.64</priority>
    </url>
    <url>
        <loc>https://augstools.com/homebrew/heroes/create</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.64</priority>
    </url>
    <url>
        <loc>https://augstools.com/homebrew/skillcards/create</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.64</priority>
    </url>
    <url>
        <loc>https://augstools.com/privacy</loc>
        <lastmod>2023-02-19T19:45:13+00:00</lastmod>
        <priority>0.64</priority>
    </url>
        </urlset>`.trim(),
        {
          headers: {
            'Content-Type': 'application/xml'
          }
        }
      );
};