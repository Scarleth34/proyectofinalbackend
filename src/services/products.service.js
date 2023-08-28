import productsMongo from '../DAL/DAOs/productsDaos/productsMongo.js'
import productsMocks from '../utils/mocks.utils.js';
import { verifyToken } from '../utils/jwt.utils.js';

class ProductsService {
    async findAll() {
        return await productsMongo.findAll();
    }

    async findById(id) {
        return await productsMongo.findById(id);
    }

    async create(products, token) {
        //crear un nuevo product con el owner del token y el resto de los datos del body
        const resultToken = await verifyToken(token);
        const { email } = resultToken;
        const result = await productsMongo.create({ ...products, owner: email });
        return result;
    }

    async update(id, products, token) {
        //verificar si el product es del owner del token o si el token es role admin
        const resultToken = await verifyToken(token);
        const { role, email } = resultToken;
        const resultProduct = await productsMongo.findById(id);
        const { owner } = resultProduct;
        if (role === 'admin' || email === owner) {
            const result = await productsMongo.update(id, products);
            return result;
        }
        return null;
    }

    async delete(id) {
       return await productsMongo.delete(id);
    }

    async deleteSoft(id) {
        return await productsMongo.deleteSoft(id);
    }

    async findAllMocks() {
        return productsMocks;
    }
}

const productsService = new ProductsService();

export default productsService;