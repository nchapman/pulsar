type Mods = Record<string, boolean | string | undefined>;
type Additional = Array<string | undefined>;
export function classNames(cls: string, additional: Additional = [], mods: Mods = {}): string {
  return [
    cls,
    ...additional.filter((v) => !!v && v !== 'undefined'),
    ...Object.entries(mods)
      .filter(([, value]) => Boolean(value))
      .map(([className]) => className),
  ].join(' ');
}
