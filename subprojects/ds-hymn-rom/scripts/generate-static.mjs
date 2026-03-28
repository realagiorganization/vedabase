import path from 'node:path';
import { checkCatalogFiles, outputSummary, writeCatalogFiles } from './catalog.mjs';

const checkMode = process.argv.includes('--check');
const inputFile = path.resolve('data/hymn-catalog.mock.json');
const outputDir = path.resolve('source/generated');
const snapshotDir = path.resolve('generated');

if (checkMode) {
  const result = checkCatalogFiles({ inputFile, outputDir, snapshotDir });
  if (result.mismatches.length > 0) {
    console.error(`Generated files are out of date:\n${result.mismatches.join('\n')}`);
    process.exit(1);
  }
  console.log(outputSummary(result));
  process.exit(0);
}

const result = writeCatalogFiles({ inputFile, outputDir, snapshotDir });
console.log(outputSummary(result));
