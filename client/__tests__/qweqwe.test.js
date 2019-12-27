describe('Index page', () => {
  it('dirty string match', async () => {
    await expect('lala').toMatch('lala');
  });

  // beforeAll(async () => {
  //   await page.goto(global.URL);
  // });

  // it('should display "Fantasy league"', async () => {
  //   await expect(page).toMatch('Pick.gg');
  // });

  // it('should auth as mocked streamer', async () => {
  //   await page.goto(global.URL + '/tournaments?username=streamer1');
  //   await page.waitForSelector('[class*="role"]');
  //   await expect(page).toMatch('streamer1');
  // });

  // it('should not display "qweqwe." text on page', async () => {
  //   await expect(page).not.toMatch('qweqwe');
  // });
});
