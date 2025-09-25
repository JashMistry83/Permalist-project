import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST ,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const items = await db.query("SELECT * FROM todolist");

    console.log("/ GET REQ - ITEMS = ", items.rows);

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items.rows,
    });
  } catch (error) {
    console.log("Error occurs...", error);
  }
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;

    console.log("/add POST REQ - INSERT - ITEM = ", item);

    const insertItem = await db.query(
      "INSERT INTO todolist(title) VALUES($1)",
      [item]
    );

    res.redirect("/");
  } catch (error) {
    console.log("Error occurs...", error);
  }
});

app.post("/edit", async (req, res) => {
  try {
    const item = req.body;

    const titleUpdate = item.updatedItemTitle;
    const idUpdate = item.updatedItemId;

    console.log("/edit POST REQ - UPDATE - ITEM = ", item);

    const updateItem = await db.query(
      "UPDATE todolist SET title = ($1) WHERE id = ($2)",
      [titleUpdate, idUpdate]
    );

    res.redirect("/");
  } catch (error) {
    console.log("Error occurs...", error);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const itemDelete = req.body.deleteItemId;

    console.log("/delete DELETE REQ - DELETE - ITEM = ", itemDelete);

    const deleteItem = await db.query("DELETE FROM todolist WHERE id = ($1)", [
      itemDelete,
    ]);

    res.redirect("/");
  } catch (error) {
    console.log("Error occurs...", error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/`);
});
