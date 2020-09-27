# CSE Data Analysis Toolkit

Python scripts for extracting various stats from support data.

# Installation

- Clone this repository to your local machine.
- Run `pip install && npm install` to pull down dependencies.

# Tools

## zendesk-search.js

Run an advanced search of Zendesk and export results to CSV for further analysis.

### Usage

- Modify `bin/zendesk-search.js` to include your desired search (@todo link to examples).
- Run the script: `node bin/zendesk-search.js`
- Utilize the CSV exported into `csv/advanced-search-results`

## intercom.py

Displays the chat-to-ticket conversation ratio for each CSE.

### Usage:

- Grab a CSV export from Intercom.
  ** Filter this by your desired date range, these scripts don't do that.
  ** Save this to the `csv` directory and name it `inbox-data.csv` (or modify `intercom.py` to match your data file name).

- If needed, you can modify the CSE-By-Team data set here:
  https://docs.google.com/spreadsheets/d/1ZyaQqUG3kGZLNvWALqLf6Q9NTWdKyrqt729oFNAtwvU/edit?usp=sharing
  ** Save this as a CSV to `csv/cses_by_team.csv`.
  ** If adding a new teammember, make sure their name in the CSV matches their display name in Intercom.

## core-updates.py

Visualizes the impact of core updates on support volume.

### Usage

1. Clone the 3 upstreams (drops-7, drops-8, wordpress) to ~/sites/upstreams.
2. Run `util/upstream-releases.sh` to update releases text files.
3. Run `reports/core-updates.py`.

--

Note: These scripts are only tested with Python 3. Mac OS ships with Python 2.7, so you may need an upgrade. Installing [Anaconda](https://www.anaconda.com/products/individual) is an easy way to do this.
