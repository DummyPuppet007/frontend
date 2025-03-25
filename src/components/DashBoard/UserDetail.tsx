import { UserData } from "@/types/user.type";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserDetailModalProps {
    user: UserData | null;
    onClose: () => void;
}

export default function UserDetail({ user, onClose }: UserDetailModalProps) {
    if (!user) return null;

    return (
        <Dialog open={!!user} onOpenChange={onClose}>
            <DialogContent className="max-w-lg sm:max-w-2xl p-6 rounded-lg shadow-lg">
                <DialogHeader className="border-b pb-1">
                    <DialogTitle className="text-2xl font-medium">User Details</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
                    <DetailRow label="Full Name" value={`${user.firstname} ${user.lastname}`} isRequired />
                    <DetailRow label="Email" value={user.email} isRequired />
                    <DetailRow label="Login ID" value={user.username} />
                    <DetailRow label="User Role" value={user.role.roleName} />
                    <DetailRow label="Created Date" value={formatDate(user.createdAt)} />
                </div>

                <DialogFooter className="border-t pt-3 flex justify-end">
                    <DialogClose asChild>
                        <Button className="px-4 py-2 text-sm">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DetailRow({ label, value, isRequired = false }: { label: string; value?: string; isRequired?: boolean }) {
    return (
        <div className="flex flex-col">
            <span className="text-zinc-600 text-sm font-medium">{label} :</span>
            <span className="text-zinc-900 font-medium">{isRequired ? value : value || "..............."}</span>
        </div>
    );
}

function formatDate(dateString?: string): string {
    return dateString ? new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    }) : "...............";
}
