import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const targetUrl = req.query.url;
  const isDisabled = req.query.isDisabled || "true";
  if (!targetUrl) {
    return res.status(400).send("Missing URL parameter");
  }
  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Failed to fetch: ${response.statusText}`);
    }

    let html = await response.text();

    // Optionally disable all anchor links when isDisabled is not explicitly "false"
    if (isDisabled !== "false") {
      html = html.replace(/<a\s/gi, '<a style="pointer-events: none;"');
    }

    // Handle specific target URLs where we want to adjust or clean up the HTML
    if (targetUrl === "https://bytesense-site.webflow.io/bitely---shop-copy") {
      const $ = cheerio.load(html);
      $('#bitesense-header').remove();
      const $demo = $('#buy-nightguard');
      const currentStyle = $demo.attr('style') || '';

      // Append or replace padding
      const newStyle = currentStyle.replace(/padding:[^;]*;?/, '').trim(); // remove existing padding
      $demo.attr('style', `${newStyle}; padding: 0px;`.replace(/^; /, ''));
      html = '<!DOCTYPE html>\n' + $.html({ decodeEntities: false });
    }

    // Remove cookie notice banner from bytesense marketing pages rendered in the portal
    if (targetUrl === "https://www.bytesense.ai/consumers") {
      const $ = cheerio.load(html);

      // Remove common cookie/consent elements by id or class name
      $('[id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i]').remove();

      // As a fallback, remove any container that includes the standard cookie message text
      $('div, section, footer').each((_, el) => {
        const text = $(el).text() || "";
        if (text.includes("This site uses cookies and other tracking technologies")) {
          $(el).remove();
        }
      });

      html = '<!DOCTYPE html>\n' + $.html({ decodeEntities: false });
    }

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send(`Error fetching URL: ${error.message}`);
  }
}
