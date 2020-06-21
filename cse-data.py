def select_report():
    # Todo: Allow choice between reports.
    # For now we'll just run report scripts directly. 
    # https://pypi.org/project/inquirer/
    return

def main():
    while True:

        select_report()

        restart = input('\nWould you like to restart? [y/n]: ')
        if restart.lower() != 'yes':
            break


if __name__ == "__main__":
	main()