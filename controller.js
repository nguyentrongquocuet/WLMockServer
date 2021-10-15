import { nanoid } from 'nanoid';
import {settings} from './settings.js';
import {addCategories, addCategory, addProduct, deleteCategory, deleteProduct, editCategory, getAllUserProducts, getCatProducts, getCatsByUserId, getCatsSummaryByUserId, getCatSummary, getOneCatById, MockErr} from './utils.js';

function getUserId(req) {
  return req.userId || req.params.userId || req.query.userId;
}

/**
 * Get all categories of an user
 */
export function getAllCategoriesController(req, res, next) {
  const userId = getUserId(req);
  const db = req.app.db;
  const withProduct = req.query.withProduct;
  if (!withProduct)
    return res.status(200).json(getCatsSummaryByUserId(db, userId));
  return res.status(200).json(getCatsByUserId(db, userId));
}

/**
 * Get on cat summary
 */
export function getCatByIdController(req, res, next) {
  const catId = req.params.catId;
  const db = req.app.db;
  const foundCat = getOneCatById(db, catId);
  if (foundCat) {
    return res.status(200).json(getCatSummary(foundCat));
  }
  next(new MockErr(404, 'Cat not found'));
}

/**
 * Create cat
 */
export function createCatController(req, res, next) {
  try {
    const db = req.app.db;
    const body = req.body;
    const userId = getUserId(req);

    if (!userId) throw new MockErr(401, 'Invalid credentials(No userId)');

    if (!body) throw new MockErr(400, 'Empty body');
    const { title, shopId } = body;
    if (!title) throw new MockErr(400, 'Empty title');
    const cat = {
      id: nanoid(),
      uId: userId,
      title,
      createdAt: Date.now(),
      products:[],
      shopId,
    }
    return res.status(201).json(addCategory(db, cat));
  } 
  catch (e) {
    return next(e);
  }
}

export function synchronizeCategoriesController(req, res, next) {
  try {
    const db = req.app.db;
    const body = req.body;
    const userId = getUserId(req);

    const shopId = req.shopId;
    const { categories } = body;
    console.log(body, categories);
    if (!categories) throw new MockErr(400, 'check categories');
    const cats = categories.map((rawCat) => {
      return {
        id: nanoid(),
        uId: userId,
        shopId: shopId,
        title: rawCat.title,
        createdAt: Date.now(),
        products: rawCat.products,
      }
    })
    const added = addCategories(db, cats);
    if (added) return res.status(201).json(added);
    throw new MockErr(400, 'check your request');
  } catch (e) {
    return next(e);
  }
}

export function editCatController(req, res, next) {
  try {
    const db = req.app.db;
    const body = req.body;
    const catId = req.params.catId;
    const userId = getUserId(req);
    const edited = editCategory(db, userId, catId, body);
    console.log('edited', edited);
    if (edited) return res.status(200).json(edited);
    throw new MockErr(404, 'Cannot edit, check userId, catId');
  } 
  catch (e) {
    return next(e);
  }
}

export function deleteCatController(req, res, next) {
  try {
    const db = req.app.db;
    const catId = req.params.catId;
    const userId = getUserId(req);
    const deletedId = deleteCategory(db,userId, catId);
    if (deletedId) {
      return res.status(200).json({
        id: deletedId,
      });
    }
    else {
      throw new MockErr(404, 'Cat not found');
    }
  } 
  catch (e) {
    return next(e);
  }
}

export function getCatProductsController(req, res, next) {
  try {
    const catId = req.params.catId;
    const db = req.app.db;
    const products = getCatProducts(db, catId);
    if (products) return res.status(200).json(products);
    throw new MockErr(404, 'Cat not found');
  } 
  catch(e) {
    return next(e);
  }
}

export function getAllUserProductsController(req, res, next) {
  try {
    const userId = getUserId(req);
    const db = req.app.db;
    return res.status(200).json(getAllUserProducts(db, userId));
  } 
  catch(e) {
    return next(e);
  }
}

export function addProductToCatController(req, res, next) {
  try {
    const userId = getUserId(req);
    const db = req.app.db;
    const body = req.body;
    const { pId, catId } = body;
    const added = addProduct(db, userId, catId, pId)
    if (added) return res.status(201).json(added);
    throw new MockErr(404, 'Cannot add product, check userId, catId, productId');
  } 
  catch(e) {
    return next(e);
  }
}

export function deleteProductController(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = getUserId(req);
    const catId = req.query.catId;
    const db = req.app.db;
    const deleted = deleteProduct(db,  userId, catId, productId);
    if (deleted) return res.status(200).json(deleted);
    throw new MockErr(404, 'Cannot delete product, check userId, catId, productId');
  } 
  catch(e) {
    return next(e);
  }
}

export function getSettingsController(req, res, next) {
  return res.status(200).json(settings);
}
