import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hell World!");
})

app.listen(port, () => {
    console.log(`Video processing service is running on port http://localhost:${port}`);
});