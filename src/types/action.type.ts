export type ActionServiceResponse = {
    data: any;
}

export type ActionData = {
    actionId?   : number;
    actionName : string;
    description : string;
}

export type ActionList = {
    actionId : number;
    actionName : string;
    description : string;
    createdAt : string;
}