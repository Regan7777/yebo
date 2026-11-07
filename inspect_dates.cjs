const fs = require('fs');
const files = fs.readdirSync('src/content/blog');
const airportPosts = [];
files.forEach(f => {
  const c = fs.readFileSync('src/content/blog/' + f, 'utf-8');
  const d = c.match(/pubDate:\s*(.*)/);
  const feat = c.match(/featured:\s*(.*)/);
  const cat = c.match(/category:\s*"([^"]+)"/);
  const title = c.match(/title:\s*"([^"]+)"/);
  if (cat && cat[1] === '机场推荐') {
    airportPosts.push({
      file: f,
      title: title ? title[1] : '',
      date: d ? d[1].trim() : '',
      featured: feat ? feat[1].trim() : 'false'
    });
  }
});
console.log('Airport posts:');
console.table(airportPosts);

