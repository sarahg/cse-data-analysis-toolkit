import pandas as pd
from datetime import date

CSV_PATH = "../csv"

# Update our lists of core releases.
# @todo
# for now just run util/upstream-releases.sh
# import subprocess
# subprocess.call(["sh", "./../util/upstream-releases.sh"])
# print()

# Load txt file of release dates and create a pandas dataframe.
cms = "wordpress"
updates_data_dir = "/Users/sarahgerman/sites/upstreams/releases/"

with open(updates_data_dir + cms + ".txt", "r") as filehandle:
    updates = [current_update.rstrip() for current_update in filehandle.readlines()]

# Set up a sorted data frame using release date as an index.
updates_df = pd.DataFrame(updates, columns=["Release date"])
updates_df = updates_df.set_index("Release date").sort_index()
updates_df.index = pd.to_datetime(updates_df.index, unit="s")

# Drop values older than 2 years ago. Intercom doesn't store data older than that.
# @todo or load chat data first and get the oldest date
two_years_ago = date.today() - pd.DateOffset(years=2)
updates_df.truncate(before=two_years_ago)

# Load chat data export.
chats_df = pd.read_csv(CSV_PATH + "/intercom/aug-2018-aug-2020.csv")

# Show total request volume for each release (release day + next 2 biz days)
# foreach release
## set the release window to 2 biz days from release time

# Show total "merge conflict" or "core update" requests (check tags)

# Visualize and output to a browser view.
