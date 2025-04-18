import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ActionList } from "@/types/action.type";
import ActionForm from "../Form/ActionForm";
import { getActions, deleteAction } from "@/services/ActionService";
import ErrorMessage from "../common/ErrorMessage";
import { TableSkeleton } from "../common/Skeletons";
import toast from "react-hot-toast";

function Action() {
    const [actions, setActions] = useState<ActionList[] | null>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [editData, setEditData] = useState<ActionList | null>(null);
    const [selectedActionId, setSelectedActionId] = useState<number | null>(null);

    useEffect(() => {
        fetchActions();
    }, []);

    const fetchActions = async () => {
        setError("");
        try {
            const response = await getActions();

            if (!response || response.statusCode  !== 200) {
                setError("Error : Failed to fetch Actions." + response.message);
                return;
            }
            setActions(response.data);
        } catch (error: any) {
            setError("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedActionId) return;
       
        const response = await deleteAction(selectedActionId);

        if (response.success && response.statusCode === 200) {
            setActions((prevActions) => prevActions!.filter((action) => action.actionId !== selectedActionId));
            toast.success(response.message);
        } else {
            toast.error("Error : " + response.message);
        }

        setSelectedActionId(null);
    };

    if (error) {
        return (
            <div className="m-8">
                <ErrorMessage message={error} className="mb-8" />
                <TableSkeleton headers={["Sr. No", "Action", "Description", "Operation"]} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="m-8">
                <h1 className="text-3xl font-bold border-b mb-4">Actions</h1>
                <TableSkeleton headers={["Sr. No", "Action", "Description", "Operation"]} />
            </div>
        );
    }

    return (
        <div className="flex flex-col m-8">
            <h1 className="text-3xl font-bold border-b mb-4">Actions</h1>
            <div className="flex items-center justify-end mb-4">
                <ActionForm editData={editData} setEditData={setEditData} refreshActions={fetchActions} />
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-300 hover:bg-gray-200">
                        <TableHead>Sr. No.</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Operation</TableHead>
                    </TableRow>
                </TableHeader>
                {actions && actions.length > 0 ? (
                    <TableBody className="border-b border-gray-300">
                        {actions.map((action, index) => (
                            <TableRow key={action.actionId} className="hover:bg-gray-200">
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{action.actionName}</TableCell>
                                <TableCell>{action.description}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-4">
                                        <Pencil
                                            className="cursor-pointer text-blue-500"
                                            onClick={() => setEditData(action)}
                                        />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Trash
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => setSelectedActionId(action.actionId)}
                                                />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-md text-gray-700">
                                                        This action cannot be undone. This will permanently delete the action.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleDelete}
                                                        className="bg-red-500 hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                ) : (
                    <TableBody>
                        <TableRow className="hover:bg-gray-200">
                            <TableCell colSpan={4} className="text-center">
                                <p className="text-md">No Actions Available</p>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )}
            </Table>
        </div>
    );
}

export default Action;
