const { mongoPass } = require("./environment");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://yanusetiawan:${mongoPass}@coffee-shop.dcn7s1t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = {
  client,
  error: client.db("log").collection("error"),
};
