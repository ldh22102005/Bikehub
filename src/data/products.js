export const bikeImages = {
  xedapdiahinh: [
    require('../../assets/Image/xedapdiahinh/1.png'),
    require('../../assets/Image/xedapdiahinh/2.png'),
    require('../../assets/Image/xedapdiahinh/3.png'),
    require('../../assets/Image/xedapdiahinh/4.png'),
    require('../../assets/Image/xedapdiahinh/5.png'),
    require('../../assets/Image/xedapdiahinh/6.png'),
    require('../../assets/Image/xedapdiahinh/7.png'),
    require('../../assets/Image/xedapdiahinh/8.png'),
    require('../../assets/Image/xedapdiahinh/9.png'),
    require('../../assets/Image/xedapdiahinh/10.png'),
    require('../../assets/Image/xedapdiahinh/11.png'),
  ],
  xedapgap: [
    require('../../assets/Image/xedapgap/1.png'),
    require('../../assets/Image/xedapgap/2.png'),
    require('../../assets/Image/xedapgap/3.png'),
    require('../../assets/Image/xedapgap/4.png'),
    require('../../assets/Image/xedapgap/5.png'),
    require('../../assets/Image/xedapgap/6.png'),
  ],
  xedaptreem: [
    require('../../assets/Image/xedaptreem/1.png'),
    require('../../assets/Image/xedaptreem/2.png'),
    require('../../assets/Image/xedaptreem/3.png'),
    require('../../assets/Image/xedaptreem/4.png'),
    require('../../assets/Image/xedaptreem/5.png'),
    require('../../assets/Image/xedaptreem/6.png'),
  ],
  xedua: [
    require('../../assets/Image/xedua/1.png'),
    require('../../assets/Image/xedua/2.png'),
    require('../../assets/Image/xedua/3.png'),
    require('../../assets/Image/xedua/4.png'),
    require('../../assets/Image/xedua/5.png'),
    require('../../assets/Image/xedua/6.png'),
    require('../../assets/Image/xedua/7.png'),
    require('../../assets/Image/xedua/8.png'),
    require('../../assets/Image/xedua/9.png'),
    require('../../assets/Image/xedua/10.png'),
  ],
};

export const bikeCategories = [
  { key: 'xedapdiahinh', label: 'Xe đạp địa hình' },
  { key: 'xedua', label: 'Xe đua' },
  { key: 'xedapgap', label: 'Xe đạp gấp' },
  { key: 'xedaptreem', label: 'Xe đạp trẻ em' },
];

const makePrice = (base, i) => `$${(base + i * 75).toLocaleString('en-US')}.00`;
const MAX_ITEMS_PER_CATEGORY = 4;

const buildProducts = ({ category, key, namePrefix, basePrice, tags = [] }, startId) =>
  bikeImages[key].slice(0, MAX_ITEMS_PER_CATEGORY).map((img, idx) => ({
    id: String(startId + idx),
    category,
    name: `${namePrefix} ${idx + 1}`,
    price: makePrice(basePrice, idx),
    image: img,
    tag: tags[idx] ?? undefined,
    stockQty: 12 + ((startId + idx) % 7),
  }));

const productsDiahinh = buildProducts(
  {
    key: 'xedapdiahinh',
    category: 'Xe đạp địa hình',
    namePrefix: 'Summit Pro',
    basePrice: 1600,
    tags: ['NEW', undefined, undefined, undefined, 'SALE'],
  },
  1
);

const productsDua = buildProducts(
  { key: 'xedua', category: 'Xe đua', namePrefix: 'Velocita', basePrice: 1850, tags: ['NEW', undefined, undefined, 'SALE'] },
  productsDiahinh.length + 1
);

const productsGap = buildProducts(
  { key: 'xedapgap', category: 'Xe đạp gấp', namePrefix: 'Urban Volt', basePrice: 950, tags: [undefined, undefined, 'SALE'] },
  productsDiahinh.length + productsDua.length + 1
);

const productsTreem = buildProducts(
  { key: 'xedaptreem', category: 'Xe đạp trẻ em', namePrefix: 'Kid Trail', basePrice: 420, tags: ['NEW'] },
  productsDiahinh.length + productsDua.length + productsGap.length + 1
);

export const bikeData = [...productsDiahinh, ...productsDua, ...productsGap, ...productsTreem];

