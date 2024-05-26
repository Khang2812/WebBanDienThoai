const ProductService = require("../services/product.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
//Tạo và lưu trữ một sản phẩm mới
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Tên không được để trống"));
    }

    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo sản phẩm mới"+error)
        );
    }
}; 

// Truy xuất tất cả các sản phẩm từ cơ sở dữ liệu
exports.findAll =  async (req, res, next) => {
    let documents = [];

    try {
        const productService = new ProductService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await productService.findByName(name);
        } else {
            documents = await productService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi truy xuất sản phẩm")
        );
    }

    return res.send(documents);
}; 

// Tìm một sản phẩm duy nhất với một id
exports.findOne = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Sản phẩm không được tìm thấy"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất sản phẩm với id=${req.params.id}`
            )
        );
    }
}; 

// Cập nhật sản phẩm theo id
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu để cập nhật không được để trống"));
    }

    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Sản phẩm không được tìm thấy"));
        }
        return res.send({ message: "Sản phẩm đã được cập nhật thành công"});
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật sản phẩm với id=${req.params.id}`)
        );
    }
}; 

// Xóa sản phẩm theo id
exports.delete = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Sản phẩm không được tìm thấy"));
        }
        return res.send({ message: "Sản phẩm đã được xóa thành công"});
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa sản phẩm với id=${req.params.id}`
            )
        );
    }
}; 

// Xóa tất cả các sản phẩm từ CSDL
exports.deleteAll = async (_req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const deletedCount = await productService.deleteAll();
        return res.send({
            message: `${deletedCount} sản phẩm đã được xóa thành công`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả sản phẩm")
        );
    }
}; 
