import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://yebo.baby',
  integrations: [sitemap()],
  redirects: {
    '/go/shenxing': {
      status: 302,
      destination: 'https://wuhan01.shenxingaff.com/#/?code=WUQMrgI8'
    },
    '/go/dalao': {
      status: 302,
      destination: 'https://fugui0077.dalaoyunaff.com/#/?code=Wpfk4XD5'
    },
    '/go/shandianshu': {
      status: 302,
      destination: 'https://fugui0077.shandianshuaff.com/#/?code=KSByEAn9'
    },
    '/go/liulian': {
      status: 302,
      destination: 'https://zyrrz.liulianyunaff.com/#/?code=Y6A1M1MN'
    },
    '/go/huanqiuti': {
      status: 302,
      destination: 'https://fugui0077.huanqiutiaff.com/#/?code=rJyQn4xG'
    },
    '/go/yunjiexian': {
      status: 302,
      destination: 'https://fugui0077.yunjiexianaff.com/#/?code=qA3LF6hW'
    },
    '/go/pinghaolian': {
      status: 302,
      destination: 'https://pinghaolian.cc/a/6urgqa32'
    }
  }
});
