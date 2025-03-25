// import { useEffect, useState } from "react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Pencil, Trash } from "lucide-react";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import ModuleForm from "../Form/ModuleForm";
// import { deleteModule, getModules } from "@/services/ModuleService";
// import { ModuleList } from "@/types/module.type";

// function Module() {
//     const [modules, setModules] = useState<ModuleList[] | null>([]);
//     const [error, setError] = useState<string>("");
//     const [loading, setLoading] = useState<boolean>(true);
//     const [editData, setEditData] = useState<ModuleList | null>(null);
//     const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
//     const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);


//     useEffect(() => {   
//         fetchModules();
//     }, []);

//     const fetchModules = async () => {
//         setError("")
//         try {
//             const response = await getModules();

//             if (!response || response.statusCode !== 200) {
//                 setError("Failed to fetch Actions.");
//                 return;
//             }
//             setModules(response.data);
//         } catch (error: any) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const confirmDelete = (id: number) => {
//             setSelectedModuleId(id);
//             setIsDialogOpen(true);
//         };
    
//         const handleDelete = async () => {
//             if (!selectedModuleId) return;
    
//             const response = await deleteModule(selectedModuleId);
    
//             if (response.success) {
//                 setModules((prevModules) => prevModules!.filter((module) => module.moduleId !== selectedModuleId));
//             } else {
//                 setError("Failed to delete action.");
//             }
            
//             setIsDialogOpen(false);
//             setSelectedModuleId(null);
//         };

//     return (
//         <div className="py-4 px-2 w-full">
//             <h1 className="pb-2 text-3xl font-medium border-b mb-4">Module List</h1>
//             <div className="flex items-center justify-end py-4">
//                 <ModuleForm editData={editData} setEditData={setEditData} refreshModules={fetchModules}/>
//             </div>
//             <Table>
//                 <TableHeader>
//                     <TableRow className="bg-gray-300 hover:bg-gray-200">
//                         <TableHead>Sr. No.</TableHead>
//                         <TableHead>Module</TableHead>
//                         <TableHead>Description</TableHead>
//                         <TableHead className="text-right">Operation</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 {modules && modules.length > 0 ? (
//                     <TableBody className="border-b border-gray-300">
//                         {modules.map((module, index) => (
//                             <TableRow key={module.moduleId} className="hover:bg-gray-300">
//                                 <TableCell className="font-medium">{index + 1}</TableCell>
//                                 <TableCell>{module.moduleName}</TableCell>
//                                 <TableCell>{module.description}</TableCell>
//                                 <TableCell className="text-right">
//                                     <div className="flex justify-end gap-4">

//                                         <Pencil
//                                             className="cursor-pointer text-blue-500"
//                                             onClick={() => setEditData(module)}
//                                         />

//                                         <AlertDialog>
//                                             <AlertDialogTrigger asChild>
//                                                 <Trash
//                                                     className="cursor-pointer text-red-500"
//                                                     onClick={() => confirmDelete(module.moduleId)}
//                                                 />
//                                             </AlertDialogTrigger>
//                                             <AlertDialogContent>
//                                                 <AlertDialogHeader>
//                                                     <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                                                     <AlertDialogDescription className="text-md text-gray-700">
//                                                         This action cannot be undone. This will permanently delete the module.
//                                                     </AlertDialogDescription>
//                                                 </AlertDialogHeader>
//                                                 <AlertDialogFooter>
//                                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                                     <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
//                                                         Delete
//                                                     </AlertDialogAction>
//                                                 </AlertDialogFooter>
//                                             </AlertDialogContent>
//                                         </AlertDialog>
//                                     </div>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 ) : (
//                     <TableBody className="border-b-2">
//                         <TableRow className="hover:bg-gray-200">
//                             <TableCell colSpan={4} className="text-center">
//                                 <p className="text-md">No Modules Available</p>
//                             </TableCell>
//                         </TableRow>
//                     </TableBody>
//                 )}
//             </Table>
//         </div>
//     );
// }

// export default Module;

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
import { Skeleton } from "@/components/ui/skeleton"; // ShadCN Skeleton Import
import ModuleForm from "../Form/ModuleForm";
import { deleteModule, getModules } from "@/services/ModuleService";
import { ModuleList } from "@/types/module.type";

const SkeletonLoader = () => {
    return (
        <TableBody>
            {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-64" /></TableCell>
                    <TableCell>
                        <div className="flex justify-end w-full">
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};

function Module() {
    const [modules, setModules] = useState<ModuleList[] | null>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [editData, setEditData] = useState<ModuleList | null>(null);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    useEffect(() => {   
        fetchModules();
    }, []);

    const fetchModules = async () => {
        setError("");
        try {
            const response = await getModules();

            if (!response || response.statusCode !== 200) {
                setError("Failed to fetch Modules.");
                return;
            }
            setModules(response.data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id: number) => {
        setSelectedModuleId(id);
        setIsDialogOpen(false);
    };

    const handleDelete = async () => {
        if (!selectedModuleId) return;

        const response = await deleteModule(selectedModuleId);

        if (response.success) {
            setModules((prevModules) => prevModules!.filter((module) => module.moduleId !== selectedModuleId));
        } else {
            setError("Failed to delete module.");
        }

        setIsDialogOpen(false);
        setSelectedModuleId(null);
    };

    return (
        <div className="py-4 px-2 w-full">
            <h1 className="pb-2 text-3xl font-medium border-b mb-4">Modules</h1>
            <div className="flex items-center justify-end mb-4">
                <ModuleForm editData={editData} setEditData={setEditData} refreshModules={fetchModules}/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-300 hover:bg-gray-200">
                        <TableHead>Sr. No.</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Operation</TableHead>
                    </TableRow>
                </TableHeader>
                {loading ? (
                    <SkeletonLoader />
                ) : modules && modules.length > 0 ? (
                    <TableBody className="border-b border-gray-300">
                        {modules.map((module, index) => (
                            <TableRow key={module.moduleId} className="hover:bg-gray-300">
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{module.moduleName}</TableCell>
                                <TableCell>{module.description}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-4">
                                        <Pencil
                                            className="cursor-pointer text-blue-500"
                                            onClick={() => setEditData(module)}
                                        />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Trash
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => confirmDelete(module.moduleId)}
                                                />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-md text-gray-700">
                                                        This action cannot be undone. This will permanently delete the module.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
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
                    <TableBody className="border-b-2">
                        <TableRow className="hover:bg-gray-200">
                            <TableCell colSpan={4} className="text-center">
                                <p className="text-md">No Modules Available</p>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )}
            </Table>
        </div>
    );
}

export default Module;
