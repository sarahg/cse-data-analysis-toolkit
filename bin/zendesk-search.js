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
  "Ticket ID,Created,Subject,Assignee ID,Group ID,Comment Count,Chat,Emergency,Support Plan\n";

writeStream.write(header, () => {
  let ticketIDs = [];
  // Run a Zendesk search.
  let allTickets = zendesk.search
    .list("query=" + query)
    .then(function (ticketList) {
      for (const key in ticketList) {
        ticketIDs.push(ticketList[key].id);
      }
      return ticketIDs;
    });

  // Retrieve ticket details for tickets returned by search, and write the row to our CSV.
  Promise.all([allTickets]).then(function (ticketIDs) {
    for (const tid in ticketIDs[0]) {
      zendesk.tickets.show(ticketIDs[0][tid]).then(function (ticket) {
        let emergency = tagCheck(ticket, "on-call");
        let chat = tagCheck(ticket, "chat");

        let support_plan = ticket.fields.find(
          (x) => x.id === CUSTOM_FIELD_ID_SUPPORT_PLAN
        );

        writeStream.write(
          `${ticket.id},${ticket.created_at},"${ticket.subject.replace(/"/g, '""')}",${ticket.assignee_id},${ticket.group_id},${ticket.comment_count},${chat},${emergency},${support_plan.value}` + "\n" // prettier-ignore
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
