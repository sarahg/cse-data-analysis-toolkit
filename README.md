# CSE Data Analysis Toolkit

Python scripts for extracting various stats from support data.

# Installation

* Clone this repository to your local machine.
* Run `pip install` to pull down dependencies.

# Go get your own damn data

* Grab a CSV export from Intercom. 
  - Filter this by your desired date range, these scripts don't do that (yet).
  - Save this to the `csv` directory and name it `inbox-data.csv` (or modify `intercom.py` to match your data file name).

* If needed, you can modify the CSE-By-Team data set on [Google Sheets](
https://docs.google.com/spreadsheets/d/1ZyaQqUG3kGZLNvWALqLf6Q9NTWdKyrqt729oFNAtwvU/edit?usp=sharing).
  - Save this as a CSV to `csv/cses_by_team.csv`.
  - If adding a new teammember, make sure their name in the CSV matches their display name in Intercom.

--

Note: These scripts are only tested with Python 3. Mac OS ships with Python 2.7, so you may need an upgrade. Installing [Anaconda](https://www.anaconda.com/products/individual) is an easy way to do this.
