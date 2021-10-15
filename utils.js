export class MockErr extends Error {
  status = 400;
  constructor(status = 400, message = '') {
    super(message);
    this.status = status;
  }
}

export function exclude(obj = {}, keys=[]) {
  const out = {};

  Object.keys(obj).forEach((key) => {
    if (keys.indexOf(key) === -1)  {
      out[key] = obj[key];
    }
  })
  return out;
}

export function getCats(db) {
  return db.data.categories;
}

export function getCatSummary(cat) {
  const productCount = cat.products.length;
  return {
    ...exclude(cat, ['products']),
    pCount: productCount,
  }
}

export function getCatsByUserId(db, userId) {
  return getCats(db).filter(cat => cat.uId === userId)
}

export function getCatsSummaryByUserId(db, userId) {
  return getCatsByUserId(db, userId).map(getCatSummary)
}

export function getOneCatById(db, catId) {
  return db.data.categories.find(cat => cat.id === catId);
}

export function isInvalidCat(cat) {
  if (!cat) return 'Cat is undefined';
  if (!cat.id) return 'Cat must contain id';
  if (!cat.shopId) return 'Cat must contain shopId';
  return false;
}

export function addCategory(db, cat) {
  const invalid = isInvalidCat(cat);
  if (invalid) throw new MockErr(400, invalid);
  db.data.categories.push(cat);
  db.write();
  return cat;
}

export function addCategories(db, cats) {
  if (!cats) return false;
  const invalid = cats.some(isInvalidCat);
  if (invalid) return false;
  db.data.categories.push(...cats);
  db.write();
  return cats;
}

export function editCategory(db, userId, catId, newInfo) {
  if (!userId || !catId || !newInfo) return false;
  const { title } = newInfo;
  if (!title) return false;
  const foundCat = getOneCatById(db, catId);
  if (!foundCat || foundCat.uId !== userId) return false;
  foundCat.title = title;
  db.write();
  return {
    id: foundCat.id,
    title,
  }
}

export function deleteCategory(db, userId, catId) {
  try {
    const catIndex = db.data.categories.findIndex((cat) => cat.id === catId);
    console.log(catIndex);
    if (catIndex < 0) return false;
    if (db.data.categories[catIndex].uId !== userId) return fasle;
    db.data.categories.splice(catIndex, 1);
    db.write();
    return catId;
  }
  catch {
    return false;
  }
}

export function getAllUserProducts(db, userId){
  const products = new Map();
  const cats = getCatsByUserId(db, userId);
  cats.forEach(cat => {
   cat.products.forEach(product => products.set(product.id, product));
  });
  return Array.from(products.values());
}

export function getCatProducts(db, catId){
  const foundCat = getOneCatById(db, catId);
  if (foundCat) return foundCat.products;
}

export function addProduct(db,userId, catId, productId) {
  if (!userId || !productId || !catId) return false;
  const foundCat = getOneCatById(db, catId);
  if (!foundCat || foundCat.uId !== userId) return false;
  const foundProductIndex = foundCat.products.findIndex((product) => product.id === productId);
  if (foundProductIndex === -1) {
    foundCat.products.push({
      id: productId,
    });
    db.write();
    return {
      id: productId,
      catId: catId,
    }
  }
  return false;
}

export function deleteProduct(db, userId, catId, productId) {
  try {
    if (!userId || !productId || !catId) return false;
    const foundCat = getOneCatById(db, catId);
    if (!foundCat || foundCat.uId !== userId) return false;
    const pIndex = foundCat.products.findIndex(product => product.id  === productId);
    if (pIndex === -1) return false;
    foundCat.products.splice(pIndex, 1);
    db.write();
    return {
      id: productId,
      catId: catId,
    };
  }
  catch {
    return false;
  }
}
