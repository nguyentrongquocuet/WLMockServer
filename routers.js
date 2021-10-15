import { Router } from "express";
import { addProductToCatController, createCatController, deleteCatController, deleteProductController, editCatController, getAllCategoriesController, getAllUserProductsController, getCatByIdController, getCatProductsController, getSettingsController, synchronizeCategoriesController } from './controller.js';

const mainRoute = Router();

mainRoute.use((req, res, next) => {
  const { headers } = req;
  console.log(headers);
  req.shopId = headers['x-xowlshopid'];
  req.userId = headers['x-xowluserid'];
  console.log(req.shopId, req.userId);
  next();
})

mainRoute.get('/categories/:userId', getAllCategoriesController);

mainRoute.post('/categories/:userId', synchronizeCategoriesController);

mainRoute.get('/category/:catId', getCatByIdController);

mainRoute.post('/category/:userId', createCatController);

mainRoute.put('/category/:catId', editCatController);

mainRoute.delete('/category/:catId', deleteCatController);

mainRoute.get('/products/category/:catId', getCatProductsController);

mainRoute.get('/products/:userId', getAllUserProductsController);

mainRoute.post('/products/:userId', addProductToCatController);

mainRoute.delete('/products/:productId', deleteProductController);

mainRoute.get('/settings', getSettingsController);

export default mainRoute;
