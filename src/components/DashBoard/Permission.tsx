import { useEffect, useState } from "react";
import PermissionForm from "../Form/PermissionForm";
import { useParams } from "react-router-dom";
import { PermissionList } from "@/types/permission.type";
import { getPermission } from "@/services/PermissionService";
import ErrorMessage from "../common/ErrorMessage";
import { PermissionFormSkeleton } from "../common/Skeletons";

function Permission() {
    const { id } = useParams<{ id: string }>();
    const [permission, setPermission] = useState<PermissionList>();
    const [error, setError] = useState<string>("");

    const fetchPermission = async () => {
        if (!id) {
            return;
        }

        try {
            const response = await getPermission(Number(id));

            if (!response || response.statusCode !== 200) {
                setError("Failed to get permission detail.")
            }

            if (response.data) setPermission(response.data);
        } catch (error: any) {
            setError(error.message)
        }
    }

    useEffect(() => {
        fetchPermission();
    }, [id])

    if(error) {
        return(
            <div className="m-8">
                <ErrorMessage message={error} className="mb-8"/>
                <PermissionFormSkeleton />
            </div>
        )
    }

    return (
        <div className="m-8">
            <PermissionForm initialData={permission} />
        </div>
    )
}

export default Permission;