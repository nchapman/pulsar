import { ModelTagType, Tag } from '../types/tag.type.ts';

export function getTagsFromName(name: string, exclude?: ModelTagType[]): Tag[] {
  const tags: Tag[] = [];

  const [type] = name.match(/gguf/i) || [];
  if (type) tags.push({ value: `GGUF`, type: 'type' });

  const [params] = name.match(/(\d+(\.\d+)?)(?=B)/i) || [];
  if (params) tags.push({ value: `${params}B`, type: 'params' });

  const [architecture] = name.match(/(llama|llava|mistral)/i) || [];
  if (architecture) tags.push({ value: architecture.toLowerCase(), type: 'arch' });

  return tags.filter((tag) => !exclude?.includes(tag.type));
}
