// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/faq",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://app.bytesense.ai",
          },
          {
            key: "X-Frame-Options",
            value: "",
          },
        ],
      },
    ];
  },
};
