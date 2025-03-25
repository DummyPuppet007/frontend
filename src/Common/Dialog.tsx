
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CommonField, { CommonFieldProps } from "./Fileds";


interface CommonDialogProps {
    title: string;
    description?: string;
    triggerText: string;
    fields?: CommonFieldProps[];
    onSubmit: (data: any) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const CommonDialog: React.FC<CommonDialogProps> = ({
    title,
    description,
    triggerText,
    fields = [],
    onSubmit,
    open,
    onOpenChange
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>{triggerText}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-zinc-200 p-6 rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription className="text-zinc-700">{description}</DialogDescription>}
                </DialogHeader>
                <form onSubmit={onSubmit} className="py-4">
                    {fields.map((field, index) => (
                        <CommonField key={index} {...field} />
                    ))}
                    <DialogFooter>
                        <Button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition">
                            Save changes
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CommonDialog;
