export const processTime = (tag: string, fn: () => void) => {
  console.time(tag);
  fn();
  console.timeEnd(tag);
};
