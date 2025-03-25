import { useEffect, useState } from "react";
import UserForm from "../Form/UserForm";
import { useParams } from "react-router-dom";
import { getUserDetail } from "@/services/UserService";
import { UserData } from "@/types/user.type";

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
                setError('User Detail Not Found.');
            }
            
            setUser(response.data);
        } catch (err: any) {
            setError(err.message);
        } 
    }

    useEffect(() => {
        fetchUserDetail()
    }, [id])
    
    return (
        <>
            <div className="py-4 px-2 w-full">
                <UserForm initialData={user} />
            </div>

        </>
    )
}

export default Register;