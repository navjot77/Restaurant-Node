const express = require('express');
const router = express.Router();
const storeController=require('../controllers/storeController');

const { catchErrors }=require('../handlers/errorHandlers')

router.get('/',  catchErrors(storeController.getStores));

router.get('/add', storeController.adPage);

router.post('/add', storeController.uploadPhoto, catchErrors(storeController.resize), catchErrors(storeController.saveFormController));

router.get('/stores',  catchErrors(storeController.getStores));

router.get('/stores/:id/edit',catchErrors(storeController.editStore));

router.get('/store/:storeName',catchErrors(storeController.viewStore));

router.post('/add/:id',catchErrors(storeController.updateStore));

router.get('/tags',catchErrors(storeController.getTags));

router.get('/tags/:id',catchErrors(storeController.getEachTag));


module.exports = router;
