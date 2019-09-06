const url = 'http://localhost:3001/';

jest.setTimeout(31000);

describe('Index page', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  it('should display "Fantasy league"', async () => {
    await expect(page).toMatch('Pick.gg');
  });

  it('should not display "qweqwe." text on page', async () => {
    await expect(page).not.toMatch('qweqwe');
  });
});
