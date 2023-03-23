export const userAccessInString = (access: number) => {
	switch (access) {
		case 0:
			return "User";
		case 1:
			return "Moderator";
		case 2:
			return "Admin";
		case 3:
			return "Main admin";
	}
};
