import { Router } from 'express';
import userController from '../controllers/user-controller.js';
import { body } from 'express-validator';
import validationResult from '../middlewares/validation-result.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/registration',
    body('email').isEmail().notEmpty(),
    body('password').isString().notEmpty(),
    validationResult,
    userController.registration
);
router.post('/login',
    body('email').isEmail().notEmpty(),
    body('password').isString().notEmpty(),
    validationResult,
    userController.login
);
router.post('/logout', userController.logout);

router.get('/activation/:link', userController.activation);
router.get('/refresh', userController.refresh);
router.get('/', auth, userController.getUsers);

export default router;