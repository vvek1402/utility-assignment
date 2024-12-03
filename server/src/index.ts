import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import applicationRoutes from "./routes/application.route";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
