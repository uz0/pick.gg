const url = 'http://localhost:3000/';
const loginWithGoogleButtonSelector = '.style_start_btns__3Z_3K';

jest.setTimeout(31000);

describe('Index page', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  it('should display "Fantasy league"', async () => {
    await expect(page).toMatch('Fantasy league');
  });

  it('should not display "qweqwe." text on page', async () => {
    await expect(page).not.toMatch('qweqwe');
  });

  it('should display googl auth button', async () => {
    await page.waitForSelector(loginWithGoogleButtonSelector, { visible: true });
  });
});
