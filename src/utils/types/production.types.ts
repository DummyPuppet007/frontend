import { SalesOrder } from "./sales.types";

interface ProductionBase {
    productionId: number;
    comments: string | null;
    productionOrderCode: string;
    currentProgress: number;
}

export interface ProductionList extends ProductionBase {
    createdAt: string;
    salesOrderDetails: SalesOrderDetails;
}

export interface ProductionDetails extends ProductionBase {
    salesorderDetailsId: number;
    plannedStartDate: string | null;
    actualStartDate: string | null;
    estimatedCompletionDate: string | null;
    actualCompletionDate: string | null;
    isDeleted: boolean;
    createdBy: number;
    createdAt: string;
    updatedBy: number | null;
    updatedAt: string;
}

export interface Production extends ProductionDetails {
    salesOrderDetails: SalesOrderDetails;
    creator: User;
}

export interface SalesOrderDetails {
    machineModel: MachineModel;
    machineType: MachineType;
    powerRating: PowerRating;
    make: Make;
    salesOrder?: SalesOrder;
}

export interface MachineModel {
    machineModelId: number;
    machineModelName: string;
}

export interface MachineType {
    machineTypeId: number;
    machineTypeName: string;
}

export interface PowerRating {
    powerRatingId: number;
    powerRating: string;
}

export interface Make {
    makeId: number;
    makeName: string;
}

export interface User {
    userId: number;
    username: string;
};
