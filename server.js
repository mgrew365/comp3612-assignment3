const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//loading painting data 
const paintings = require("./data/paintings-nested.json");


app.get("/", (req, res) => {
  res.send("Assignment 3 API is running");
});

//getting path for paintings
app.get("/api/paintings", (req, res) => {
  //paintings is array loaded (require("")) - sending as JSON
  res.json(paintings);
})

app.get("/api/painting/:id", (req, res) => {
  //reading id from url
  const id = parseInt(req.params.id, 10);
  //finding the painting which matches the id
  const painting = paintings.find((p) => p.paintingID === id);
  //in case no painting is found
  if (!painting) {
    return res.status(404).json({message: "No painting match!"});
  }
  //else
  res.json(painting);
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});