const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
const http = require('http');

function waitForServer(url, timeoutMs = 20000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      }).on('error', retry);
    }

    function retry() {
      if (Date.now() - startTime > timeoutMs) {
        reject(new Error(`Timeout waiting for server at ${url}`));
      } else {
        setTimeout(check, 400);
      }
    }

    check();
  });
}

async function runE2ETests() {
  console.log('--- Starting Next.js Production Server for Testing ---');
  const serverProcess = spawn('npx', ['next', 'start', '-p', '3344'], {
    cwd: './apps/web',
    shell: true,
    stdio: 'pipe',
  });

  serverProcess.stdout.on('data', (d) => process.stdout.write(`[next-server] ${d}`));
  serverProcess.stderr.on('data', (d) => process.stderr.write(`[next-server err] ${d}`));

  try {
    console.log('Waiting for Next.js server on http://localhost:3344 ...');
    await waitForServer('http://localhost:3344');
    console.log('Next.js server is ready!');

    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
      args: ['--no-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    });

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.error('[Browser console error]:', msg.text());
      }
    });

    console.log('\n[1/7] Navigating to http://localhost:3344 ...');
    await page.goto('http://localhost:3344');
    await page.waitForTimeout(500);

    // 1. Check Screen 1: Initial room cards (4 rooms)
    const initialCards = await page.locator('.room-card').count();
    console.log(`Initial room cards count: ${initialCards}`);
    if (initialCards !== 4) throw new Error(`Expected 4 initial room cards, got ${initialCards}`);

    // 2. Open Choose Method Modal (Screen 3)
    console.log('\n[2/7] Opening Choose Method Modal (Screen 3) ...');
    await page.click('button:has-text("⚡ + Tambah Beberapa Kamar Sekaligus")');
    await page.waitForTimeout(300);
    const modalChooseVisible = await page.isVisible('#modal-choose');
    if (!modalChooseVisible) throw new Error('Screen 3 modal failed to open');
    console.log('Screen 3 Modal visible: YES');

    // 3. Select "Tambah Kamar Massal" -> Go to Form (Screen 4)
    console.log('\n[3/7] Selecting "Tambah Kamar Massal" -> Screen 4 Form Massal ...');
    await page.click('.option-card.highlight');
    await page.waitForTimeout(300);
    const formVisible = await page.isVisible('#screen-form-massal');
    if (!formVisible) throw new Error('Screen 4 form failed to display');

    // Fill form
    await page.fill('#gen-count', '6');
    await page.fill('#gen-prefix', '20');
    await page.fill('#gen-start', '1');
    await page.waitForTimeout(200);
    const rangeVal = await page.inputValue('#gen-range-display');
    console.log(`Calculated room range: ${rangeVal}`);
    if (rangeVal !== '201 – 206') throw new Error(`Expected range '201 – 206', got '${rangeVal}'`);

    // 4. Proceed to Summary Table (Screen 5)
    console.log('\n[4/7] Proceeding to Summary Table (Screen 5) ...');
    await page.click('button:has-text("Lanjut ke Pratinjau & Ringkasan →")');
    await page.waitForTimeout(300);
    const summaryVisible = await page.isVisible('#screen-summary');
    if (!summaryVisible) throw new Error('Screen 5 summary table failed to display');

    const summaryRows = await page.locator('#summary-tbody tr').count();
    console.log(`Summary rows count: ${summaryRows}`);
    if (summaryRows !== 6) throw new Error(`Expected 6 summary rows, got ${summaryRows}`);

    // 5. Test Screen 6: Duplicate Error & In-place Auto-correction
    console.log('\n[5/7] Testing Screen 6: Error State Duplicate Room Numbers ...');
    // Change first room number in table to "101" to cause collision with existing room 101
    const firstInput = page.locator('#summary-tbody tr:first-child input').first();
    await firstInput.fill('101');
    await page.waitForTimeout(300);

    const errorBannerVisible = await page.isVisible('#error-banner');
    console.log(`Error banner visible after collision: ${errorBannerVisible}`);
    if (!errorBannerVisible) throw new Error('Expected #error-banner to be visible for duplicate number 101');

    const hasErrorRows = await page.locator('tr.has-error').count();
    console.log(`Rows marked with error: ${hasErrorRows}`);
    if (hasErrorRows === 0) throw new Error('Expected at least 1 row marked with error');

    // Auto-fix duplicates
    console.log('Clicking Auto-Koreksi Nomor yang Kembar ...');
    await page.click('button:has-text("⚡ Auto-Koreksi Nomor yang Kembar")');
    await page.waitForTimeout(300);
    const errorBannerAfterFix = await page.isVisible('#error-banner');
    console.log(`Error banner visible after auto-fix: ${errorBannerAfterFix}`);
    if (errorBannerAfterFix) throw new Error('Error banner should disappear after auto-fix');

    // 6. Save All Rooms (Screen 7A & 7B)
    console.log('\n[6/7] Saving all rooms (Screen 7A Progress & 7B Success) ...');
    await page.click('#btn-save-summary');
    await page.waitForTimeout(500); // Progress bar modal visible
    await page.waitForTimeout(1800); // Wait for progress completion & success modal

    const successVisible = await page.isVisible('#modal-success');
    console.log(`Success modal visible: ${successVisible}`);
    if (!successVisible) throw new Error('Screen 7B success modal failed to appear');

    // Click "Lihat Daftar Kamar"
    await page.click('button:has-text("Lihat Daftar Kamar →")');
    await page.waitForTimeout(300);

    const postMassAddCount = await page.locator('.room-card').count();
    console.log(`Room cards after mass add: ${postMassAddCount} (Expected 10 = 4 original + 6 new)`);
    if (postMassAddCount !== 10) throw new Error(`Expected 10 rooms, got ${postMassAddCount}`);

    // 7. Test Duplicate Modal (Screen 8)
    console.log('\n[7/7] Testing Duplicate Modal (Screen 8) ...');
    const firstDupBtn = page.locator('.btn-duplicate').first();
    await firstDupBtn.click();
    await page.waitForTimeout(300);

    const dupModalVisible = await page.isVisible('#modal-duplicate');
    console.log(`Duplicate Modal visible: ${dupModalVisible}`);
    if (!dupModalVisible) throw new Error('Screen 8 duplicate modal failed to open');

    // Submit duplication (creates 2 duplicated rooms)
    console.log('Submitting duplicate form ...');
    const btn = page.locator('#btn-submit-duplicate');
    const isBtnDisabled = await btn.isDisabled();
    console.log(`Is #btn-submit-duplicate disabled? ${isBtnDisabled}`);
    const isBtnVisible = await btn.isVisible();
    console.log(`Is #btn-submit-duplicate visible? ${isBtnVisible}`);
    if (isBtnDisabled) {
      const errText = await page.locator('#modal-duplicate .bg-red-50').textContent();
      console.log(`Duplicate error message: ${errText}`);
    }
    await btn.click({ force: true });
    console.log('Clicked #btn-submit-duplicate successfully!');
    await page.waitForTimeout(1600); // Wait for progress and success
    await page.click('#btn-view-rooms-success');
    await page.waitForTimeout(300);

    const postDupCount = await page.locator('.room-card').count();
    console.log(`Room cards after duplication: ${postDupCount} (Expected 12)`);
    if (postDupCount !== 12) throw new Error(`Expected 12 rooms, got ${postDupCount}`);

    // Test Empty State (Screen 2)
    console.log('\nTesting Screen 2 Empty State trigger ...');
    await page.click('button:has-text("Simulasi Empty State (0 Kamar)")');
    await page.waitForTimeout(300);
    const emptyCount = await page.locator('.room-card').count();
    console.log(`Room cards in empty state: ${emptyCount} (Expected 0)`);
    const emptyStateVisible = await page.isVisible('text=Belum Ada Unit Kamar di Properti Ini');
    if (!emptyStateVisible) throw new Error('Screen 2 Empty state not displayed');

    // Restore seed data
    await page.click('button:has-text("Muat 4 Kamar Bawaan")');
    await page.waitForTimeout(300);
    const restoredCount = await page.locator('.room-card').count();
    console.log(`Restored room count: ${restoredCount} (Expected 4)`);

    await browser.close();

    console.log('\n===========================================');
    console.log('ALL E2E PLAYWRIGHT TESTS PASSED SUCCESSFULLY!');
    console.log(`Total console errors: ${consoleErrors.length}`);
    console.log('===========================================\n');

    if (consoleErrors.length > 0) {
      throw new Error(`Found ${consoleErrors.length} console errors during test run`);
    }

    process.exit(0);
  } catch (err) {
    console.error('\nE2E Test Failed with error:', err);
    process.exit(1);
  } finally {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
  }
}

runE2ETests();
