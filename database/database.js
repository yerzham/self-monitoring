import { config } from "../config/config.js";
import { Pool } from "../deps.js";

const CONCURRENT_CONNECTIONS = 5;
const connectionPool = new Pool(config.database, CONCURRENT_CONNECTIONS);

let cache = {};

const executeQuery = async (query, ...params) => {
	if (query.startsWith("INSERT") || query.startsWith("UPDATE")){
		cache = {}
	}
  const client = await connectionPool.connect();
  try {
    const res = await client.query(query, ...params);
    return res;
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }

  return [];
};

const executeCachedQuery = async (query, ...params) => {
	if (query.startsWith("INSERT") || query.startsWith("UPDATE")){
		cache = {}
	}
  const key = query + params.reduce((acc, o) => acc + "-" + o, "");
  if (cache[key]) {
    return cache[key];
  }

  const res = await executeQuery(query, ...params);
  cache[key] = res;

  return res;
};

export { executeCachedQuery, executeQuery };
