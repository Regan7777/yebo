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
  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`[IndexNow] Successfully pushed ${urls.length} URLs to Bing & IndexNow engines! (Status: ${response.status})`);
    } else {
      const text = await response.text();
      console.log(`[IndexNow] Server responded with status ${response.status}: ${text}`);
      console.log('[Notice] Once DNS resolution for yebo.baby is active, this request will succeed automatically.');
    }
  } catch (err) {
    console.error(`[IndexNow] Network error during submission:`, err.message);
  }
}

submitIndexNow();

