import { Router } from "../deps.js";
import * as userController from "./controllers/userController.js";
import * as landingPageController from "./controllers/landingPageController.js";

const router = new Router();

router.get('/auth/login', userController.showLoginForm);
router.get('/auth/registration', userController.showRegistrationForm);
router.post('/auth/registration', userController.register)
router.post('/auth/login', userController.login)
router.get('/', landingPageController.showLandingPage)
router.get('/auth/logout', userController.logout)

export { router };