import ErrorMessage from "@/components/common/ErrorMessage";
import { DataTable } from "@/components/Datatable/data-table";
import { DataTableSkeleton } from "@/components/Datatable/data-table-skeleton";
import { columns } from "@/components/Datatable/machinetype-columns";
import MachineTypeForm from "@/components/Form/MachineTypeForm";
import { getAllMachineTypes } from "@/services/ProductionService";
import { MachineTypeData } from "@/types/production.type";
import { useEffect, useState } from "react";

function MachineType() {
    const [machineTypes, setMachineTypes] = useState<MachineTypeData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchMachineTypes = async () => {
        setError("");
        try {
            const response = await getAllMachineTypes();

            if (!response || response.statusCode !== 200) {
                setError("Error : " + response.message);
            }
            setMachineTypes(response.data || []);
        } catch (error: any) {
            setError("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMachineTypes();
    },[]);

    if (error) {
        return (
            <div className="m-8">
                <ErrorMessage message={error} className="mb-8" />
                <DataTableSkeleton
                    columnCount={columns.length}
                    rowCount={10}
                    searchableColumnCount={1}
                    showViewOptions={true}
                    withPagination={true}
                    shrinkZero={false}
                />
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col m-8">
                <h1 className="text-3xl font-bold border-b mb-4">Machine Type</h1>
                <DataTableSkeleton
                    columnCount={columns.length}
                    rowCount={10}
                    searchableColumnCount={1}
                    showViewOptions={true}
                    withPagination={true}
                    shrinkZero={false}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col m-8">
            <h1 className="text-3xl font-bold border-b mb-4">Machine Type</h1>
            <div className="flex flex-col items-end mb-4">
                <MachineTypeForm refreshMachineTypes={fetchMachineTypes} />
            </div>

            <DataTable columns={columns} data={machineTypes} searchKey="machine type" />

        </div>
    );

}

export default MachineType;