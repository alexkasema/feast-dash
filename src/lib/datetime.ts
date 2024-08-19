export function dbDateTime(str: string) {
  return str.replace("T", " ").substring(0, 16);
}
