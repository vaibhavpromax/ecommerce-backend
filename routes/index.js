const construction_routes = require("./under_construction.routes");
const admin_routes = require("./admin.routes");
const user_routes = require("./user.routes");
const product_routes = require("./product.routes");
const order_routes = require("./order.routes");
const payment_routes = require("./payment.routes");
const router = require("express").Router();

router.use("/construction", construction_routes);
router.use("/admin", admin_routes);
router.use("/user", user_routes);
router.use("/order", order_routes);
router.use("/products", product_routes);
router.use("/payment", payment_routes);

module.exports = router;
