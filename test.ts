import { generateSkus } from 'src/modules/product/dtos/product.request';

const arr = [
  {
    name: 'size',
    options: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'color',
    options: ['gray', 'blue', 'purple'],
  },
];

const result = generateSkus(arr);
console.log(JSON.stringify(result));
