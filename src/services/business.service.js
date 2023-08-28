import businessMongo from '../DAL/DAOs/businessDaos/businessMongo.js'

class BusinessService {
    async findAll() {
        return await businessMongo.findAll();
    }

    async findById(id) {
        return await businessMongo.findById(id);
    }

    async create(business) {
        return await businessMongo.create(business);
    }

    async update(id, business) {
        return await businessMongo.update(id, business);
    }

    async delete(id) {
        return await businessMongo.delete(id);
    }

    async deleteSoft(id) {
        return await businessMongo.deleteSoft(id);
    }
}

const businessService = new BusinessService();

export default businessService;