import * as stylex from '@stylexjs/stylex';

export const s = stylex.create({
  chatForm: {
    width: 400,
    margin: '0 auto',
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(217, 217, 227, 0.2)',
    position: 'relative',
    borderColor: {
      ':focus-within': 'rgba(217, 217, 227, 0.3)',
    },
  },

  chatInput: {
    display: 'block',
    width: '100%',
    resize: 'none',
    padding: '14px 48px 14px 16px',
    border: 'none',
    background: 'none',
    outline: 'transparent',
    color: '#fff',
  },
});
