import { FC, MouseEvent, useCallback, useEffect, useRef } from "react";
import classes from "./ContextMenu.module.scss";
import Link from "next/link";
import cn from "classnames";

interface MenuItemProps {
	key: string;
	title: string;
	onClick?: (event: MouseEvent) => void;
	href?: string;
	disabled?: boolean;
}

interface HoverMenuProps {
	menuItems: MenuItemProps[];
	closeCtxtMenu: () => void;
}

const ContextMenu: FC<HoverMenuProps> = ({ menuItems, closeCtxtMenu }) => {
	const menuRef = useRef<HTMLDivElement>(null);

	const handleDocumentClick = useCallback((event: Event) => {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			closeCtxtMenu();
		}
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleDocumentClick);
		return () => {
			document.removeEventListener("click", handleDocumentClick);
		};
	}, [handleDocumentClick]);

	return (
		<>
			<div className={classes.hoverMenu} ref={menuRef}>
				{menuItems.map((menuItem) => {
					if (menuItem.href) {
						return (
							<Link href={menuItem.href} key={menuItem.key} className={classes.menuBlock}>
								{menuItem.title}
							</Link>
						);
					} else {
						return (
							<button
								disabled={menuItem.disabled}
								key={menuItem.key}
								onClick={menuItem.onClick}
								className={classes.menuBlock}
							>
								{menuItem.title}
							</button>
						);
					}
				})}
			</div>
		</>
	);
};

export default ContextMenu;
