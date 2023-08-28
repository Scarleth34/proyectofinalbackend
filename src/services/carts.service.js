import cartsMongo from '../DAL/DAOs/cartsDaos/cartsMongo.js'
import productsMongo from '../DAL/DAOs/productsDaos/productsMongo.js'
import ordersMongo from '../DAL/DAOs/ordersDaos/ordersMongo.js'
import usersMongo from '../DAL/DAOs/usersDaos/usersMongo.js'
import { verifyToken } from '../utils/jwt.utils.js';

class CartsService {
    async findAll() {
        return await cartsMongo.findAll();
    }

    async findById(id) {
        return await cartsMongo.findById(id);
    }

    // se crea un carrito vacion y se le asigna el id del carrito en el modelo o esquema de usuario en el atributo cart
    async create(tokenUserId) {
        const { id } = verifyToken(tokenUserId);
        const user = await usersMongo.findById(id);
        console.log(user, id);
        if (!user) {
            return { error: 'User not found' };
        }
        const cart = await cartsMongo.create();
        const userCart = await usersMongo.update(id, { cart: cart._id });
        return { cart, userCart };
    }

    async update(id, carts) {
        return await cartsMongo.update(id, carts);
    }

    async delete(id) {
        return await cartsMongo.delete(id);
    }

    async deleteSoft(id) {
        return await cartsMongo.deleteSoft(id);
    }

    // agregamos un producto al carrito al carrito, si existe el producto, se suma la cantidad al producto existente en el carrito y se actualiza el carrito en la base de datos
    async addProduct(cid, pid, token) {
        const cart = await cartsMongo.findById(cid);
        if (!cart) {
            return { error: 'Cart not found' };
        }

        const pro = await productsMongo.findById(pid);
        if (!pro) {
            return { error: 'Product not found' };
        }

        //Usuario no puede agregar sus propios productos al carrito

        const { id } = verifyToken(token);
        const user = await usersMongo.findById(id);
        if (!user) {
            return { error: 'User not found' };
        }

        const { email } = user;
        if (email === pro.owner) {
            return { error: 'User cannot add their own products to the cart' };
        }

        const product = cart.products.find(p => p.pid._id.toString() === pid);
        if (product) {
            product.quantity++;
        } else {
            cart.products.push({ pid: pid, quantity: 1 });
        }
        const result = await cartsMongo.update(cid, cart);
        return result;
    }

    // elimina un producto del carrito, si la cantidad es mayor a 1, se resta la cantidad al producto existente en el carrito y se actualiza el carrito en la base de datos
    async removeProduct(cid, pid) {
        const cart = await cartsMongo.findById(cid);
        if (!cart) {
            return { error: 'Cart not found' };
        }

        const pro = await productsMongo.findById(pid);
        if (!pro) {
            return { error: 'Product not found' };
        }

        const product = cart.products.find(p => p.pid._id.toString() === pid);
        if (product) {
            if (product.quantity > 1) {
                product.quantity--;
            } else {
                cart.products = cart.products.filter(p => p.pid._id.toString() !== pid);
            }
        } else {
            return { error: 'Product not found in cart' };
        }
        const result = await cartsMongo.update(cid, cart);
        return result;
    }

    // eliminar todos los productos del carrito
    async removeAllProducts(cid) {
        const cart = await cartsMongo.findById(cid);
        if (!cart) {
            return { error: 'Cart not found' };
        }

        cart.products = [];
        const result = await cartsMongo.update(cid, cart);
        return result;
    }

    // actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cid, pid, quantity) {
        const cart = await cartsMongo.findById(cid);
        if (!cart) {
            return { error: 'Cart not found' };
        }

        const pro = await productsMongo.findById(pid);
        if (!pro) {
            return { error: 'Product not found' };
        }

        const product = cart.products.find(p => p.pid._id.toString() === pid);
        if (product) {
            product.quantity = quantity;
        } else {
            return { error: 'Product not found in cart' };
        }
        const result = await cartsMongo.update(cid, cart);
        return result;
    }

    async purchase(cid, tokenUserId) {
        const { id } = verifyToken(tokenUserId);
        const user = await usersMongo.findById(id);
        if (!user) {
            return { error: 'User not found' };
        }

        const cart = await cartsMongo.findById(cid);
        if (!cart) {
            return { error: 'Cart not found' };
        }

        const products = [];
        const productsNotPurchased = [];
        let amount = 0;

        for (const product of cart.products) {
            const pro = await productsMongo.findById(product.pid._id);
            if (!pro) {
                return { error: 'Product not found' };
            }
            if (pro.stock >= product.quantity) {
                pro.stock -= product.quantity;
                amount += pro.price * product.quantity;
                products.push({ pid: product.pid._id, quantity: product.quantity });
                await productsMongo.update(product.pid._id, pro);
            } else {
                productsNotPurchased.push(product.pid._id);
            }
        }

        const order = {
            order_number: Math.floor(Math.random() * 1000000).toString(),
            purchase_date: new Date(),
            amount: amount,
        }

        const result = await ordersMongo.create(order);
        if (productsNotPurchased.length > 0) {
            cart.products = cart.products.filter(p => !productsNotPurchased.includes(p.pid._id.toString()));
        } else {
            cart.products = [];
        }
        await cartsMongo.update(cid, cart);
        return result;
    }

}

const cartsService = new CartsService();

export default cartsService;