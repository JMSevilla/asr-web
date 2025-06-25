export function formKey(key: string, prefix?: string) {
  return [prefix, key].filter(Boolean).join('_');
}
