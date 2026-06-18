import { app } from "./src/app.js";
import { port } from "./src/config/index.js";
import logger from "./src/utils/logger.js";

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
})
