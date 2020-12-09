import * as reportingService from "../../services/reportingService.js";
import { validate, required, isDate, isNumeric, isInt, maxNumber, minNumber } from "../../deps.js"

var morningFormData = {}
var eveningFormData = {}
var errorsGlobal = {}
var reporting = "";
const morningValidationRules = {
	reportingDateMorning: [required, isDate],
	sleepDuration: [required, isNumeric, minNumber(0.0)],
	sleepQuality: [required, isInt, minNumber(0), maxNumber(5)],
	genericMoodMorning: [required, isInt, minNumber(0), maxNumber(5)]
};
const eveningValidationRules = {
	reportingDateEvening: [required, isDate],
	exercisesDuration: [required, isNumeric, minNumber(0.0)],
	studyDuration: [required, isNumeric, minNumber(0.0)],
	eatingQuality: [required, isInt, minNumber(0), maxNumber(5)],
	genericMoodEvening: [required, isInt, minNumber(0), maxNumber(5)]
};
const morningValidationMessages =  {
	"reportingDateMorning.required": "Date is required",
	"reportingDateMorning.isDate": "Date is invalid",
	"sleepDuration.required": "Sleep duration is required",
	"sleepDuration.minNumber": "Sleep duration cannot be negative",
	"sleepDuration.isNumeric": "Sleep duration must be numeric",
	"sleepQuality.minNumber": "Sleep quality must be at least 0",
	"sleepQuality.maxNumber": "Sleep quality must not be larger than 5",
	"genericMoodMorning.minNumber": "Generic mood must be at least 0",
	"genericMoodMorning.maxNumber": "Generic mood must not be larger than 5"
}
const eveningValidationMessages =  {
	"reportingDateEvening.required": "Date is required",
	"reportingDateEvening.isDate": "Date is invalid",
	"exercisesDuration.required": "Exercises duration is required",
	"exercisesDuration.minNumber": "Exercises duration cannot be negative",
	"exercisesDuration.isNumeric": "Exercises duration must be numeric",
	"studyDuration.required": "Study duration is required",
	"studyDuration.minNumber": "Study duration cannot be negative",
	"studyDuration.isNumeric": "Study duration must be numeric",
	"eatingQuality.minNumber": "Eating quality must be at least 0",
	"eatingQuality.maxNumber": "Eating quality must not be larger than 5",
	"genericMoodEvening.minNumber": "Generic mood must be at least 0",
	"genericMoodEvening.maxNumber": "Generic mood must not be larger than 5"
}

const getMorningFormData = async (request) => {
  morningFormData = {
		reportingDateMorning: "",
		sleepDuration: null,
		sleepQuality: null,
		genericMoodMorning: null,
    errors: {}
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
		morningFormData.reportingDateMorning = params.get("reporting_date_morning");
		morningFormData.sleepDuration =  parseFloat(params.get("sleep_duration"));
		morningFormData.sleepQuality = parseInt(params.get("sleep_quality"));
		morningFormData.genericMoodMorning = parseInt(params.get("generic_mood_morning"));
		if (isNaN(morningFormData.sleepDuration)) morningFormData.sleepDuration = null;
	}
};

const getEveningFormData = async (request) => {
  eveningFormData = {
		reportingDateEvening: "",
		exercisesDuration: null,
		studyDuration: null,
		eatingQuality: null,
		genericMoodEvening: null,
    errors: {}
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
		eveningFormData.reportingDateEvening = params.get("reporting_date_evening");
		eveningFormData.exercisesDuration =  parseFloat(params.get("exercises_duration"));
		eveningFormData.studyDuration = parseInt(params.get("study_duration"));
		eveningFormData.eatingQuality = parseInt(params.get("eating_quality"));
		eveningFormData.genericMoodEvening = parseInt(params.get("generic_mood_evening"));
		if (isNaN(eveningFormData.exercisesDuration)) eveningFormData.exercisesDuration = null;
		if (isNaN(eveningFormData.studyDuration)) eveningFormData.studyDuration = null;
	}
};

const showReportingPage = async({render, session}) => {
	let authenticated = await session.get('authenticated');
	let user = await session.get('user');
	var date = new Date();
	const dateValue = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
										'-' + date.getDate().toString().padStart(2, 0);
	render('behaviour/reporting.ejs', {
		authenticated, 
		user, 
		reporting, 
		errors: errorsGlobal, 
		dateToday: dateValue,
		data: Object.assign(morningFormData,eveningFormData),
		morningReported: await reportingService.isReportedForMorning(user.user_id, dateValue), 
		eveningReported: await reportingService.isReportedForEvening(user.user_id, dateValue)});
	reporting = "";
	errorsGlobal = {};
	morningFormData = {};
	eveningFormData = {};
}

const postMorningReport = async({request, response, session}) =>{
	let user = await session.get('user');
	await getMorningFormData(request);
	const [passes, errors] = await validate(morningFormData, morningValidationRules, {messages: morningValidationMessages});
	errorsGlobal = errors;
	if (!passes){
		reporting = "morning";
		response.redirect('/behaviour/reporting');
	} else {
		await reportingService.setMorningData(
			user.user_id, 
			morningFormData.reportingDateMorning, 
			morningFormData.sleepDuration, 
			morningFormData.sleepQuality, 
			morningFormData.genericMoodMorning
		);
		morningFormData = {};
		response.redirect('/behaviour/reporting');
	}
}

const postEveningReport = async({request, response, session}) =>{
	let user = await session.get('user');
	await getEveningFormData(request);
	const [passes, errors] = await validate(eveningFormData, eveningValidationRules, {messages: eveningValidationMessages});
	errorsGlobal = errors;
	if (!passes){
		reporting = "evening";
		response.redirect('/behaviour/reporting');
	} else {
		await reportingService.setEveningData(
			user.user_id, 
			eveningFormData.reportingDateEvening,
			eveningFormData.exercisesDuration,
			eveningFormData.studyDuration,
			eveningFormData.eatingQuality,
			eveningFormData.genericMoodEvening
		);
		eveningFormData = {};
		response.redirect('/behaviour/reporting');
	}
}

export {postMorningReport, showReportingPage, postEveningReport}