export default class BasicMongo {
    constructor(model) {
        this.model = model;
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        return await this.model.findOneAndUpdate({ _id: id }, data, { new: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async deleteMany(condition) {
        return await this.model.deleteMany(condition);
    }

    // borrar pero indicando como status 'inactive' realizando un update en lugar de un delete
    async deleteSoft(id) {
        return await this.model.findOneAndUpdate({ _id: id }, {
            status: 'inactive',
            deleteAt: Date.now()
        }, { new: true });
    }

    // busca por un campo en particular y devuelve un array de resultados (puede ser vacío)
    async findByField(field, value) {
        return  await this.model.find({[field]: value });
    }
}