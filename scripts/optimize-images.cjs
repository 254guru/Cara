#!/usr/bin/env node
/**
 * Converts all PNG/JPG/JPEG images under public/ subdirectories to WebP
 * using @254guru/webp-convert, preserving directory structure.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

const subdirs = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => path.join(PUBLIC_DIR, d.name));

let totalConverted = 0;

for (const dir of subdirs) {
  const hasImages = fs.readdirSync(dir).some(f =>
    /\.(png|jpe?g)$/i.test(f)
  );
  if (!hasImages) continue;

  console.log(`\nConverting: ${path.relative(process.cwd(), dir)}/`);
  try {
    const output = execSync(
      `npx webp-convert "${dir}" -o "${dir}" -q 82 --overwrite`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );

    // Remove unwanted resized variants (-400, -800 suffixes)
    const resized = fs.readdirSync(dir).filter(f =>
      /-(400|800)\.webp$/i.test(f)
    );
    for (const f of resized) {
      fs.unlinkSync(path.join(dir, f));
    }

    const webpCount = fs.readdirSync(dir).filter(f => f.endsWith('.webp')).length;
    console.log(`  ✓ ${webpCount} WebP file(s)`);
    totalConverted += webpCount;
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
  }
}

console.log(`\n✓ Done — ${totalConverted} WebP file(s) total`);
