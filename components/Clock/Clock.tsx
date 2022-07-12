import s from "./style.module.scss";
import cn from "classnames";

import React, { useEffect, useState } from "react";

export type ClockState = {
	hours: number;
	hoursShuffle: boolean;
	minutes: number;
	minutesShuffle: boolean;
	seconds: number;
	secondsShuffle: boolean;
};

interface Props {
	clockState: ClockState;
}
const today = new Date();
const init: ClockState = {
	hours: today.getHours(),
	minutes: today.getMinutes(),
	seconds: today.getSeconds(),
	hoursShuffle: true,
	minutesShuffle: true,
	secondsShuffle: true,
};
const Clock = (props: Props) => {
	const [clockState, setClockState] = useState<ClockState>(init);
	useEffect(() => {
		const idtimer = setInterval(() => update(), 50);

		return () => {
			clearInterval(idtimer);
			// setClockState(init);
		};
	});
	const update = () => {
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		if (hours !== clockState.hours) {
			const hShuffle = !clockState.hoursShuffle;
			setClockState((old) => ({ ...old, hours, hoursShuffle: hShuffle }));
		}
		if (minutes !== clockState.minutes) {
			const minutesShuffle = !clockState.minutesShuffle;
			setClockState((cs) => ({ ...cs, minutes, minutesShuffle }));
		}
		if (seconds !== clockState.seconds) {
			const secondsShuffle = !clockState.secondsShuffle;
			setClockState((cs) => ({ ...cs, seconds, secondsShuffle }));
		}
	};
	return (
		<div className={cn(s.flipClock)}>
			<FlipUnitContainer digit={clockState.hours} unit="hours" shuffle={clockState.hoursShuffle} />
			<span className={s.colon}>:</span>
			<FlipUnitContainer digit={clockState.minutes} unit="minutes" shuffle={clockState.minutesShuffle} />
			<span className={s.colon}>:</span>
			<FlipUnitContainer digit={clockState.seconds} unit="hours" shuffle={clockState.secondsShuffle} />
		</div>
	);
};

interface AnimatedCardProps {
	animation: string;
	digit: number;
}
const AnimatedCard = ({ animation, digit }: AnimatedCardProps) => {
	return (
		<div className={cn(s.flipCard, animation)}>
			<span className="text-white">{digit}</span>
		</div>
	);
};

interface StaticCardProps {
	position: string;
	digit: number;
}

const StaticCard = ({ position, digit }: StaticCardProps) => {
	return (
		<div className={cn(position)}>
			<span className="">{digit}</span>
		</div>
	);
};

interface FlipUnitContainerProps {
	digit: number;
	shuffle: boolean;
	unit: string;
}

const FlipUnitContainer = ({ digit, shuffle, unit }: FlipUnitContainerProps) => {
	let currentDigit: string | number = `${digit}`;
	let previousDigit: string | number = `${digit - 1}`;

	if (unit !== "hours") {
		previousDigit = +previousDigit === -1 ? 59 : +previousDigit;
	} else {
		previousDigit = +previousDigit === -1 ? 23 : +previousDigit;
	}
	// Add ZEro
	if (+currentDigit < 10) {
		currentDigit = `0${currentDigit}`;
	}
	if (previousDigit < 10) {
		previousDigit = `0${previousDigit}`;
	}
	// shuffle digit
	const digit1 = shuffle ? +previousDigit : +currentDigit;
	const digit2 = !shuffle ? +previousDigit : +currentDigit;

	// shuffle animation
	const animation = cn(shuffle ? s.fold : s.unfold);
	const animation2 = cn(!shuffle ? s.fold : s.unfold);

	return (
		<div className={cn(s.flipUnitContainer)}>
			<StaticCard position={cn(s.upperCard)} digit={+currentDigit} />
			<StaticCard position={cn(s.lowerCard)} digit={+currentDigit} />
			<AnimatedCard digit={+digit1} animation={animation} />
			<AnimatedCard digit={+digit2} animation={animation2} />
		</div>
	);
};

export default Clock;
