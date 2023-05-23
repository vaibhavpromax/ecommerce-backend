const construction_routes = require("./under_construction.routes");
const admin_routes = require("./admin.routes");

const
    router = require("express").Router();

router.use("/construction", construction_routes);
router.use("/admin", admin_routes);

module.exports = router;
