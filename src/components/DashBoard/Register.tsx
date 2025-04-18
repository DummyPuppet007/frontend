import { useEffect, useState } from "react";
import UserForm from "../Form/UserForm";
import { useParams } from "react-router-dom";
import { getUserDetail } from "@/services/UserService";
import { UserData } from "@/types/user.type";
import ErrorMessage from "../common/ErrorMessage";
import { UserFormSkeleton } from "../common/Skeletons";

function Register() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<string>("");

    const fetchUserDetail = async () => {
        if (!id) {
            return;
        }

        try {
            const response = await getUserDetail(Number(id));
            if (!response || response.statusCode !== 200) {
                setError("Error : User Detail Not Found." + response.message);
                return;
            }
            
            setUser(response.data);
        } catch (error: any) {
            setError("Error : " + error.message);
        } 
    }

    useEffect(() => {
        fetchUserDetail()
    }, [id])

    if (error) {
        return (
            <div className="m-8">
                <ErrorMessage message={error} />
                <UserFormSkeleton />
            </div>
        )
    }
    
    return (
        <>
            <div className="m-8">
                <UserForm initialData={user} />
            </div>

        </>
    )
}

export default Register;