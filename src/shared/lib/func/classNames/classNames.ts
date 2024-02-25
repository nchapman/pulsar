type Mods = Record<string, boolean | string | undefined>;
type Additional = Array<string | undefined>;
export function classNames(s: string, additional: Additional = [], mods: Mods = {}): string {
  return [
    s,
    ...additional.filter((v) => !!v && v !== 'undefined'),
    ...Object.entries(mods)
      .filter(([, value]) => Boolean(value))
      .map(([className]) => className),
  ].join(' ');
}
