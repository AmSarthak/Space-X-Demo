import express from "express";
import App from "../src/App";
import React from "react";
import { renderToString } from "react-dom/server";
import hbs from "handlebars";

const router = express.Router();
router.get("/", async (req, res) => {
    const theHtml = `
        <html>
        <title>SPACE-X</title>
        <h1>SPACE - X</h1>
        <div id="main">{{{main}}}</div>
        <script src="/app.js" charset="utf-8"></script>
        </body>
        </html>
        `;
        const hbsTemplate = hbs.compile(theHtml);
        const reactComp = renderToString(<App />);
        const htmlToSend = hbsTemplate({ main: reactComp });
        res.send(htmlToSend);
});
export default router;