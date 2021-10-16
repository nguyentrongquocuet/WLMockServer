import { Router } from "express";
import { addProductToCatController, createCatController, createCategoriesController, deleteCatController, deleteProductController, editCatController, getAllCategoriesController, getAllUserProductsController, getCatByIdController, getCatProductsController, getSettingsController } from './controller.js';
import {getUserId, MockErr} from "./utils.js";

const mainRoute = Router();


function userIdMiddleware(req, _, next) {
  if (!getUserId(req)) return next(new MockErr(401, 'missing userid'));
  return next();
}

function catIdMiddleWare(req, _, next) {
  if (!req.body.catId) return next(new MockErr(401, 'missing catId'));
  return next();
}

mainRoute.use((req, res, next) => {
  const { headers } = req;
  console.log(headers);
  req.shopId = headers['x-xowlshopid'];
  req.userId = headers['x-xowluserid'];
  console.log(req.shopId, req.userId);
  next();
})

mainRoute.use(userIdMiddleware);

mainRoute.post('/categories/get', getAllCategoriesController);

mainRoute.post('/category', createCategoriesController);

//mainRoute.post('/category', createCatController);

mainRoute.post('/category/update', catIdMiddleWare, editCatController);

mainRoute.post('/category/delete', catIdMiddleWare, deleteCatController);

mainRoute.post('/product/add', catIdMiddleWare, addProductToCatController);

mainRoute.post('/product/delete',  deleteProductController);

mainRoute.get('/settings', getSettingsController);

export default mainRoute;
