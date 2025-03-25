export type RoleFormData = {
    id? : number;
    roleName : string;
    description : string;
}

export type RoleList = {
    roleId : number;
    roleName : string;
    description : string;
    createdAt : string;
}

export type Roles = {
    id : number;
    name : string;
}