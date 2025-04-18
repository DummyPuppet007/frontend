import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const PermissionFormSkeleton = () => {
    return (
        <div>
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-8 w-[45%] mb-6" />

            <Skeleton className="h-7 w-32 mb-2" />
            <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-48" />
            </div>

            <Skeleton className="h-8 w-[45%] mt-6" />
        </div>
    );
};

export const UserFormSkeleton = () => {
    return (
        <div>
            <h1 className="text-3xl border-b pb-1 mt-4">
                <Skeleton className="h-8 w-48" />
            </h1>
            <div className="space-y-8 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <Skeleton className="h-9 w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    )
}

export const CustomerFormSkeleton = () => {
    return (
        <div>
            <h1 className="text-3xl border-b pb-1 mt-4">
                <Skeleton className="h-8 w-48" />
            </h1>
            <div className="space-y-8 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <Skeleton className="h-9 w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    )
}

export const TableSkeleton = ({ headers }: { headers: string[] }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-300 hover:bg-gray-200">
                    {headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="h-8 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-64" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export const FieldPermissionSkeleton = () => {
    return (
        <div>
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-8 w-[50%] mb-6" />
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-8 w-[50%] mb-6" />
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-8 w-[50%] mb-6" />
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-8 w-[50%] mb-6" />
          
            <Skeleton className="h-8 w-[50%] mb-8" />
            </div>
        )
}