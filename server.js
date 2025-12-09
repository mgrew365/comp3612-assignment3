const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//loading painting data 
const paintings = require("./data/paintings-nested.json");
//loading artist data
const artists = require("./data/artists.json");
//loading galleries dta
const galleries = require("./data/galleries.json");


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

//ROUTE5: /api/painting/year/min/max
app.get("/api/painting/year/:min/:max", (req, res) => {
  // read min and max and convert to numbers
  const minYear = parseInt(req.params.min, 10);
  const maxYear = parseInt(req.params.max, 10);

  // filter by range
  const results = paintings.filter((p) => {
    return p.yearOfWork >= minYear && p.yearOfWork <= maxYear;
  });

  // if no paintings found
  if (results.length === 0) {
    return res
      .status(404)
      .json({ message: "No paintings found in this year range!" });
  }

  // otherwise return all matching
  res.json(results);
});

// ROUTE6: /api/painting/title/text
app.get("/api/painting/title/:text", (req, res) => {
  // get text, make it lowercase for matching
  const searchText = req.params.text.toLowerCase();

  //filtering painings by title
  const results = paintings.filter((p) => {
    //must be a title at least
    if (!p.title) return false;
    // compare in lowercase
    return p.title.toLowerCase().includes(searchText);
  });

  //if theres no matches
  if (results.length === 0) {
    return res
      .status(404)
      .json({ message: "No paintings found with that text!"});
  }
  //else
  res.json(results);
});

//ROUTE7: /api/painting/color/name
//search colour, make lowercase to compare, same concept as route 6
app.get("/api/painting/color/:name", (req, res) => {
  const searchColor = req.params.name.toLowerCase();

  const results = paintings.filter((p) => {
//get one of the many colour descriptions
    if (!p.details || !p.details.annotation || !p.details.annotation.dominantColors) {
      return false;
    }

    const dominantColors = p.details.annotation.dominantColors;

    return dominantColors.some((colorObj) => {
      return (
        colorObj.name &&
        colorObj.name.toLowerCase().includes(searchColor)
      );
    });
  });

  if (results.length === 0) {
    return res
      .status(404)
      .json({ message: "No paintings found with that color!" });
  }

  res.json(results);
});

//ROUTE8: /api/artists 
//getting all the artists
app.get("/api/:artists", (req, res) => {
  res.json(artists);
});

//ROUTE9: /api/artists/country 
//arists only from the specfic country, essintially like route 6
app.get("/api/artists/country/:country", (req, res) => {
  const searchCountry = req.params.country.toLowerCase();

  const results = artists.filter((a) => {
    if (!a.Nationality) return false;
    return a.Nationality.toLowerCase() === searchCountry;
  });

  if (results.length === 0) {
    return res
      .status(404)
      .json({ message: "No artists found from that country!" });
  }

  res.json(results);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});