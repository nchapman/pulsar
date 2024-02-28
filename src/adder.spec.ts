import './adder';

import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { afterEach, describe, expect, test } from 'bun:test';

afterEach(() => {
  clearMocks();
});

describe('adder', () => {
  test('should be defined', () => {
    mockIPC((cmd, args) => {
      switch (cmd) {
        case 'add':
          return (args.a as number) + (args.b as number);
        default:
          break;
      }
      return null;
    });

    expect(true).toBeDefined();
  });
});
