import { createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import fetch from "node-fetch";

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
const wahapedia_csv_filenames = [
  "Factions.csv",
  "Source.csv",
  "Datasheets.csv",
  "Datasheets_abilities.csv",
  "Datasheets_damage.csv",
  "Datasheets_keywords.csv",
  "Datasheets_models.csv",
  "Datasheets_options.csv",
  "Datasheets_wargear.csv",
  "Datasheets_stratagems.csv",
  "Wargear.csv",
  "Wargear_list.csv",
  "Stratagems.csv",
  "StratagemPhases.csv",
  "Abilities.csv",
  "Warlord_traits.csv",
  "PsychicPowers.csv",
];

wahapedia_csv_filenames.forEach((filename) => {
  (async () => {
    try {
      await downloadFile({
        url: wahapedia_csv_baseurl + filename,
        path: wahapedia_csv_folder + filename,
      });
    } catch (err) {
      console.log(err);
    }
  })();
});
