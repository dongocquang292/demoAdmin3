
const router = require("express").Router();
const fileController = require('../controller/filesUpload.controller');
const uploadFile = require("../controller/upload");
const userController = require('../controller/user.controller');
const withAuth = require("../middleware/authJwt");
const checkRole = require("../middleware/checkRole")

router.get('/', (res, req) => {
    res.sendFile('http://localhost:8080/index.html')
})

// files
router.post('/api/files/', withAuth, uploadFile, fileController.UploadFile);
router.get('/api/files/', withAuth, fileController.getFiles);
router.get('/api/files/:id', withAuth, fileController.getOneFile);
router.patch('/api/files/:id', withAuth, fileController.updateFile);
router.delete('/api/files/:id', withAuth, fileController.deleteFile);
router.post('/api/files/share', withAuth, fileController.shareFile)

// users
router.post('/api/users/', userController.register);
router.post('/api/users/login', userController.login);
router.get('/api/users/', withAuth, userController.getUsers)
router.get('/api/users/:id', withAuth, userController.getOneUser);
router.patch('/api/users/:id', withAuth, checkRole, userController.updateUser);
router.delete('/api/users/:id', withAuth, checkRole, userController.deleteUser)
router.post('/api/users/reset', userController.resetPass);
router.post('/api/users/pagereset', userController.linkCheckReset)
module.exports = router;