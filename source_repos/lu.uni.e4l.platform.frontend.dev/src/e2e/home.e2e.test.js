describe('E2E: Home Page', () => {
  beforeAll(async () => {
    // // 1. Enable Request Interception
    // await page.setRequestInterception(true);

    // // 2. Define how to handle requests
    // page.on('request', request => {
    //   // If the app tries to fetch the session count (API call)
    //   if (request.url().includes('responses/count')) {
    //     // We block the real call and return a Fake Response
    //     console.log('Mocking /responses/count API call');
    //     request.respond({
    //       status: 200,
    //       contentType: 'application/json',
    //       body: JSON.stringify(1000) // Fake data: 1000 sessions
    //     });
    //   } else {
    //     // Allow all other requests (CSS, JS, HTML) to pass through normally
    //     request.continue();
    //   }
    // });

    const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:8080';
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
  });

  it('should display the correct page title', async () => {
    const title = await page.title();
    // Adjust this string to match whatever your actual index.html <title> is
    expect(title).toMatch(/E4L/i);
  });

  it('should show the Audience Picker options', async () => {
    // Wait for the app to render the main body
    await page.waitForSelector('.card-unique');
    
    // Get all text on the page
    const text = await page.evaluate(() => document.body.textContent);
    
    // Verify the initial selection screen is present
    expect(text).toContain('Welcome to Energy 4 life');
    expect(text).toContain('For Adults');
    expect(text).toContain('For Kids');
  });

  // it('should have attempted to fetch session count', async () => {
  //   // We mocked the API response to return 1000 in beforeAll.
  //   // We now wait for the frontend to process this and render it into the DOM.
  //   // Note: waitForFunction is safer than a simple expect because the fetch is asynchronous.
  //   await page.waitForFunction(
  //     () => document.body.textContent.includes('1000'),
  //     { timeout: 5000 } // Wait up to 5 seconds for the mock data to appear
  //   );

  //   // Double check with a standard Jest assertion for the report
  //   const text = await page.evaluate(() => document.body.textContent);
  //   expect(text).toContain('1000');
  // });
});