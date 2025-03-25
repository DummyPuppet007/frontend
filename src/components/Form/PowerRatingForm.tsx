import CommonDialog from "@/Common/Dialog";
import { createPowerRating } from "@/services/ProductionService";
import { PowerRatingData } from "@/types/production.type";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type PowerRatingFormProps = {
    refreshPowerRatings: () => void;
};

const PowerRatingForm: React.FC<PowerRatingFormProps> = ({refreshPowerRatings}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { control, handleSubmit, reset } = useForm<PowerRatingData>({
        defaultValues : {
            powerRating : "",
        }
    });

    const onSubmitPowerRating: SubmitHandler<PowerRatingData> = async (data) => {
        setError("");
        try {
            const response = await createPowerRating(data);

            if (!response || response.statusCode !== 200) {
                setError(response.message);
            } else {
                setIsDialogOpen(false);
                reset();
                refreshPowerRatings();
            }

        } catch (error: any) {
            setError(error.message);
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