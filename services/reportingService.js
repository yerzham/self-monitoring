import { executeQuery, executeCachedQuery } from "../database/database.js";

const isReportedForMorning = async(userID, date) => {
	const res = await executeCachedQuery("SELECT * FROM reports WHERE user_id = $1 AND reporting_date = $2 AND generic_mood_morning IS NOT NULL;", userID, date);
	if (res.rowCount === 0){
		return false;
	} else {
		return true;
	}
}

const isReportedForEvening = async(userID, date) => {
	const res = await executeCachedQuery("SELECT * FROM reports WHERE user_id = $1 AND reporting_date = $2 AND generic_mood_evening IS NOT NULL;", userID, date);
	if (res.rowCount === 0){
		return false;
	} else {
		return true;
	}
}

const setMorningData = async(userID, reportingDate, sleepDuration, sleepQuality, genericMood) => {
	const res = await executeCachedQuery("SELECT * FROM reports WHERE user_id = $1 AND reporting_date = $2;", userID, reportingDate);
	if (res.rowCount === 0){
		await executeQuery("INSERT INTO reports (user_id, reporting_date, sleep_duration, sleep_quality, generic_mood_morning, generic_mood) VALUES($1,$2,$3,$4,CAST($5 AS SMALLINT),CAST($5 AS REAL));", userID, reportingDate, sleepDuration, sleepQuality, genericMood);
	} else {
		await executeQuery("UPDATE reports SET sleep_duration = $3, sleep_quality = $4, generic_mood_morning = CAST($5 AS SMALLINT), generic_mood = CASE WHEN generic_mood_evening IS NULL THEN CAST($5 AS REAL) ELSE (CAST($5 AS REAL)+generic_mood_evening::real)/2.0 END WHERE user_id = $1 AND reporting_date = $2;", userID, reportingDate, sleepDuration, sleepQuality, genericMood);
	}
}

const setEveningData = async(userID, reportingDate, exercisesDuration, studyDuration, eatingQuality, genericMoodEvening) => {
	const res = await executeCachedQuery("SELECT * FROM reports WHERE user_id = $1 AND reporting_date = $2;", userID, reportingDate);
	if (res.rowCount === 0){
		await executeQuery("INSERT INTO reports (user_id, reporting_date, exercises_duration, study_duration, eating_quality, generic_mood_evening, generic_mood) VALUES($1,$2,$3,$4,$5,CAST($6 AS SMALLINT),CAST($6 AS REAL));", userID, reportingDate, exercisesDuration, studyDuration, eatingQuality, genericMoodEvening);
	} else {
		await executeQuery("UPDATE reports SET exercises_duration = $3, study_duration = $4, eating_quality = $5, generic_mood_evening = CAST($6 AS SMALLINT), generic_mood = CASE WHEN generic_mood_morning IS NULL THEN CAST($6 AS REAL) ELSE (CAST($6 AS REAL)+generic_mood_morning::real)/2.0 END WHERE user_id = $1 AND reporting_date = $2;", userID, reportingDate, exercisesDuration, studyDuration, eatingQuality, genericMoodEvening);
	}
}

export {isReportedForEvening, isReportedForMorning, setMorningData, setEveningData}