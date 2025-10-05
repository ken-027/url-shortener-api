import { Router } from "express";
// import { slidingWindow } from "@/middlewares/rate-limiter.middleware";
import {
    addUrl,
    deleteUrl,
    getStats,
    getUrl,
    updateUrl,
} from "@/controllers/shortener.controller";
import { validateRequest } from "@/middlewares/validation.middleware";
import { urlSchema } from "@/db/shortener.schema";

const shortenerRoutes = Router();

shortenerRoutes
    .post("/", validateRequest(urlSchema, "body"), addUrl)
    .route("/:shortUrl")
    .get(getUrl)
    .delete(deleteUrl)
    .put(validateRequest(urlSchema, "body"), updateUrl);

shortenerRoutes.route("/:shortUrl/stats").get(getStats);

export default shortenerRoutes;
