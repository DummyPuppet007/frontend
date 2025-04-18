import CommonDialog from "@/components/common/Dialog"
import { createPowerRating } from "@/services/ProductionService";
import { PowerRatingData } from "@/types/production.type";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type PowerRatingFormProps = {
    refreshPowerRatings: () => void;
};

const PowerRatingForm: React.FC<PowerRatingFormProps> = ({refreshPowerRatings}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const { control, handleSubmit, reset } = useForm<PowerRatingData>({
        defaultValues : {
            powerRating : "",
        }
    });

    const onSubmitPowerRating: SubmitHandler<PowerRatingData> = async (data) => {
        try {
            const response = await createPowerRating(data);

            if (!response || response.statusCode !== 200) {
                toast.error("Failed to create Power Rating : " + response.message);
                return;
            } else {
                toast.success(response.message);
                setIsDialogOpen(false);
                reset();
                refreshPowerRatings();
            }

        } catch (error: any) {
            toast.error("Error : " + error.message);
        }
    }

    return (
        <CommonDialog
            title="Add Power Rating"
            description="Enter Power Rating. Click save when done."
            triggerText="Add Power Rating"
            fields={[
                {
                    name: "powerRating",
                    control,
                    label: "Power Rating",
                    type: "text",
                    placeholder: "Enter power rating",
                    rules: { required: "Power rating is required", minLength: { value: 2, message: "At least 2 characters required" } },
                },
            ]}
            onSubmit={handleSubmit(onSubmitPowerRating)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    )
}

export default PowerRatingForm;