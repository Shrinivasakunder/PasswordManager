const express = require('express')
const router = express.Router()

const authenticate = require('../auth/authenticate')
const validator = require("../validators/validate");
const controller = require('../controller/controller')

router.post('/register', validator.addUser, controller.register);
router.post('/login', controller.login);
router.post('/forgotPassword', controller.forgotPassword);
router.post('/otp', controller.otp);
router.put('/resetPassword', validator.updateUser, controller.resetPassword);

router.post('/', authenticate.authenticate, validator.addWebsite, controller.addWebsite)
router.get('/', authenticate.authenticate, controller.getWebsite)
router.put('/', authenticate.authenticate, validator.updateWebsite, controller.updateWebsite)
router.get('/search', authenticate.authenticate, controller.getSearch)
router.get('/copyPassword', authenticate.authenticate, controller.copyPassword)
router.get('/sync', authenticate.authenticate, controller.syncData)

// router.delete('/', authenticate.authenticate, authenticate.authenticateUser, EmployeeController.deleteEmployee)

module.exports = router


