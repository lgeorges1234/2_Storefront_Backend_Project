"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("../services/dashboard");
const dashboard = new dashboard_1.DasboardQueries();
const fiveMostWanted = async (_req, res) => {
    const result = await dashboard.fiveMostWanted();
    res.json(result);
};
const productByCategory = async (req, res) => {
    const result = await dashboard.productByCategory(req.params.category);
    res.json(result);
};
const dashboardRoutes = (app) => {
    app.get('/five_most-wanted', fiveMostWanted);
    app.get('/products_by_category/:category', productByCategory);
};
exports.default = dashboardRoutes;
