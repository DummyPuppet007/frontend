import { useEffect, useState } from "react";
import PermissionForm from "../Form/PermissionForm";
import { useParams } from "react-router-dom";
import { PermissionList } from "@/types/permission.type";
import { getPermission } from "@/services/PermissionService";

function Permission(){
    const { id } = useParams<{ id: string }>(); 
    const [permission, setPermission] = useState<PermissionList>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setError("");
        if (id) {
            const fetchPermission = async () => {
                try {
                    const response = await getPermission(Number(id));
                    
                    if (!response || response.statusCode !== 200) {
                        setError("Failed to get permission detail.")
                    }

                    if (response.data) setPermission(response.data);
                } catch (error: any) {
                    setError(error.message)
                } finally {
                    setLoading(false);
                }
            }

            fetchPermission();
        } 
    }, [id])

    return (
        <>
            <div className="py-4 px-2 w-full">
                <PermissionForm initialData={permission} />
            </div>

        </>
    )
}

export default Permission;