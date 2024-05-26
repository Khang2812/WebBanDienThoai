const { ObjectId } = require("mongodb");
class CartService {
    constructor(client) {
        this.Cart = client.db().collection("carts");
    }

    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractCartData(payload) {
        const createdAt = new Date();
        const Cart = {
            user_id: payload.user_id,
            product_id: payload.product_id,
            order_date: createdAt,
            quantity: payload.quantity,
        };
        return Cart;
    }
    async find(filter) {
        const cursor = await this.Cart.find(filter);
        return await cursor.toArray();
    }

    async create(payload) {
        const Cart = this.extractCartData(payload);
        const result = await this.Cart.findOneAndUpdate(
            Cart,
            { $set: Cart },
            { returnDocument: "after", upsert: true }
        );


        return result;
    }

    async findById(user_id) {
        return await this.Cart.findOne({
            user_id: ObjectId.isValid(user_id) ? new ObjectId(user_id) : null,
        });
    }

    async update(payload) {
        const filter = {
            user_id: payload.user_id,
            product_id: payload.product_id
        };
        const update = this.extractCartData(payload);
        const result = await this.Cart.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(payload) {
        console.log(JSON.stringify.payload)
        const result = await this.Cart.findOneAndDelete({
            user_id: payload.user_id,
            product_id: payload.product_id,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Cart.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = CartService;