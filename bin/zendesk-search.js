#!/usr/bin/env node

"use strict";

const fs = require("fs");

// Connect to the Zendesk API.
require("dotenv").config({ path: __dirname + "/../.env" });
let Zendesk = require("zendesk-node-api");

let zendesk = new Zendesk({
  url: process.env.ZENDESK_URL,
  email: process.env.ZENDESK_EMAIL,
  token: process.env.ZENDESK_API_TOKEN,
});

/**
 * Run a search and export the results to CSV.
 * Query strings need to be URI encoded.
 *
 * Usage examples: https://gist.github.com/sarahg/1a35fe9cc336e65261a631f9a36eca83
 */

let query = ""; // Put your search string here or define it in subsequent code.

let assignees = ["Tom Mount", "Doug Cone", "Steven Zipfel", "Eladio Abquina"]; // Technical Services
//let assignees = ["Tara Rowell", "Chame Abbey"]; // Platform Services
//let assignees = ["Omar Bickell", "Jordana Fung"]; // Managed Updates

for (const human in assignees) {
  query += "assignee:%22" + assignees[human].replace(" ", "%20") + "%22";
}

/** You probably don't need to modify anything below this line. */

let writeStream = fs.createWriteStream(
  __dirname + "/../csv/adv-search-results/zd-search-" + Date.now() + ".csv"
);

let header =
  "Ticket ID,Created,Subject,Off-hours,Assignee ID,Group ID,Emergency\n";

writeStream.write(header, () => {
  zendesk.search.list("query=" + query).then(function (ticketList) {
    // @todo Measure difficulty via comment count.

    for (const key in ticketList) {
      let emergency = "N";
      if (ticketList[key].tags.includes("on-call")) {
        emergency = "Y";
      }

      let ticket = `${ticketList[key].id},${ticketList[key].created_at},"${ticketList[key].subject.replace(/"/g, '""')}",${ticketList[key].assignee_id},${ticketList[key].group_id},${emergency}`; // prettier-ignore
      writeStream.write(ticket + "\n");
    }
  });
});
