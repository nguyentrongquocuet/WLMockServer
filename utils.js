export function getUserId(req) {
  return req.userId || req.params.userId || req.query.userId;
}

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
  const productCount = cat.pIds.length;
  return {
    ...exclude(cat, ['pIds']),
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
   cat.pIds.forEach(productId => products.set(productId, productId));
  });
  return Array.from(products.values());
}

export function getCatProducts(db, catId){
  const foundCat = getOneCatById(db, catId);
  if (foundCat) return foundCat.pIds;
}

export function addProducts(db,userId, catId, productIds) {
  if (!userId || !productIds || !catId) return false;
  const foundCat = getOneCatById(db, catId);
  if (!foundCat || foundCat.uId !== userId) return false;
  const foundProductIndex = foundCat.pIds.findIndex((productId) => productIds.includes(productId));
  if (foundProductIndex === -1) {
    foundCat.pIds.push([...productIds]);
    db.write();
    return {
      pIds: productIds, catId: catId,
    }
  }
  return false;
}

export function deleteProduct(db, userId, catId, pId) {
  try {
    if (!userId || !pId) return false;
    if (catId) {
      const foundCat = getOneCatById(db, catId);
      if (!foundCat || foundCat.uId !== userId) return false;
      const pIndex = foundCat.pIds.findIndex(productId => productId  === pId);
      if (pIndex === -1) return false;
      foundCat.pIds.splice(pIndex, 1);
    } else {
      db.data.categories = db.data.categories.map((cat) => {
        return {
          ...cat,
          pIds: cat.pIds.filter(id => id !== pId),
        }
      })
    }
    db.write();
    return {
      id: pId,
      catId: catId,
    };
  }
  catch {
    return false;
  }
}
