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
    if (isDisabled !== "false") {
      html = html.replace(/<a\s/gi, '<a style="pointer-events: none;"');
    }
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
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send(`Error fetching URL: ${error.message}`);
  }
}
