/* posts/*.md를 한 번에 읽어서 posts/posts.js로 묶습니다.
   브라우저에서 index.html을 직접(file://) 열면 fetch가 차단되므로,
   blog.js가 그 사본을 폴백으로 사용합니다. 배포 사이트는 Markdown을 바로 읽습니다.

   사용: 게시물을 추가·수정했을 때마다 아래 명령을 실행하세요.
     node tools/build-posts.mjs
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = path.join(ROOT, 'posts');

const files = JSON.parse(fs.readFileSync(path.join(POSTS, 'index.json'), 'utf8'));
const entries = files.map(file => {
  const full = path.join(POSTS, file);
  if (!fs.existsSync(full)) {
    console.error(`index.json에 적힌 파일이 없습니다: posts/${file}`);
    process.exitCode = 1;
    return null;
  }
  return { file, content: fs.readFileSync(full, 'utf8') };
}).filter(Boolean);

const banner = '/* posts/*.md에서 생성된 미리보기 사본입니다. 직접 수정하지 마세요 (node tools/build-posts.mjs). */\n';
const out = banner + 'window.portalPosts = ' + JSON.stringify(entries) + ';\n';
fs.writeFileSync(path.join(POSTS, 'posts.js'), out, 'utf8');

console.log(`posts/posts.js 갱신 — ${entries.length}개: ${entries.map(entry => entry.file).join(', ')}`);
