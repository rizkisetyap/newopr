import React from "react";
import s from "./AnimatedCheck.module.scss";
import cn from "classnames";
const AnimatedCheck = () => {
	return (
		<div className={s.successCheckmark}>
			<div className={cn(s.checkIcon)}>
				<span className={cn(s.iconLine, s.lineTip)} />
				<span className={cn(s.iconLine, s.lineLong)} />
			</div>
			<div className={s.iconCircle} />
			<div className={s.iconFix} />
		</div>
	);
};

export default AnimatedCheck;
