export type ModuleServiceResponse = {
    data: any;
}


export type ModuleData = {
    moduleId? : number;
    moduleName : string;
    description : string;
}

export type ModuleList = {
    moduleId : number;
    moduleName : string;
    description : string;
    createdAt : string;
}