export const SpacingDecorator = (Story: any) => (
  <div
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
  >
    <div style={{ width: 'max-content', height: 'max-content', flexShrink: 0 }}>
      <Story />
    </div>
  </div>
);
