import ShortenerDAO from "@/db/shortener.dao";
import HTTPCodes from "@/enum/http-codes.enum";
import { Request, Response } from "express";

const urlDao = new ShortenerDAO();

/**
 * @swagger
 * /api/v1/shorten:
 *   post:
 *     summary: Create a new shortened URL
 *     description: Accepts a long URL and returns its shortened version with metadata.
 *     tags:
 *       - URL Shortener
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: The original long URL to shorten
 *                 example: "https://example.com/very/long/path"
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "6e1b77c4-9f8d-4e5b-b9a3-291db2f86d77"
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: "https://example.com/very/long/path"
 *                 shortCode:
 *                   type: string
 *                   example: "ksjdf2"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-04T12:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-04T12:00:00.000Z"
 *                 accessCount:
 *                   type: integer
 *                   example: 0
 *       400:
 *         description: Invalid request body or URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Invalid URL format"
 */

export async function addUrl(request: Request<unknown>, response: Response) {
    const addedUrl = await urlDao.addUrl(request.body.url);

    return response.status(HTTPCodes.CREATED).json(addedUrl);
}

/**
 * @swagger
 * /api/v1/shorten/{shortUrl}:
 *   get:
 *     summary: Retrieve original URL or redirect to it if `?redirect` is present
 *     tags:
 *       - URL Shortener
 *     parameters:
 *       - name: shortUrl
 *         in: path
 *         required: true
 *         description: The short code for the URL
 *         schema:
 *           type: string
 *           example: ksjdf2
 *       - name: redirect
 *         in: query
 *         required: false
 *         description: If present, redirects to the original URL instead of returning JSON
 *         schema:
 *           type: boolean
 *           example: false
 *     responses:
 *       200:
 *         description: URL found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 url:
 *                   type: string
 *                   format: uri
 *                 shortCode:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: "6e1b77c4-9f8d-4e5b-b9a3-291db2f86d77"
 *               url: "https://example.com/long-url"
 *               shortCode: "ksjdf2"
 *               createdAt: "2025-10-04T12:00:00.000Z"
 *       302:
 *         description: Redirect to the original URL if `?redirect` query is provided
 *       404:
 *         description: Short URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "URL not found"
 */
export async function getUrl(
    request: Request<{ shortUrl: string }, unknown>,
    response: Response,
) {
    const result = await urlDao.getUrl(request.params.shortUrl, true);

    if (request.query.redirect === "true") {
        return response.redirect(result!.url);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { accessCount, ...url } = result;

    return response.json(url);
}

/**
 * @swagger
 * /api/v1/shorten/{shortUrl}:
 *   delete:
 *     summary: Delete a shortened URL
 *     description: Deletes a shortened URL and all its associated metadata from the database.
 *     tags:
 *       - URL Shortener
 *     parameters:
 *       - name: shortUrl
 *         in: path
 *         required: true
 *         description: The short code of the URL to delete
 *         schema:
 *           type: string
 *           example: "ksjdf2"
 *     responses:
 *       204:
 *         description: Short URL deleted successfully (no content)
 *       404:
 *         description: Short URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "URL not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "An unexpected error occurred"
 */
export async function deleteUrl(
    request: Request<{ shortUrl: string }>,
    response: Response,
) {
    await urlDao.deleteUrl(request.params.shortUrl);

    return response.status(HTTPCodes.NO_CONTENT).send();
}

/**
 * @swagger
 * /api/v1/shorten/{shortUrl}:
 *   put:
 *     summary: Update an existing shortened URL
 *     description: Updates the original long URL associated with a given short code.
 *     tags:
 *       - URL Shortener
 *     parameters:
 *       - name: shortUrl
 *         in: path
 *         required: true
 *         description: The short code of the URL to update
 *         schema:
 *           type: string
 *           example: "ksjdf2"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: The new long URL to associate with the short code
 *                 example: "https://example.com/new-path"
 *     responses:
 *       200:
 *         description: Short URL updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "6e1b77c4-9f8d-4e5b-b9a3-291db2f86d77"
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: "https://example.com/new-path"
 *                 shortCode:
 *                   type: string
 *                   example: "ksjdf2"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-04T12:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-04T12:10:00.000Z"
 *                 accessCount:
 *                   type: integer
 *                   example: 42
 *       400:
 *         description: Invalid request body or URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Invalid URL format"
 *       404:
 *         description: Short URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "URL not found"
 */
export async function updateUrl(
    request: Request<{ shortUrl: string }>,
    response: Response,
) {
    const updatedUrl = await urlDao.updateUrl(
        request.params.shortUrl,
        request.body.url,
    );

    return response.json(updatedUrl);
}

/**
 * @swagger
 * /api/v1/shorten/{shortUrl}/stats:
 *   get:
 *     summary: Get statistics for a shortened URL
 *     description: Returns metadata such as creation date, update date, and access count for a given short URL.
 *     tags:
 *       - URL Shortener
 *     parameters:
 *       - name: shortUrl
 *         in: path
 *         required: true
 *         description: The short code for the URL to retrieve statistics for
 *         schema:
 *           type: string
 *           example: ksjdf2
 *     responses:
 *       200:
 *         description: URL statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "6e1b77c4-9f8d-4e5b-b9a3-291db2f86d77"
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: "https://example.com/long-url"
 *                 shortCode:
 *                   type: string
 *                   example: "ksjdf2"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-04T12:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-04T12:00:00.000Z"
 *                 accessCount:
 *                   type: integer
 *                   example: 42
 *       404:
 *         description: Short URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "URL not found"
 */
export async function getStats(
    request: Request<{ shortUrl: string }>,
    response: Response,
) {
    const result = await urlDao.getUrl(request.params.shortUrl);

    return response.json(result);
}
