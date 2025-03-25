import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Country, State, City }  from 'country-state-city';
import currencyCodes from "currency-codes";
import { DropdownSearch } from "@/Common/DropdownSearch";
import { useEffect, useMemo, useState } from "react";
import { CustomerData } from "@/types/customer.type";
import { createCustomer, editCustomer } from "@/services/CustomerService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type dataList = {
    id: number;
    name: string;
}

interface CustomerFormProps {
    initialData?: CustomerData | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({initialData}) => {
    const { register, control, handleSubmit, formState: { errors }, reset, setValue} = useForm<CustomerData>({
        defaultValues: initialData || {
            customerName : "",
            customerType: "",
            street: "",
            country: "",
            state: "",
            city: "",
            pincode: "",
            customerPhone: "",
            customerEmail: "",
            currency: "",
            customerComments: ""
        }
    });
    const [selectedCountry, setSelectedCountry] = useState<dataList | null>(null);
    const [selectedState, setSelectedState] = useState<dataList | null>(null);
    const [selectedCity, setSelectedCity] = useState<dataList | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<dataList | null>(null);
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");

    const countries = useMemo(
        () =>
            Country.getAllCountries().map((country, index) => ({
                id: index,
                name: country.name,
                isoCode: country.isoCode,
            })),
        []
    );

    const states = useMemo(() => {
        if (!selectedCountry) return [];
        return State.getStatesOfCountry(
            countries.find((c) => c.id === selectedCountry.id)?.isoCode || ""
        ).map((state, index) => ({
            id: index,
            name: state.name,
            isoCode: state.isoCode,
        }));
    }, [selectedCountry]);

    const cities = useMemo(() => {
        if (!selectedCountry || !selectedState) return [];
        return City.getCitiesOfState(
            countries.find((c) => c.id === selectedCountry.id)?.isoCode || "",
            states.find((s) => s.id === selectedState.id)?.isoCode || ""
        ).map((city, index) => ({
            id: index,
            name: city.name,
        }));
    }, [selectedCountry, selectedState]);

    const currencies = currencyCodes.data.map((currency, index) => ({
        id: index,
        name: `${currency.code} - ${currency.currency}`,
    }));

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    useEffect(() => {
        if (initialData) 
        {
            setSelectedCountry((prev) => prev || countries.find((c) => 
                c.name === initialData.country) || null);

            setSelectedState((prev) => prev || states.find((s) => 
                s.name === initialData.state) || null);

            setSelectedCity((prev) => prev || cities.find((c) => 
                c.name === initialData.city) || null);

            setSelectedCurrency((prev) => prev || currencies.find((c) => 
                c.name.startsWith(initialData.currency!)) || null);
        }

    }, [initialData, countries, states, cities, currencies]);    

    const onSubmitCreateCustomer: SubmitHandler<CustomerData> = async (data) => {
        const formData: CustomerData = {
            ...data,
            customerName: data.customerName, 
            customerType: data.customerType, 
            currency: data.currency?.split(" - ")[0] || null,
            city: data.city === "" ? null : data.city,
            country: data.country === "" ? null : data.country,
            customerComments: data.customerComments === "" ? null : data.customerComments,
            customerEmail: data.customerEmail === "" ? null : data.customerEmail,
            customerPhone: data.customerPhone === "" ? null : data.customerPhone,
            pincode: data.pincode === "" ? null : data.pincode,
            state: data.state === "" ? null : data.state,
            street: data.street === "" ? null : data.street
        };

        if (formData) {
            setError("");
            if (initialData) {
                try {
                    const response = await editCustomer(initialData.customerId, formData);

                    if (!response || response.statusCode !== 200) {
                        setError("Customer updation failed.");
                    }

                    navigate("/dashboard/customers");
                } catch (error: any) {
                    setError(error.message);
                }
            } else {
                try {
                    const response = await createCustomer(formData);

                    if (!response || response.statusCode !== 200) {
                        setError("Customer creation failed.");
                    }

                    navigate("/dashboard/customers");
                } catch (error: any) {
                    setError(error.message);
                }
            }
        }
    }
    
    return(
        <>
            <h1 className="pb-2 text-3xl font-medium border-b mb-4">{initialData ? "Edit Customer" : "Create Customer"}</h1>
            <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="my-5 py-5 border border-neutral-400 rounded-lg shadow-lg">
                <form className="space-y-6 m-4" onSubmit={handleSubmit(onSubmitCreateCustomer)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                                Customer Name
                            </Label>
                            <Input 
                                type="text"
                                placeholder="Enter Customer Name"
                                id="customerName"
                                autoComplete="off"
                                {...register("customerName", { required: "Customer name is required", minLength: { value: 2, message: "Customer name must be at least 2 characters" } })}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm "
                            />
                            {errors.customerName && <p className="text-red-500 text-sm mt-1 font-medium">{errors.customerName.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="customerType" className="block text-sm font-medium text-gray-700">
                                Customer Type
                            </Label>
                            <Controller
                                name="customerType"
                                control={control}
                                rules={{ required: "Customer type is required" }}
                                render={({field}) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(value)}
                                        value={field.value || ""}
                                    >
                                        <SelectTrigger className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                                            <SelectValue placeholder="Select Customer Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Local">Local</SelectItem>
                                            <SelectItem value="International">International</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.customerType && <p className="text-red-500 text-sm mt-1 font-medium">{errors.customerType.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="street" className="block text-sm font-medium text-gray-700">
                            Street Address
                        </Label>
                        <Input
                            type="text"
                            placeholder="Street address (e.g., 123 Main St)"
                            id="street"
                            autoComplete="off"
                            {...register("street")}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm "
                        />
                    </div>  

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                Country
                            </Label>
                            <Controller
                                name="country"
                                control={control}
                                render={() => (
                                    <DropdownSearch
                                        placeholder="Search country name"
                                        results={countries}
                                        onSearch={() => { }}
                                        onSelect={(value) => {
                                            setValue("country", value.name);
                                            setSelectedCountry(value);  
                                            setSelectedState(null);
                                            setSelectedCity(null);
                                        }}
                                        getDisplay={() => selectedCountry?.name || ""}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                State
                            </Label>
                            <Controller
                                name="state"
                                control={control}
                                render={() => (
                                    <DropdownSearch
                                        placeholder="Search state name"
                                        results={states}
                                        onSearch={() => { }}
                                        onSelect={(value) => {
                                            setValue("state", value.name);
                                            setSelectedState(value);
                                            setSelectedCity(null);
                                        }}
                                        getDisplay={() => selectedState?.name  || ""}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City
                            </Label>
                            <Controller
                                name="city"
                                control={control}
                                render={() => (
                                    <DropdownSearch
                                        placeholder="Search city name"
                                        results={cities}
                                        onSearch={() => { }}
                                        onSelect={(value) => {
                                            setValue("city", value.name);
                                            setSelectedCity(value);
                                        }}
                                        getDisplay={() => selectedCity?.name || ""}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                                Pincode
                            </Label>
                            <Input
                                type="text"
                                placeholder="Enter Pincode"
                                id="pincode"
                                autoComplete="off"
                                maxLength={6}
                                onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))} // Removes non-numeric characters
                                {...register("pincode", {
                                    pattern: {
                                        value: /^\d{6}$/, 
                                        message: "Pincode must be exactly 10 digits",
                                    },
                                })}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm "
                            />
                            {errors.pincode && <p className="text-red-500 text-sm mt-1 font-medium">{errors.pincode.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                                Contact Number
                            </Label>
                            <Input
                                type="text"
                                placeholder="Enter Contact Number"
                                id="customerPhone"
                                autoComplete="off"
                                maxLength={10} 
                                onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
                                {...register("customerPhone", {
                                    pattern: {
                                        value: /^\d{10}$/, 
                                        message: "Phone number must be exactly 10 digits",
                                    },
                                })}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.customerPhone && <p className="text-red-500 text-sm mt-1 font-medium">{errors.customerPhone.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                                E-mail ID
                            </Label>
                            <Input
                                type="text"
                                placeholder="Enter Customer Email"
                                id="customerEmail"
                                autoComplete="off"
                                {...register("customerEmail", { pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email address" } })}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.customerEmail && <p className="text-red-500 text-sm mt-1 font-medium">{errors.customerEmail.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                Currency
                            </Label>
                            <Controller
                                name="currency"
                                control={control}
                                render={() => (
                                    <DropdownSearch
                                        placeholder="Select Currency"
                                        results={currencies}
                                        onSearch={() => { }}
                                        onSelect={(value) => {
                                            setValue("currency", value.name);
                                            setSelectedCurrency(value);
                                        }}
                                        getDisplay={() => selectedCurrency?.name || ""}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Label htmlFor="customerComments" className="block text-sm font-medium text-gray-700">
                                Remark
                            </Label>
                            <Input
                                type="text"
                                placeholder="Enter Remarks"
                                id="customerComments"
                                autoComplete="off"
                                {...register("customerComments")}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-zinc-800 text-white px-4 py-2 mt-3 rounded-lg font-medium shadow-lg transition-all relative 
             hover:bg-zinc-700 hover:shadow-inner hover:text-lg"
                        >
                            {initialData ? "Edit Customer" : "Create Customer"}
                        </button>


                    </div>
                </form>
            </motion.div>
        </>
    )
}

export default CustomerForm;