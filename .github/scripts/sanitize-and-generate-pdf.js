// Generate a PDF from the Playwright HTML report (safe artifact)
// Requires Playwright to be installed and browsers available

const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const repoRoot = process.cwd();
    const reportDir = path.resolve(repoRoot, 'playwright-report');
    const indexFile = path.join(reportDir, 'index.html');

    if (!fs.existsSync(indexFile)) {
      console.log('Playwright HTML report not found at', indexFile);
      console.log('Skipping PDF generation.');
      process.exit(0);
    }

    // Lazy-require Playwright so that script can run even if not installed (will error clearly)
    let chromium;
    try {
      chromium = require('playwright').chromium;
    } catch (e) {
      console.error('Playwright is not installed. Please run `npx playwright install` before running this script.');
      process.exit(1);
    }

    const browser = await chromium.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Load the local HTML report via file:// and wait for network idle
    await page.goto('file://' + indexFile, { waitUntil: 'networkidle' });

    // Remove script tags to reduce chances of AV false positives
    await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      scripts.forEach(s => s.remove());
      // Optionally remove external links
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"][href^="http"]'));
      links.forEach(l => l.remove());
    });

    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
    const outputPdf = path.join(reportDir, 'report.pdf');

    await page.pdf({ path: outputPdf, format: 'A4' });
    await browser.close();

    console.log('PDF report generated at', outputPdf);
    process.exit(0);
  } catch (err) {
    console.error('Error while generating PDF report:', err);
    process.exit(1);
  }
})();
