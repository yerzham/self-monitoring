import { Router } from "../deps.js";
import * as userController from "./controllers/userController.js";
import * as landingPageController from "./controllers/landingPageController.js";
import * as reportingController from "./controllers/reportingController.js";

const router = new Router();

router.get('/auth/login', userController.showLoginForm);
router.get('/auth/registration', userController.showRegistrationForm);
router.post('/auth/login', userController.login)
router.post('/auth/registration', userController.register)
router.get('/auth/logout', userController.logout)

router.get('/', landingPageController.showLandingPage)
router.get('/behaviour/reporting', reportingController.showReportingPage)

export { router };