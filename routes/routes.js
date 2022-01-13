const express = require('express')
const router = express.Router()

const authenticate = require('../auth/authenticate')
const validator = require("../validators/validate");
const controller = require('../controller/controller')

router.post('/register', validator.addUser, controller.register);
router.post('/login', controller.login);
router.post('/forgotPassword', controller.forgotPassword);
router.post('/otp', controller.otp);
router.put('/resetPassword/:id', validator.updateUser, controller.resetPassword);

router.get('/', authenticate.authenticate, controller.getWebsite)
router.post('/addWebsite', authenticate.authenticate, validator.addWebsite, controller.addWebsite)
router.put('/:id', authenticate.authenticate, validator.updateWebsite, controller.updateWebsite)
// router.delete('/', authenticate.authenticate, authenticate.authenticateUser, EmployeeController.deleteEmployee)

module.exports = router


