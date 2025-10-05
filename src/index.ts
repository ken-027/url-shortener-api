import chalk from "chalk";
import { PORT } from "@/config/env";
import app from "./app";

app.listen(PORT, () => {
    console.log(chalk.bgYellow(" listening on port: "), chalk.yellow(PORT));
});
