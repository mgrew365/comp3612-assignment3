const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//loading painting data 
const paintings = require("./data/paintings-nested.json");


app.get("/", (req, res) => {
  res.send("Assignment 3 API is running");
});

//ROUTE1: /api/paintings 
//getting path for paintings
app.get("/api/paintings", (req, res) => {
  //paintings is array loaded (require("")) - sending as JSON
  res.json(paintings);
})

//ROUTE2: /api/painting/:id
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

//ROUTE3: /api/painting/gallery/id
app.get("/api/painting/gallery/:id", (req, res) => {
  //getting gallery id
  const galleryId = parseInt(req.params.id, 10);
  //filtering
  const results = paintings.filter((p) => {
    //check if it exists
    return p.gallery && p.gallery.galleryID === galleryId;
  });
  //if no paitings are found
  if (results.length === 0) {
    return res
      .status(404)
      .json({message: "No paintings found for this gallery ID!"});
  }
  //else
  res.json(paintings);
});

//ROUTE4: /api/painting/artist/:id
app.get("/api/painting/artist/:id", (req, res) => {
  const artistId = parseInt(req.params.id, 10);

  const results = paintings.filter((p) => {
    return p.artist && p.artist.artistID === artistId;
  });

  if (results.length === 0) {
    return res
      .status(404)
      .json({ message: "No paintings found for this artist ID!" });
  }

  res.json(results);
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});