export default async function handler(req, res) {
  const url = "https://www.bytesense.ai/faq";
  const response = await fetch(url, { mode: "cors" });
  const html = await response.text();
  res.setHeader("Content-Type", "text/html");
  res.send(html);
}
