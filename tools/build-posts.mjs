/* 실험 기록을 모아서 두 개의 생성물을 만듭니다.
   1) posts/index.json — 브라우저가 읽는 게시 목록
   2) posts/posts.js   — index.html을 file://로 열 때 쓰는 미리보기 사본 (fetch가 차단되기 때문)

   게시 대상은 자동으로 긁어 모읍니다:
     posts/<slug>/index.md   ← 본문과 이미지를 한 폴더에 (권장)
     posts/<slug>.md         ← 본문만 두는 평면 형식
   그리고 index.json에 이미 적혀 있던 항목은 그대로 보존합니다(합집합).
   파일이 사라진 항목은 경고 후 목록에서 빠집니다.

   사용: 게시물을 추가·수정·삭제했을 때마다
     node tools/build-posts.mjs
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = path.join(ROOT, 'posts');
const INDEX = path.join(POSTS, 'index.json');
const BUNDLE = path.join(POSTS, 'posts.js');

/* blog.js의 buildPost와 같은 slug 규칙 */
const slugOf = file => {
  const noMd = file.replace(/\.md$/i, '');
  const parts = noMd.split('/');
  return parts.length > 1 && parts[parts.length - 1] === 'index' ? parts.slice(0, -1).join('/') : noMd;
};

const exists = file => fs.existsSync(path.join(POSTS, file.split('/').join(path.sep)));

function scanned() {
  const found = [];
  for (const entry of fs.readdirSync(POSTS, { withFileTypes: true })) {
    if (entry.isFile() && /\.md$/i.test(entry.name)) { found.push(entry.name); continue; }
    if (!entry.isDirectory()) continue;
    const inner = ['index.md', 'index.markdown'].find(name => fs.existsSync(path.join(POSTS, entry.name, name)));
    if (inner) found.push(`${entry.name}/${inner}`);
  }
  return found;
}

const listed = fs.existsSync(INDEX) ? JSON.parse(fs.readFileSync(INDEX, 'utf8')) : [];
const dropped = listed.filter(file => !exists(file));
dropped.forEach(file => console.warn(`index.json에 적힌 파일이 없어서 목록에서 뺍니다: posts/${file}`));

const files = [...new Set([...listed.filter(exists), ...scanned()])].sort();
const read = file => fs.readFileSync(path.join(POSTS, file.split('/').join(path.sep)), 'utf8');
const frontOf = raw => { const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw); return front ? front[1] : ''; };
/* frontmatter에 draft: true (또는 1/yes) 가 있으면 게시 목록에서 뺍니다. 파일은 남겨 두는 임시 보관 상태입니다. */
const isDraft = raw => /^draft:[ \t]*(?:1|true|yes)/im.test(frontOf(raw));
const drafts = files.filter(file => isDraft(read(file)));
const published = files.filter(file => !isDraft(read(file)));
drafts.forEach(file => console.log(`draft로 표시해서 게시 목록에서 뺐습니다: posts/${file}`));

/* 데모 경로는 빌드에서 잡아 주는 편이 고치기 쉽습니다. */
published.forEach(file => {
  const declared = /^demo:[ \t]*(\S.*)$/im.exec(frontOf(read(file)));
  if (!declared) return;
  const value = declared[1].trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('/')) {
    console.warn(`demo는 포스트 폴더 안의 상대 경로만 지원합니다: posts/${file} → ${value}`);
    return;
  }
  const target = path.join(path.dirname(path.join(POSTS, file.split('/').join(path.sep))), value.split('/').join(path.sep));
  if (!fs.existsSync(target)) console.warn(`demo로 지정한 파일이 이 포스트 폴더에 없습니다: posts/${file} → ${value}`);
});

const slugs = new Map();
published.forEach(file => {
  const slug = slugOf(file);
  if (slugs.has(slug)) {
    console.error(`slug가 겹칩니다 (같은 주소로 게시됩니다): ${slugs.get(slug)} / ${file}`);
    process.exitCode = 1;
  }
  slugs.set(slug, file);
});

const entries = published.map(file => ({ file, content: read(file) }));

fs.writeFileSync(INDEX, JSON.stringify(published, null, 2) + '\n', 'utf8');
const banner = '/* posts/*.md에서 생성된 미리보기 사본입니다. 직접 수정하지 마세요 (node tools/build-posts.mjs). */\n';
fs.writeFileSync(BUNDLE, banner + 'window.portalPosts = ' + JSON.stringify(entries) + ';\n', 'utf8');

console.log(`posts/index.json · posts/posts.js 갱신 — ${published.length}개 게시${drafts.length ? ` · ${drafts.length}개 임시 보관` : ''}`);
published.forEach(file => console.log(`  posts/${file}  →  #/blog/${slugOf(file)}`));
