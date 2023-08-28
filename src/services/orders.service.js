import ordersMongo from '../DAL/DAOs/ordersDaos/ordersMongo.js'

class OrdersService {
    async findAll() {
        return await ordersMongo.findAll();
    }

    async findById(id) {
        return await ordersMongo.findById(id);
    }

    async create(orders) {
        return await ordersMongo.create(orders);
    }

    async update(id, orders) {
        return await ordersMongo.update(id, orders);
    }

    async delete(id) {
        return await ordersMongo.delete(id);
    }

    async deleteSoft(id) {
        return await ordersMongo.deleteSoft(id);
    }
}

const ordersService = new OrdersService();

export default ordersService;