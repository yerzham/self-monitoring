import { executeCachedQuery } from "../database/database.js";

const getMoodFor = async(userID, date) => {
	const res = await executeCachedQuery("SELECT generic_mood FROM reports WHERE user_id = $1 AND reporting_date = $2", userID, date);
	if (res.rowCount > 0)
		return res.rowsOfObjects()[0].generic_mood;
	else
		return null;
}

export {getMoodFor}