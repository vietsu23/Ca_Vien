const billRoutes = require('./bill');
const shiftRoutes = require('./shift');
const productRoutes = require('./product');
const branchRoutes = require('./branch');
const staffRoutes = require('./staff');
const inventoryRoutes = require('./inventory');
const InitRoutes = (app) => {
    app.use('/api/bills', billRoutes);
    app.use('/api/shifts', shiftRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/branches', branchRoutes);
    app.use('/api/staffs', staffRoutes);
    app.use('/api/inventories',inventoryRoutes);
};
module.exports = InitRoutes;