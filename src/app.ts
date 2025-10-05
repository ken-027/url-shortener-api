import express from "express";

import errorHandler from "@/middlewares/error-handler.middleware";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import NOT_FOUND from "@/middlewares/not-found.middleware";
import cors from "cors";
import { ALLOWED_ORIGINS, PRODUCTION } from "@/config/env";
// import helmet from "helmet";
// import morgan from "morgan";
// import logger from "@/middlewares/logger.middleware";
import passport from "passport";
import fs from "fs";
import path from "path";

// import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger";
import shortenerRoutes from "./routes/v1/shortener.route";

const prefixRoute = "/api/v1";

export const app = express();

app.set("trust proxy", true);
// app.use(helmet());
app.use(express.static(path.join(__dirname, "../public")));
// app.use(

app.use(
    "/swagger-ui",
    express.static(path.join(__dirname, "node_modules", "swagger-ui-dist")),
);

app.get("/swagger.json", (_req, res) => {
    res.json(
        PRODUCTION
            ? JSON.parse(
                  fs.readFileSync(
                      path.join(__dirname, "./swagger.json"),
                      "utf-8",
                  ),
              )
            : swaggerSpec,
    );
});

app.get("/api-docs", (_req, res) => {
    res.sendFile(path.join(__dirname, "./templates/swagger.html"));
});
app.use("/api", cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use(`${prefixRoute}/shorten`, shortenerRoutes);

app.all("/*splat", NOT_FOUND);
app.use(errorHandler);

export default app;
