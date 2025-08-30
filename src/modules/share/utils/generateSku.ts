import crypto from 'crypto'

export function generateSkus(variants: { name: string; options: string[] }[]) {
  return variants
    .reduce<string[][]>(
      (acc, variant) => {
        const result: string[][] = [];
        acc.forEach((combination) => {
          variant.options.forEach((option) => {
            result.push([...combination, option.toUpperCase()]);
          });
        });
        return result;
      },
      [[]],
    )
    .map((combo) => ({
      value: combo.join('-'),
      price: crypto.randomInt(10000, 10000000),
      stock: crypto.randomInt(0, 10000),
      image: 'https://',
    }));
}
