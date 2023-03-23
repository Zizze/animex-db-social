export interface IUserMenu {
	name: string;
	href?: string;
	image?: "string" | React.ReactNode;
}

export const userMenu: IUserMenu[] = [
	{
		name: "My profile",
		href: "/profile",
	},
	{
		name: "Admin panel",
		href: "/admin-panel",
	},
	{
		name: "Messages",
		href: "/messages",
	},
	{
		name: "Friends",
		href: "/friends",
	},
	{
		name: "Settings",
	},
	{
		name: "Logout",
	},
];
