export type CustomerData = {
    customerId : number;
    customerCode? : string;
    customerName : string;
    customerType : string;
    street : string | null;
    country : string | null;
    state : string | null;
    city: string | null;
    pincode : string | null;
    customerPhone : string | null;
    customerEmail: string | null;
    currency : string | null;
    customerComments : string | null;
    createdAt : string;
}

export type CustomerResponse = {
    data : any;
}