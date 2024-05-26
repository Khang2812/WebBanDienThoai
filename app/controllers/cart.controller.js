const ProductService = require("../services/product.service");
const CartService = require("../services/cart.service");

const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


//Tạo và lưu trữ một user mới
exports.create = async (req, res, next) => {
    if (!req.body?.user_id) {
        return next(new ApiError(400, "User không được để trống"));
    }
    if (!req.body?.product_id) {
        return next(new ApiError(400, "Sản phẩm không được để trống"));
    }
    if (!req.body?.quantity) {
        return next(new ApiError(400, "Số lượng không được để trống"));
    }
    try {
        const cartService = new CartService(MongoDB.client);
        const productService = new ProductService(MongoDB.client);
        const filter = {
            user_id: req.body.user_id,
            product_id: req.body.product_id
        };
        const result = await cartService.find(filter)
        product = await productService.findById(req.body.product_id);
        
        if (result == '') {
            await cartService.create(req.body);
            return res.send({message: `Bạn đã thêm sản phẩm ${product.name}`});
        } else if (product.quantity >= result[0].quantity + 1){
                result[0].quantity++
                await cartService.update(result[0]);
                return res.send( {message: `Bạn đã thêm sản phẩm ${product.name}`});
        }else return res.send({message:`Số lượng sản phẩm ${product.name} đã đạt giới hạn` });
    } catch (error) {
        return next(
            new ApiError(500, `Đã xảy ra lỗi khi thêm vào giỏ hàngg`)
        );
    }
};

exports.findAll = async (req, res, next) => {
    if (!req.body.user_id) {
        return next(new ApiError(400, `User id ${JSON.stringify(req.body)} không được để trống`));
    }
    let documents = [];
    try {
        const cartService = new CartService(MongoDB.client);
        documents = await cartService.find(req.body);

    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi truy xuất giỏ hàng")
        );
    }
    return res.send(documents);
};


// Cập nhật giỏ hàng theo id
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu để cập nhật không được để trống"));
    }
    try {
        const cartService = new CartService(MongoDB.client);
        const result = await cartService.update(req.body);
        if (!result) {
            return next(new ApiError(404, `Sản phẩm không được tìm thấy `));
        }
        return res.send({ message: `Sản phẩm đã được cập nhật thành công` });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật sản phẩm với id=${error}`)
        );
    }
};

// Xóa sản phẩm theo id
exports.delete = async (req, res, next) => {
    if (!req.body?.user_id) {
        return next(new ApiError(400, `Lỗi khi xoá sản phẩm khỏi giỏ hàng ${req.body.user_id}`));
    }
    try {
        const cartService = new CartService(MongoDB.client);
        const result = await cartService.delete(req.body);
        if (!result) {
            return next(new ApiError(404, "Sản phẩm không được tìm thấy"));
        }
        return res.send({ message: "Sản phẩm đã được xóa thành công" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa sản phẩm`
            )
        );
    }
};

// Xóa tất cả các sản phẩm từ CSDL
exports.payment = async (req, res, next) => {
    try {
        console.log(req.params)
        const productService = new ProductService(MongoDB.client);
        const cartService = new CartService(MongoDB.client);
        req.body.forEach(async (item) => {
            const productId = item.product_id;
            const quantity = item.quantity;
            const result = await productService.findById(productId);
            result.quantity = result.quantity - quantity;
            await productService.update(productId, result);

            await cartService.delete({
                user_id: req.params.id,
                product_id: item.product_id
            });
        });
        return res.send({
            message: ` sản phẩm đã thanh toán xóa thành công`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả sản phẩm")
        );
    }
}; 