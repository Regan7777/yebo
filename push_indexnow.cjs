const fs = require('fs');
const path = require('path');

const HOST = 'yebo.baby';
const KEY = 'b6e7fa90d84e4662853c4da6fc4beb86';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Collect all site URLs
const urls = [
  `https://${HOST}/`,
  `https://${HOST}/tools`,
  `https://${HOST}/about`,
];

const blogDir = path.join(__dirname, 'src/content/blog');
if (fs.existsSync(blogDir)) {
  const posts = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  posts.forEach(f => {
    const slug = f.replace(/\.md$/, '');
    urls.push(`https://${HOST}/posts/${slug}`);
  });
}

console.log(`[IndexNow] Preparing to submit ${urls.length} URLs for ${HOST}...`);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
};

async function submitIndexNow() {
  const endpoints = [
    { name: 'Bing IndexNow', url: 'https://www.bing.com/indexnow' },
    { name: 'IndexNow API', url: 'https://api.indexnow.org/indexnow' }
  ];

  for (const ep of endpoints) {
    try {
      const response = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 200 || response.status === 202) {
        console.log(`[IndexNow -> ${ep.name}] 成功推送 ${urls.length} 个 URL！(状态码: ${response.status})`);
      } else {
        const text = await response.text();
        console.log(`[IndexNow -> ${ep.name}] 返回状态码 ${response.status}: ${text}`);
      }
    } catch (err) {
      console.error(`[IndexNow -> ${ep.name}] 网络错误:`, err.message);
    }
  }
}

submitIndexNow();

