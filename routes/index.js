const express = require('express');
const router = express.Router();
const storeController=require('../controllers/storeController');

const { catchErrors }=require('../handlers/errorHandlers')

router.get('/',  catchErrors(storeController.getStores));

router.get('/add', storeController.addPage);

router.post('/add', catchErrors(storeController.saveFormController));

router.get('/stores',  catchErrors(storeController.getStores));
module.exports = router;
