import { createServer } from "http";
import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import helmet from "helmet";
dotenv.config()


async function main() {
    const app = express();
    const server = createServer(app);

    const PORT = process.env.PORT || 5000;

    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    // Routes
    // app.use("/api/auth", authRouter);


    app.get("/health", (req, res) => {
        res.json({ status: "ok", timestamp: new Date() });
    });


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
main()