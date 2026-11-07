const fs = require('fs');
const path = require('path');

// 1. Collect all valid routes
const validRoutes = new Set([
  '/',
  '/#posts',
  '/tools',
  '/about',
  '/go/shenxing',
  '/go/dalao',
  '/go/shandianshu',
  '/go/yunjiexian',
  '/go/huanqiuti',
  '/go/liulian',
  '/go/pinghaolian',
]);

const blogDir = path.join(__dirname, 'src/content/blog');
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

blogFiles.forEach(f => {
  const slug = f.replace(/\.md$/, '');
  validRoutes.add(`/posts/${slug}`);
});

console.log('Total valid routes registered:', validRoutes.size);

// 2. Scan all markdown files for links
let brokenLinks = [];
let totalLinksChecked = 0;

blogFiles.forEach(f => {
  const content = fs.readFileSync(path.join(blogDir, f), 'utf8');
  const matches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  
  matches.forEach(m => {
    const linkMatch = m.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (!linkMatch) return;
    const text = linkMatch[1];
    let href = linkMatch[2].trim();
    
    // Ignore external http/https, anchor-only #, mailto
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('#')) {
      return;
    }
    
    // Normalize href: remove hash anchor if any for routing check
    const cleanHref = href.split('#')[0];
    totalLinksChecked++;
    
    if (cleanHref && !validRoutes.has(cleanHref)) {
      brokenLinks.push({
        file: f,
        text,
        href,
        cleanHref,
      });
    }
  });
});

// 3. Scan all astro pages and components for links
const scanDirs = [
  path.join(__dirname, 'src/pages'),
  path.join(__dirname, 'src/components'),
];

scanDirs.forEach(dir => {
  fs.readdirSync(dir).filter(f => f.endsWith('.astro')).forEach(f => {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const hrefMatches = content.match(/href="([^"]+)"/g) || [];
    hrefMatches.forEach(m => {
      const href = m.slice(6, -1).trim();
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('#') || href.startsWith('{')) {
        return;
      }
      const cleanHref = href.split('#')[0];
      if (!cleanHref) return;
      totalLinksChecked++;
      if (cleanHref && !validRoutes.has(cleanHref)) {
        // Check if it's a physical file in public/
        const publicFile = path.join(__dirname, 'public', cleanHref);
        if (!fs.existsSync(publicFile)) {
          brokenLinks.push({
            file: f,
            text: href,
            href,
            cleanHref,
          });
        }
      }
    });
  });
});

console.log(`Total internal links checked across all pages/markdown: ${totalLinksChecked}`);
if (brokenLinks.length > 0) {
  console.error(`Found ${brokenLinks.length} broken links:`);
  brokenLinks.forEach(b => console.error(`  In ${b.file}: href="${b.href}" -> target '${b.cleanHref}' not found!`));
  process.exit(1);
} else {
  console.log('100% of internal links across the entire site are valid!');
}
