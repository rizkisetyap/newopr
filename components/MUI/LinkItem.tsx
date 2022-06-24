import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import React, { FC, ReactNode } from "react";
interface IProps {
  href: string;
  Icon: ReactNode;
  text: string;
}
const LinkItem: FC<IProps> = ({ Icon, href, text }) => {
  return (
    <Link href={href} passHref>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>{Icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default LinkItem;
