describe('Hello Tauri', () => {
    it('Load test model should be there', async () => {
      const loadTestModelButton = await $('button=Load test model')
      await expect(loadTestModelButton).toHaveText('Welcome to my Page')
    })
  
  })