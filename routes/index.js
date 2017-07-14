const express = require('express');
const router = express.Router();
const storeController=require('../controllers/storeController');
const userController=require('../controllers/userController');

const { catchErrors }=require('../handlers/errorHandlers')

router.get('/',  catchErrors(storeController.getStores));

router.get('/add', userController.isLoggedIn,storeController.adPage);

router.post('/add',userController.isLoggedIn, storeController.uploadPhoto, catchErrors(storeController.resize), catchErrors(storeController.saveFormController));

router.get('/stores',  catchErrors(storeController.getStores));

router.get('/stores/:id/edit',catchErrors(storeController.editStore));

router.get('/store/:storeName',catchErrors(storeController.viewStore));

router.post('/add/:id',catchErrors(storeController.updateStore));

router.get('/tags',catchErrors(storeController.getTags));

router.get('/tags/:id',catchErrors(storeController.getEachTag));

router.get('/login',userController.loginForm);
router.get('/register',userController.registerForm);

router.post('/register',userController.checkRegisterForm, catchErrors(userController.saveUserData),
                        userController.userLogin);

router.post('/login',userController.userLogin);

router.get('/logout',userController.logout);

router.get('/account',userController.editAccount)
router.post('/account',userController.updateAccount)
module.exports = router;
