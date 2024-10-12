import { APP_DIRS } from '@/app/consts/app.const.ts';
import { copyDir } from '@/shared/lib/func';

export function moveToAgents(src: string) {
  return copyDir(src, APP_DIRS.AGENTS);
}
