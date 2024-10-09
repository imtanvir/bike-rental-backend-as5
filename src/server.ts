import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import superAdmin from "./app/DB";

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    // await mongoose.connect("mongodb://localhost:27017");
    superAdmin();
    app.listen(config.port, () => {
      console.log(`Bike Rental backend listening on port ${config.port}`);
    });
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}

main();
