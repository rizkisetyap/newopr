import { ComponentType } from "react";

import Notif from "../Layout/Notification";

export default function HOC<T>(Component: ComponentType<T>) {
	return (props: T) => {
		return (
			<>
				<Component {...props} />
				<Notif />
			</>
		);
	};
}
