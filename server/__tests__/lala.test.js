describe('Fake test', () => {
  it('dirty string match', async () => {
    await expect('lala').toMatch('lala');
  });
});
