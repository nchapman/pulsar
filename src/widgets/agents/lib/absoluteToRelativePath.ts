export function getRelativePath(from: string, to: string) {
  const fromParts = from.split('/').filter(Boolean); // Split and remove empty parts
  const toParts = to.split('/').filter(Boolean);

  // Find the first point where the paths differ
  let i = 0;
  while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
    i += 1;
  }

  // Go up for the remaining directories in the `from` path
  const upDirs = fromParts
    .slice(i)
    .map(() => '..')
    .join('/');

  // Add remaining directories from the `to` path
  const remainingDirs = toParts.slice(i).join('/');

  // Construct the relative path
  return upDirs.length ? `${upDirs}/${remainingDirs}` : remainingDirs;
}
