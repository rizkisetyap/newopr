import { IJenisDokumen } from "components/DOCIS/RegisterForm";
import { Interface } from "readline";

export interface IDate {
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	isDelete?: boolean;
}

export interface FileIso extends IDate {
	id?: number;
	fileName?: string;
	DetailRegisterId?: number;
	detailRegister?: DetailRegister;
	filePath?: string;
}

interface DetailRegister {
	Id?: number;
	registeredFormId?: number;
	revisi: number;
	isActive?: boolean;
	registeredForm: IRegisteredForm;
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
	dateOfBirth?: Date | string;
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
	services?: IService[];
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
	isoCoreId?: number;
	isoCore?: ICoreISO;
	registeredForm?: IRegisteredForm;
	registeredFormId?: number;
	formNumber?: string;
	filePath?: string;
	revision?: number;
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
export interface IRegisteredForm extends ITemplate, IDate {
	id?: number;
	name?: string;
	service?: IService;
	serviceId?: number;
	createDate?: Date;
	updateDate?: Date;
	formNumber?: string;
	subLayananId?: number;
	subLayanan?: IUnit;
	noUrut?: number;
	jenisDokumen?: IJenisDokumen;
	jenisDokumenId?: number;
	groupId?: number;
}
export interface IUnit extends IDate {
	id?: number;
	name?: string;
	shortName?: string;
	service?: IService;
	serviceId?: number;
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
	shortName?: string;
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

export interface IKategoriDocument extends IDate {
	id?: number;
	name?: string;
}
export interface ListApp extends IDate {
	id?: number;
	name: string;
	link: string;
}
