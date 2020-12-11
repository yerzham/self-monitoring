import { executeCachedQuery } from "../database/database.js";

const selectQuery = "\
SELECT AVG(sleep_duration)::numeric(10,2) as sleep_duration, \
			 AVG(study_duration)::numeric(10,2) as study_duration, \
			 AVG(exercises_duration)::numeric(10,2) as exercises_duration, \
			 AVG(sleep_quality)::numeric(10,2) as sleep_quality, \
			 AVG(eating_quality)::numeric(10,2) as eating_quality,\
			 AVG(generic_mood)::numeric(10,2) as generic_mood "

const getAvaragesForWeek = async(userID, week) => {
	const res = await executeCachedQuery(selectQuery +
		"FROM reports WHERE user_id = $1 AND EXTRACT('week' FROM reporting_date) = $2;", 
		userID, parseInt(week));
	return res.rowsOfObjects();
}

const getAveragesForMonth = async(userID, month) => {
	const res = await executeCachedQuery(selectQuery +
		"FROM reports WHERE user_id = $1 AND EXTRACT(MONTH FROM reporting_date) = $2;", 
		userID, parseInt(month));
	return res.rowsOfObjects();
}

const getAveragesForAll = async(date) => {
	const res = await executeCachedQuery(selectQuery +
		"FROM reports WHERE reporting_date = $1;",
		date);
	return res.rowsOfObjects()[0];
}

const getAveragesForAllBetween = async(date1, date2) => {
	const res = await executeCachedQuery(selectQuery +
		"FROM reports WHERE reporting_date >= $1 AND reporting_date <= $2;", 
		date1, date2);
	return res.rowsOfObjects()[0];
}

export {getAvaragesForWeek, getAveragesForMonth, getAveragesForAll, getAveragesForAllBetween}