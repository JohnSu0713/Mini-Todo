// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

// Default list item
// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

// Connect to DB
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

// Set schema
const itemsSchema = {
  name: String,
};

// Create Collection
const Item = mongoose.model("Item", itemsSchema);

// Create default items
const defaultItem1 = new Item({
  name: "Welcome to your todo list!",
});
const defaultItem2 = new Item({
  name: "Click button + to add a new task.",
});
const defaultItem3 = new Item({
  name: "<- Check the checkbox mark as complete!",
});
const defaultList = [defaultItem1, defaultItem2, defaultItem3];

// Custom item
const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

// Insert many into DB

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET function for home route
app.get("/", function (req, res) {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultList, (err) => {
        if (err) {
          console.log("DB Err");
        } else console.log("DB Connected successfully!");
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

//POST function for home route
app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

// DELETE Item
app.post("/delete", (req, res) => {
  const checkedId = req.body.checkbox;
  const listName = req.body.listName;
  console.log(listName);
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedId, (err) => {
      if (!err) {
        console.log("Successful Delete!");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

//GET custom route for Work route
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultList,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // Show Existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

//POST function for home route
app.post("/work", function (req, res) {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

//GET function for About route
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3033, function () {
  console.log("Server is running on port 3033");
});
