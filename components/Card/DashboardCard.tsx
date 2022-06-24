import React, { FC } from "react";
import cn from "classnames";
import { Paper, SvgIconTypeMap, Typography } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { useRouter } from "next/router";
interface IProps {
	title: string;
	count: number | string;
	color: string;
	linkColor: string;
	Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
	link: string;
}
const DashboardCard: FC<IProps> = ({ title, count, color, Icon, linkColor, link }) => {
	const router = useRouter();

	const handleClick = () => {
		router.push(link);
	};
	return (
		// <a>
		<Paper className={cn("rounded-md overflow-hidden")} variant="elevation" component="div" onClick={handleClick}>
			<div className={cn("overflow-hidden flex flex-col justify-between cursor-pointer group text-white", color)}>
				<div className="grid h-32 grid-cols-2 items-center justify-between gap-x-10  py-2 px-3 ">
					<div className="font-bold space-y-4">
						<Typography variant="h4" component="div" fontWeight={600}>
							{count}
						</Typography>
						<Typography variant="body1" component="p">
							{title}
						</Typography>
					</div>
					<div className="overflow-hidden flex justify-center items-center">
						<Icon className="w-20 h-20 text-gray-100 opacity-30 transition-transform duration-500 ease-in-out group-hover:scale-125" />
					</div>
				</div>
			</div>
		</Paper>
		// </a>
	);
};

export default DashboardCard;
