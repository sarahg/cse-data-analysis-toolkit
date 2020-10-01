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

// Find custom field IDs here: https://pantheon.zendesk.com/agent/admin/ticket_fields
const CUSTOM_FIELD_ID_SUPPORT_PLAN = 360026878833;

/**
 * Run a search and export the results to CSV.
 * Query strings need to be URI encoded.
 *
 * Usage examples: https://gist.github.com/sarahg/1a35fe9cc336e65261a631f9a36eca83
 */

//let query = "Secure Integration"; // Put your search string here or define it in subsequent code.
//let query = "Pantheon Enterprise Gateway";

//let query = "CSR";
let query = "custom cert";

//let assignees = ["Tom Mount", "Doug Cone", "Steven Zipfel", "Eladio Abquina"]; // Technical Services
//let assignees = ["Tara Rowell", "Chame Abbey"]; // Platform Services
//let assignees = ["Omar Bickell", "Jordana Fung"]; // Managed Updates
/*for (const human in assignees) {
  query += "assignee:%22" + assignees[human].replace(" ", "%20") + "%22";
}*/

/** You probably don't need to modify anything below this line. */

let writeStream = fs.createWriteStream(
  __dirname + "/../csv/adv-search-results/CSR-zd-search-" + Date.now() + ".csv"
);

let header =
  "Ticket ID,Subject,Support Plan,Comments,Chat,Emergency,Created date,Created time\n";

writeStream.write(header, () => {
  // Run a Zendesk search.
  let tickets = zendesk.search.list("query=" + query);

  // Retrieve details for each ticket returned by the search, and write a row to our CSV.
  Promise.all([tickets]).then(function (results) {
    for (const key in results[0]) {
      zendesk.tickets.show(results[0][key].id).then(function (ticket) {
        let emergency = tagCheck(ticket, "on-call");
        let chat = tagCheck(ticket, "chat");

        let support_plan = ticket.fields.find(
          (x) => x.id === CUSTOM_FIELD_ID_SUPPORT_PLAN
        );

        // Break the "created" date
        let created_at = new Date(ticket.created_at);
        let created_local = created_at.toLocaleString().split(", ");
        let created_date = created_local[0];
        let created_time = created_local[1];

        writeStream.write(
          `${ticket.id},"${ticket.subject.replace(/"/g, '""')}",${support_plan.value},${ticket.comment_count},${chat},${emergency},${created_date},${created_time}` + "\n" // prettier-ignore
        );
      });
    }
  });
});

/**
 * Check a ticket for a given tag.
 */
const tagCheck = (ticket, tag) => {
  return ticket.tags.includes(tag) ? "Y" : "N";
};
