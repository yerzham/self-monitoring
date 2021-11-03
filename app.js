import {
  Application,
  viewEngine,
  engineFactory,
  adapterFactory,
  Session,
  oakCors,
} from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from "./middlewares/middlewares.js";

const app = new Application();

const session = new Session();

app.use(session.initMiddleware());

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(
  viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views",
  })
);

app.use(oakCors());
app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);
app.use(middleware.serveStaticFilesMiddleware);
app.use(middleware.serveFavicon);
app.use(middleware.accessMiddleware);

app.use(router.routes());

if (Deno.env.get("PORT")) app.listen({ port: Number(Deno.env.get("PORT")) });
else app.listen({ port: 7777 });
