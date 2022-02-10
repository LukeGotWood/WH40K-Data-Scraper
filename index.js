import { createWriteStream, writeFile } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import fetch from "node-fetch";
import csvtojson from "csvtojson";

const downloadFile = async ({ url, path }) => {
  const streamPipeline = promisify(pipeline);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Unexpected response: ${res.statusText}\nurl: ${url}`);
  }

  await streamPipeline(res.body, createWriteStream(path));
};

const wahapedia_csv_baseurl = "https://wahapedia.ru/wh40k9ed/";
const wahapedia_csv_folder = "./wahapedia-csv/";
const wahapedia_json_folder = "./wahapedia-json/";
const wahapedia_csv_filenames = [
  "Factions",
  "Source",
  "Datasheets",
  "Datasheets_abilities",
  "Datasheets_damage",
  "Datasheets_keywords",
  "Datasheets_models",
  "Datasheets_options",
  "Datasheets_wargear",
  "Datasheets_stratagems",
  "Wargear",
  "Wargear_list",
  "Stratagems",
  "StratagemPhases",
  "Abilities",
  "Warlord_traits",
  "PsychicPowers",
];

wahapedia_csv_filenames.forEach((filename) => {
  (async () => {
    try {
      await downloadFile({
        url: wahapedia_csv_baseurl + filename + ".csv",
        path: wahapedia_csv_folder + filename + ".csv",
      });
    } catch (err) {
      console.log(err);
    }

    let jsonObj = [];

    csvtojson({
      delimiter: "|"
    })
      .fromFile(wahapedia_csv_folder + filename + ".csv")
      .preFileLine((fileLineString, lineIdx) => {
          return fileLineString.slice(0, -1);
      })
      .then((obj) => {
        writeFile(
          wahapedia_json_folder + filename + ".json",
          JSON.stringify(obj, null, 4),
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  })();
});
