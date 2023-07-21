require('../db/conn');
const express = require('express');
const router = express.Router();
const complainController = require('../controller/complainController');

// for website
router.get('/view-complaint',complainController.viewComplain);
router.get('/view-single-complaint/:id',complainController.viewSingleComplain);
router.get('/exportpdfsim1/:id',complainController.exportPdfSim1);
router.get('/exportpdfsim2/:id',complainController.exportPdfSim2);


// for application
router.post('/create',complainController.createComplain);
router.put('/close-complaint', complainController.closeComplaint);


module.exports = router;