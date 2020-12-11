import * as reportingService from "../../services/reportingService.js";
import { getDate } from "../../utils/date.js"
import { validate, required, isDate, isNumeric, isInt, maxNumber, minNumber } from "../../deps.js"

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
  const morningFormData = {
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

	return morningFormData;
};

const getEveningFormData = async (request) => {
  const eveningFormData = {
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

	return eveningFormData;
};

const showReportingPage = async({render, session, cookies}) => {
	let user = await session.get('user');
	const dateValue = getDate();
	const errors = cookies.get('errors') ? JSON.parse(cookies.get('errors')) : {};
	let morningFormData = await session.get('morningFormData');
	morningFormData = morningFormData ? morningFormData : {};
	let eveningFormData = await session.get('eveningFormData');
	eveningFormData = eveningFormData ? eveningFormData : {};
	render('behaviour/reporting.ejs', {
		authenticated: await session.get('authenticated'), 
		user, 
		reporting: cookies.get('reporting'), 
		errors, 
		dateToday: dateValue,
		data: Object.assign(morningFormData,eveningFormData),
		morningReported: await reportingService.isReportedForMorning(user.user_id, dateValue), 
		eveningReported: await reportingService.isReportedForEvening(user.user_id, dateValue)});
	cookies.set('reporting', null);
	cookies.set('errors', null);
	await session.set('morningFormData', null);
	await session.set('eveningFormData', null);
}

const postMorningReport = async({request, response, session, cookies}) =>{
	const user = await session.get('user');
	const data = await getMorningFormData(request);
	await session.set('morningFormData', data);
	const [passes, errors] = await validate(data, morningValidationRules, {messages: morningValidationMessages});
	if (!passes){
		cookies.set('errors', JSON.stringify(errors));
		cookies.set('reporting', "morning");
		response.redirect('/behaviour/reporting');
	} else {
		await reportingService.setMorningData(
			user.user_id, 
			data.reportingDateMorning, 
			data.sleepDuration, 
			data.sleepQuality, 
			data.genericMoodMorning
		);
		await session.set('morningFormData', null);
		response.redirect('/behaviour/reporting');
	}
}

const postEveningReport = async({request, response, session, cookies}) =>{
	const user = await session.get('user');
	const data = await getEveningFormData(request)
	await session.set('eveningFormData', data);
	const [passes, errors] = await validate(data, eveningValidationRules, {messages: eveningValidationMessages});
	if (!passes){
		cookies.set('errors', JSON.stringify(errors));
		cookies.set('reporting', "evening");
		response.redirect('/behaviour/reporting');
	} else {
		await reportingService.setEveningData(
			user.user_id, 
			data.reportingDateEvening,
			data.exercisesDuration,
			data.studyDuration,
			data.eatingQuality,
			data.genericMoodEvening
		);
		await session.set('eveningFormData', null);
		response.redirect('/behaviour/reporting');
	}
}

export {postMorningReport, showReportingPage, postEveningReport}