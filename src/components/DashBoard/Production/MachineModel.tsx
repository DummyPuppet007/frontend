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
                setError(response.message);
            }
            setMachineModels(response.data || []);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMachineModels();
    }, [])

    if (loading) {
        return (
            <div className="py-4 w-full px-2">
                <h1 className="pb-2 text-3xl font-medium border-b mb-4">Machine Model</h1>
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
        <div className="py-4 w-full px-2">
            <h1 className="pb-2 text-3xl font-medium border-b mb-4">Machine Model</h1>
            <div className="flex flex-col items-end mb-4">
                <MachineModelForm refreshMachineModels={fetchMachineModels} />
            </div>

            <DataTable columns={columns} data={machineModels} searchKey="machine model" />
        </div>
    )
}

export default MachineModel;