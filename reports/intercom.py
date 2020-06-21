import pandas as pd

CSV_PATH = '../csv/'
DATA = {'team' : 'cses-by-team-q2-2020.csv',
        'chats': 'inbox-data.csv'}


def chats_with_tag(chats_df, tag):
    """ 
    Return a dictionary of agents and the % of their chats containing a given tag.

    Args:
        (df) chats_df - pandas DataFrame of exported Intercom chats
        (str) tag - tag to search
    """
    
    agents_ratios = {}

    # Get all agents. For now we maintain a CSV of these.
    agents_df = pd.read_csv(CSV_PATH + DATA['team'])

    # @todo some chats have multiple agents, this will be a little off
    agents = agents_df['Name'].tolist()

    # Get each agent's ratio.
    for agent in agents:
        agent = agent.strip() # why's there trailing whitespace on these? CSV?

        # Get chats for this agent.
        agent_chats = chats_df[chats_df['Teammates participated'].fillna('').str.match(agent)]
        # Get chats with the given tag for this agent.
        converted_to_ticket = agent_chats[agent_chats['Conversation tags'].fillna('').str.match(tag)]
        
        # Calculate the percentage of chats containing this tag.
        ratio = 0
        if len(converted_to_ticket.index) > 0:
            ratio = len(agent_chats.index) / len(converted_to_ticket.index)

        agents_ratios.update({agent : str(ratio) + '%'})

    # Print the results.
    for i in agents_ratios:
        print(i, agents_ratios[i])


def main():
    chats_df = pd.read_csv(CSV_PATH + 'intercom/' + DATA['chats'])
    chats_with_tag(chats_df, 'converted-to-ticket')


if __name__ == "__main__":
	main()