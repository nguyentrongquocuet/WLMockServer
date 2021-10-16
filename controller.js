import { nanoid } from 'nanoid';
import {settings} from './settings.js';
import {addCategories, addCategory, addProducts, deleteCategory, deleteProduct, editCategory, getAllUserProducts, getCatProducts, getCatsByUserId, getCatsSummaryByUserId, getCatSummary, getOneCatById, getUserId, MockErr} from './utils.js';

/**
 * Get all categories of an user
 */
export function getAllCategoriesController(req, res, next) {
  const userId = getUserId(req);
  const db = req.app.db;
  const cats = getCatsByUserId(db, userId);
  return res.status(200).json({
    categories: cats,
  });
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

    if (!body) throw new MockErr(400, 'Empty body');
    const { title } = body;
    if (!title) throw new MockErr(400, 'Empty title');
    const cat = {
      id: nanoid(),
      uId: userId,
      title,
      createdAt: Date.now(),
      pIds:[],
    }
    return res.status(201).json(addCategory(db, cat));
  } 
  catch (e) {
    return next(e);
  }
}

export function createCategoriesController(req, res, next) {
  try {
    const db = req.app.db;
    const body = req.body;
    const userId = getUserId(req);

    const { categories } = body;
    console.log(body, categories);
    if (!categories) throw new MockErr(400, 'check categories');
    const cats = categories.map((rawCat) => {
      if (!rawCat.pIds) throw new MockErr(404, 'please send cate with pIds as an array');
      return {
        id: nanoid(),
        uId: userId,
        title: rawCat.title,
        createdAt: Date.now(),
        pIds: rawCat.pIds || [],
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
    const { body: { catId, title } } = req;
    const userId = getUserId(req);
    const edited = editCategory(db, userId, catId, { title });
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
    const { body: { catId } } = req;
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
    const productIds = getCatProducts(db, catId);
    if (productIds) return res.status(200).json(productIds);
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
    const { body: { catId, pIds } } = req;
    const added = addProducts(db, userId, catId, pIds)
    if (added) return res.status(201).json(added);
    throw new MockErr(404, 'Cannot add product, check userId, catId, productId');
  } 
  catch(e) {
    return next(e);
  }
}

export function deleteProductController(req, res, next) {
  try {
    const userId = getUserId(req);
    const { body: { catId, pId } } = req;
    const db = req.app.db;
    const deleted = deleteProduct(db,  userId, catId, pId);
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
