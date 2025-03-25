export type Users = {
    id: number;
    name: string
}

export type UserData = {
    userId: number;
    firstname: string;
    lastname: string;
    middleName? : string | null;
    email : string;
    username : string;
    password? : string;
    roleId : number;
    role? : any;
    createdAt : string;
}

export type UserServiceResponse = {
    data : any;
}