export default function camelCase(obj: any) {
  const keys = Object.keys(obj);
  const newProduct: { [key: string]: any } = {};
  keys.forEach((key: string) => {
    const camelCasedKey = key
      .split('_')
      .map((k: string, index) => {
        let newKey = k;
        if (index !== 0) {
          newKey = k.charAt(0).toUpperCase() + k.slice(1);
        }
        return newKey;
      })
      .join('');
    newProduct[camelCasedKey] = obj[key];
  });
  return newProduct;
}
