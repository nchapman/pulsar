export const codeMarkdownMock =
  'Sure, here is a simple Python code that calculates the Fibonacci sequence:\n' +
  '```python\n' +
  'def fibonacci(n):\n' +
  '    if n <= 0:\n' +
  '        return "Input should be positive integer"\n' +
  '    elif n == 1:\n' +
  '        return 0\n' +
  '    elif n == 2:\n' +
  '        return 1\n' +
  '    else:\n' +
  '        a, b = 0, 1\n' +
  '        for i in range(n - 2):\n' +
  '            a, b = b, a + b\n' +
  '        return b\n' +
  '\n' +
  'n = int(input("Enter a number: "))\n' +
  'print(fibonacci(n))\n' +
  '```';
