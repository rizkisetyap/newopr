import { Interface } from "readline";

export interface IDate {
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	isDelete?: boolean;
}

interface ITemplate {
	[key: string]: any;
}

export interface IAccountRole extends ITemplate {
	id?: number;
	npp?: string;
	role?: IRole;
}
export interface IAccount {
	npp: string;
	fullName?: string;
	gender?: boolean;
	phoneNumber?: string;

	[key: string]: any;
}

export interface ICategory extends IDate, ITemplate {
	id?: number;
	nama?: string;
	icon?: string;
	isMainCategory?: boolean;
}

export interface IContent extends IDate, ITemplate {
	id?: number;
	title?: string;
	bodyContent?: string;
	pathImage?: string;
	pathContent?: string;
	category?: ICategory;
	categoryId?: number;
}

export interface IEmploye extends IDate, ITemplate {
	npp: string;
	firstName?: string;
	lastName?: string;
	phoneNumber: string;
	gender?: string;
	serviceId?: number;
	positionId?: number;
	service?: IService;
	position?: IPosition;
	dateOfBirth?: Date;
}

export interface IEvent extends IDate, ITemplate {
	id?: number;
	eventName?: string;
	eventTheme?: string;
	startDate?: Date | string;
	endDate?: Date | string;
	organizer?: string;
	location?: string;
	isActive?: boolean;
}

export interface IExtUser extends IDate, ITemplate {
	id?: number;
	npp?: string;
	nama?: string;
	unit?: string;
	email?: string;
	telp?: string;
}

export interface IGroup extends IDate, ITemplate {
	id?: number;
	groupName?: string;
}

export interface IHistoryISO extends IDate {
	id?: number;
	isoSupport?: ISupportISO;
	filePath?: string;
}

export interface ICoreISO extends IDate, ITemplate {
	id?: number;
	name?: string;
	filePath?: string;
}

export interface ISupportISO extends ITemplate {
	id?: number;
	iSOCore?: ICoreISO;
	registeredFormId?: number;
	formNumber?: string;
	filePath?: string;
}

export interface IPosition extends IDate, ITemplate {
	id?: number;
	positionName?: string;
	grade?: number;
}

export interface IPresence extends ITemplate {
	id?: number;
	event?: IEvent;
	npp?: string;
	extUser?: IExtUser;
	isInternal?: boolean;
	createDate?: Date;
}
export interface EventPresence {
	id?: number;
	name?: string;
	theme?: string;
	organizer?: string;
	dateLocation?: string;
	qrCode: Blob;
}
export interface IRegisteredForm extends ITemplate {
	id?: number;
	name?: string;
	service?: IService;
	serviceId?: number;
	createDate?: Date;
	updateDate?: Date;
}

export interface IRole extends ITemplate {
	id?: number;
	roleName?: string;
}

export interface IService extends ITemplate {
	id?: number;
	name?: string;
	group?: IGroup;
	groupId?: number;
	kategoriService?: number;
}

export interface IScheduler extends ITemplate {
	id?: number;
	activity?: string;
	createDate?: Date;
	startDate?: string;
	endDate?: string;
	zoom?: IZoom;
	zoomStatus?: IZoomStatus;
	employee?: IEmploye;
	zoomId?: number;
	zoomStatusId?: number;
	employeeNPP?: number | string;
	link?: string;
}

export interface ISlider extends IDate, ITemplate {
	id?: number;
	title?: string;
	path?: string;
}

export interface IZoom {
	id?: number;
	name?: string;
}
export interface IZoomStatus {
	id?: number;
	name?: string;
}

export interface ILocation {
	id?: number;
	name?: string;
	address?: string;
	latitude?: string;
	longitude?: string;
	description?: string;
}

export interface IFallback {
	[key: string]: any;
}
interface IRoles {
	id: string;
	roleName: string;
}
export interface RegisterVM extends IEmploye {
	roles: IRoles[];
	fullName: string;
}
export type FILE = {
	name?: string;
	type?: string;
	extension?: string;
	base64str?: string;
};

export type FileInfo = {
	image: FILE | null;
	file: FILE | null;
};
export type FormINIT = {
	content: ICategory;
	fileData: FileInfo;
};
