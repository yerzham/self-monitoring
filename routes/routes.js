import { Router } from "../deps.js";
import * as userController from "./controllers/userController.js";
import * as landingPageController from "./controllers/landingPageController.js";
import * as reportingController from "./controllers/reportingController.js";
import * as summaryController from "./controllers/summaryController.js";
import * as summaryApi from "./apis/summaryApi.js";

const router = new Router();

router.get('/auth/login', userController.showLoginForm);
router.get('/auth/registration', userController.showRegistrationForm);
router.post('/auth/login', userController.login);
router.post('/auth/registration', userController.register);
router.get('/auth/logout', userController.logout);

router.get('/', landingPageController.showLandingPage);

router.get('/behaviour/reporting', reportingController.showReportingPage);
router.post('/behaviour/reporting/morning', reportingController.postMorningReport);
router.post('/behaviour/reporting/evening', reportingController.postEveningReport);

router.get('/behaviour/summary', summaryController.showSummaryPage);
router.get('/behaviour/summary/month/:month', summaryController.getMonthData);
router.get('/behaviour/summary/week/:week', summaryController.getWeekData);

router.get('/api/summary/:year/:month/:day', summaryApi.getAveragesForAll);
router.get('/api/summary', summaryApi.getPastSevenDayAveragesForAll);

export { router };