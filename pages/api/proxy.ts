export default async function handler(req, res) {
  const response = await fetch("https://www.bytesense.ai/faq");
  const html = await response.text();
  res.setHeader("Content-Type", "text/html");
  res.send(html);
}
