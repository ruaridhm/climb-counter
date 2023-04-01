const write = ({ time, date, count }) => {
  const { MongoClient } = require("mongodb");
  require("dotenv").config();

  const url = `mongodb+srv://${process.env.mongoUsername}:${process.env.mongoPassword}@${process.env.mongoClusterUrl}/?retryWrites=true&w=majority`;
  const client = new MongoClient(url);

  async function run() {
    try {
      const database = await client.db("data");
      const collection = database.collection("data");
      const query = { [date]: { $exists: true } };
      const update = { $push: { [date]: { time, count } } };
      const options = { upsert: true };

      collection.updateOne(query, update, options, (err, result) => {
        if (err) throw err;
        console.log(`${result.matchedCount} document(s) matched the query.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
      });
    } finally {
      console.log(
        `{ time: ${time}, count: ${count} } added to array ${date} in DB`
      );
      await client.close();
    }
  }
  run().catch(console.dir);
};

module.exports = { write };
