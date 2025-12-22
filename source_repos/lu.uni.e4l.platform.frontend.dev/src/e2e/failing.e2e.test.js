describe('E2E: Deliberate Failure Scenario', () => {
  beforeAll(async () => {
    const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:8080';
    await page.goto(baseUrl);
  });

  // This test is DESIGNED TO FAIL.
  // It asserts that the "Calculate energy score" button is visible immediately.
  // In reality, the "Audience Picker" (Kid/Adult) hides it, so this will fail.
  it('should verify Calculator is visible without selecting audience', async () => {
    // We expect the text "Calculate energy score" to be on the screen
    const text = await page.evaluate(() => document.body.textContent);
    
    expect(text).toContain('Calculate energy score');
  });
});