#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const IGNORE_DIRS = new Set(['node_modules', '.next', 'public', 'build', 'dist', '.git']);

let filesProcessed = 0;
let backupsCreated = 0;

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (IGNORE_DIRS.has(entry.name)) continue;
            walk(path.join(dir, entry.name));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (EXTS.has(ext)) processFile(path.join(dir, entry.name));
        }
    }
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Create backup once
        const bakPath = filePath + '.bak';
        if (!fs.existsSync(bakPath)) {
            fs.writeFileSync(bakPath, content, 'utf8');
            backupsCreated++;
        }

        // Remove block comments /* ... */ and line comments //...
        // Note: simple regex; may remove comments inside strings in rare cases.
        let out = content.replace(/\/\*[\s\S]*?\*\//g, '');
        out = out.replace(/(^|[^:\\])\/\/[^"]*$/gm, '$1');

        // Normalize multiple blank lines
        out = out.replace(/\n{3,}/g, '\n\n');

        if (out !== content) {
            fs.writeFileSync(filePath, out, 'utf8');
        }

        filesProcessed++;
    } catch (err) {
        console.error('Failed to process', filePath, err.message);
    }
}

console.log('Stripping comments under', ROOT);
walk(ROOT);
console.log(`Processed ${filesProcessed} files. Backups created: ${backupsCreated}.`);
console.log('Backups are saved as *.bak next to original files.');
