const express = require("express");
const cors = require("cors");
const optoSigmaScraper = require("./optoSigmaScraper");
const thorLabsScraper = require("./thorLabsScraper");

let urlOpto =
  "https://www.optosigma.com/eu_en/optics/lenses/spherical-lenses/plano-convex-spherical-lenses/spherical-lens-bk7-plano-convex-uncoated-SLB-P.html";
let urlThor = "https://www.thorlabs.com/newgrouppage9.cfm?objectgroup_id=112";

const app = express();
app.use(cors());

app.get("/api/data", async (request, response) => {
  const optoData = await optoSigmaScraper(urlOpto);
  const thorData = await thorLabsScraper(urlThor);
  let combinedData = [...optoData, ...thorData];

  console.log("DATA: ", combinedData);
  response.json(combinedData);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
