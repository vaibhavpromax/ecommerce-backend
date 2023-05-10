const construction_routes = require("./under_construction.routes");

const router = require("express").Router();

router.use("/construction", construction_routes);

module.exports = router;
