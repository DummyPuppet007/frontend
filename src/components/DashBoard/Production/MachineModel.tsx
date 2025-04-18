import ErrorMessage from "@/components/common/ErrorMessage";
import { DataTable } from "@/components/Datatable/data-table";
import { DataTableSkeleton } from "@/components/Datatable/data-table-skeleton";
import { columns } from "@/components/Datatable/machinemodel-columns";
import MachineModelForm from "@/components/Form/MachineModelForm";
import { getAllMachineModels } from "@/services/ProductionService";
import { MachineModelData } from "@/types/production.type";
import { useEffect, useState } from "react";

function MachineModel() {
    const [machineModels, setMachineModels] = useState<MachineModelData[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchMachineModels = async () => {
        setError("");
        try {
            const response = await getAllMachineModels();

            if (!response || response.statusCode !== 200) {
                setError("Error : " + response.message);
            }
            setMachineModels(response.data || []);
        } catch (error: any) {
            setError("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMachineModels();
    }, [])

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
                <h1 className="pb-2 text-3xl font-bold border-b mb-4">Machine Model</h1>
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
            <h1 className="pb-2 text-3xl font-bold border-b mb-4">Machine Model</h1>
            <div className="flex flex-col items-end mb-4">
                <MachineModelForm refreshMachineModels={fetchMachineModels} />
            </div>

            <DataTable columns={columns} data={machineModels} searchKey="machine model" />
        </div>
    )
}

export default MachineModel;