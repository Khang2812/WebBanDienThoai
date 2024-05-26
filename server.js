const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        console.log("Kết nối đến database thành công!");

        //Khởi tạo server
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server đang chạy trên cổng http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Không thể kết nối đến database!", error);
        process.exit();
    }
}

startServer();