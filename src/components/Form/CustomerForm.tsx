import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownSearch } from "@/components/common/DropdownSearch";
import { useCallback, useEffect, useState } from "react";
import { CustomerData } from "@/types/customer.type";
import { createCustomer, editCustomer, getCitiesByName, getCountriesByName, getStatesByName } from "@/services/CustomerService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { debounce } from "lodash";
import { SearchResult } from "@/utils/types/common.types";
import { Lock } from "lucide-react";
import { CustomerFormSkeleton } from "../common/Skeletons";
import ErrorMessage from "../common/ErrorMessage";

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
    const [loading, setLoading] = useState<boolean>(false);
    const [countryResults, setCountryResults ] = useState<SearchResult[]>([]);
    const [stateResults, setStateResults ] = useState<SearchResult[]>([]);
    const [cityResults, setCityResults ] = useState<SearchResult[]>([]);
    const [error, setError ] = useState<string>("");
    const navigate = useNavigate();

    const handleCountrySearch = useCallback(
        debounce(async (query: string) =>  {
            if(query.length >= 2 ) {
                const filteredCountries = await getCountriesByName(query);

                if(!filteredCountries || filteredCountries.statusCode !== 200 || !filteredCountries.data) {
                    setError("Error : " + filteredCountries.message);
                    return;
                } else { 
                    const formatCountry = filteredCountries.data.map((country: any) => ({
                        id: country.id,
                        name: country.name,
                    }))
                    setCountryResults(formatCountry);
                }
            } else {
                setCountryResults([]);
            }
            } , 300),
        []
    );

    const handleStateSearch = useCallback(
        debounce(async (query: string) => {
            if(!selectedCountry) return;

            if(query.length >= 2 && selectedCountry?.id) {
                const filteredStates = await getStatesByName(selectedCountry.id, query);

                if(!filteredStates || filteredStates.statusCode !== 200 || !filteredStates.data) {
                    setError("Error : " + filteredStates.message);
                    return;
                } else {
                    const formatState = filteredStates.data.map((state: any) => ({
                        id: state.id,
                        name: state.name
                    }))
                    setStateResults(formatState);
                }
            } else {
                setStateResults([]);
            }
        }, 300),
        []
    );

    const handleCitySearch = useCallback(
        debounce(async (query: string) => {
            if(!selectedState) return;

            if(query.length >= 2 && selectedState?.id) {
                const filteredCities = await getCitiesByName(selectedState.id, query);

                if(!filteredCities || filteredCities.statusCode !== 200 || !filteredCities.data) {
                    setError("Error : " + filteredCities.message);
                    return;
                } else {
                    const formatCity = filteredCities.data.map((city: any) => ({
                        id: city.id,
                        name: city.name
                    }))
                    setCityResults(formatCity);
                }
            } else {
                setCityResults([]);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    useEffect(() => {
        if (initialData) 
        {   
            setSelectedCountry((prev) => prev || countryResults.find((c) => 
                c.name === initialData.country) || null);

            setSelectedState((prev) => prev || stateResults.find((s) => 
                s.name === initialData.state) || null);

            setSelectedCity((prev) => prev || cityResults.find((c) => 
                c.name === initialData.city) || null);

        }

    }, [initialData, countryResults, stateResults, cityResults]);    

    const onSubmitCreateCustomer: SubmitHandler<CustomerData> = async (data) => {
        const formData: CustomerData = {
            ...data,
            customerName: data.customerName, 
            customerType: data.customerType, 
            currency: data.currency === "" ? null : data.currency,
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
            setLoading(true);
            if (initialData) {
                try {
                    const response = await editCustomer(initialData.customerId, formData);

                    if (!response || response.statusCode !== 200) {
                        toast.error("Failed to update customer.Please try again.",{
                            className: 'font-medium max-w-[400px]',
                        });
                        return;
                    } else {
                        toast.success("Customer updated successfully.");
                        navigate("/dashboard/customers");
                    }                    
                } catch (error: any) {
                    toast.error("Error : " + error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                try {
                    const response = await createCustomer(formData);

                    if (!response || response.statusCode !== 200) {
                        toast.error("Form submission failed. Please check your details and try again.", {
                            className: 'font-medium max-w-[400px]',
                        });
                        return;
                    } else {
                        toast.success("Customer created successfully.");
                        navigate("/dashboard/customers");
                    }      
                } catch (error: any) {
                    toast.error(error.message);
                } finally {
                    setLoading(false);
                }
            }
        }
    }

    if(error) {
        return(
            <div>
                <ErrorMessage message={error} />
                <CustomerFormSkeleton />
            </div>
        )
    }
    
    return(
        <>
            <h1 className="text-3xl font-bold border-b mb-4">{initialData ? "Edit Customer" : "Create Customer"}</h1>
            <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="">
                <form className="space-y-8 mt-4" onSubmit={handleSubmit(onSubmitCreateCustomer)}>
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
                                        results={countryResults}
                                        onSearch={handleCountrySearch}
                                        onSelect={(value) => {
                                            setValue("country", value.name);
                                            setSelectedCountry(value);  
                                            setSelectedState(null);
                                            setSelectedCity(null);
                                            setStateResults([]);
                                            setCityResults([]);
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
                                        results={stateResults}
                                        onSearch={handleStateSearch}
                                        onSelect={(value) => {
                                            setValue("state", value.name);
                                            setSelectedState(value);
                                            setSelectedCity(null);
                                            setCityResults([]);
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
                                        results={cityResults}
                                        onSearch={handleCitySearch}
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
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Enter Currency"
                                    id="currency"
                                    autoComplete="off"
                                    readOnly
                                    {...register("currency")}
                                    className="mt-1 block w-full px-3 py-2 pr-10 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed text-gray-500"
                                />
                                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
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
                        <Button
                            type="submit" disabled={loading}
                            className="w-full">
                            {loading ? "Submitting..." :
                            initialData ? "Update Customer" : "Create Customer"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </>
    )
}

export default CustomerForm;

