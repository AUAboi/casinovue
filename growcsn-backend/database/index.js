const mongoose = require('mongoose');
const CrashSeed = require('./models/CrashSeed');
const crypto = require('crypto');
const RollSeed = require("./models/RollSeed"); // adjust path as needed


// Set mongoose mode to strict and deactive auto indexing
mongoose.set('strictQuery', true);
mongoose.set('autoIndex', false);

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        await seedCrashSeedIfEmpty()
        await seedRollSeedIfEmpty()
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

const seedCrashSeedIfEmpty = async () => {
  const count = await CrashSeed.countDocuments({ state: "created" });
  if (count === 0) {
    await CrashSeed.create({
      seedPublic: crypto.randomBytes(8).toString("hex"),
      seedServer: crypto.randomBytes(24).toString("hex"),
      hash: crypto.createHash("sha256").update(crypto.randomBytes(24)).digest("hex"),
      state: "created",
    });
    console.log("Initial CrashSeed created!");
  }
}
const seedRollSeedIfEmpty = async () => {
  const count = await RollSeed.countDocuments({ state: "created" });
  if (count === 0) {
    const serverSeed = crypto.randomBytes(24).toString("hex");
    await RollSeed.create({
      seedPublic: crypto.randomBytes(8).toString("hex"),
      seedServer: serverSeed,
      hash: crypto.createHash("sha256").update(serverSeed).digest("hex"),
      state: "created", // optional because default is already 'created'
    });
    console.log("Initial RollSeed created!");
  }
};
module.exports = connectDB;

