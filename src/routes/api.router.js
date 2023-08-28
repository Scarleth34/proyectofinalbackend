import { logger } from '../utils/logger.utils.js';
import { Router } from "express";
import businessRouter from './business.router.js'
import cartsRouter from './carts.router.js'
import loggerRouter from './logger.router.js'
import ordersRouter from './orders.router.js'
import productsRouter from './products.router.js'
import usersRouter from './users.router.js'

export const logRequest = (req, res, next) => {
    logger().info(`Request: [${req.method}] ${req.originalUrl}`);
    next();
};

const router = Router();

router.use('/business', businessRouter);
router.use('/carts', cartsRouter);
router.use('/logger', loggerRouter);
router.use('/orders', ordersRouter);
router.use('/products', productsRouter);
router.use('/users', usersRouter);

export default router