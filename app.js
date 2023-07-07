const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const shortid = require("shortid");
const Url = require("./models/Url");
const utils = require("./util/Utils");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Db Connected`);
  })
  .catch((err) => {
    console.log(err.message);
  });

// Route handler for the root URL ("/")
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>URL Shortener</h1>
        <form action="/shorten" method="post">
          <input type="text" name="origUrl" placeholder="Enter URL" required>
          <button type="submit">Shorten URL</button>
        </form>
      </body>
    </html>
  `);
});

// URL shortener endpoint
app.post("/shorten", async (req, res) => {
  const { origUrl } = req.body;
  console.log("HEREss", req);

  const base = process.env.DOMAIN_URL;

  const urlId = shortid.generate();
  if (utils.validateUrl(origUrl)) {
    try {
      const shortUrl = `${base}/${urlId}`;

      const url = new Url({
        origUrl,
        shortUrl,
        urlId,
        date: new Date(),
      });

      await url.save();
      res.json(url.urlId); // Return the URL key (urlId)
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});

  // get all saved URLs
  app.get("/all", async (req, res) => {
    try {
      const data = await Url.find();
      res.json(data);
    } catch (error) {
      res.status(500).json("Server Error");
    }
  });
  

  
// redirect endpoint
app.get("/:urlId", async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    console.log(url)
    if (url) {
      url.clicks++;
      url.save();
      return res.redirect(url.origUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});
app.get("/show/:urlId", async (req, res) => {
    try {
      const url = await Url.findOne({ urlId: req.params.urlId });
      console.log(url)
      if (url) {
        url.clicks++;
        url.save();
        return res.json(url.origUrl);
      } else res.status(404).json("Not found");
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  });
// Port Listenning on 80
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});