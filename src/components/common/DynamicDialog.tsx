import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// Extend the field types to support more components
type FieldType = 
  | "text" 
  | "number" 
  | "email" 
  | "textarea" 
  | "dropdown-search"
  | "custom";

interface BaseFormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface StandardFormField extends BaseFormField {
  type: "text" | "number" | "email";
}

interface TextareaFormField extends BaseFormField {
  type: "textarea";
  rows?: number;
}

interface DropdownSearchField extends BaseFormField {
  type: "dropdown-search";
  options: Array<{ label: string; value: any }>;
}

interface CustomComponentField extends BaseFormField {
  type: "custom";
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

type FormField = 
  | StandardFormField 
  | TextareaFormField 
  | DropdownSearchField 
  | CustomComponentField;

interface DynamicDialogProps {
  trigger: React.ReactNode;
  title: string;
  fields: FormField[];
  onSubmit: (formData: any) => Promise<void>;
}

const FormFieldComponent = ({ field, value, onChange }: { 
  field: FormField; 
  value: any; 
  onChange: (value: any) => void;
}) => {
  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={field.name}
          placeholder={field.placeholder}
          required={field.required}
          className={`col-span-3 border border-gray-300 ${field.className || ''}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows || 3}
        />
      );

    case "dropdown-search":
      return (
        <div className="col-span-3">
          {/* Replace with your DropdownSearch component */}
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full ${field.className || ''}`}
          >
            <option value="">Select...</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "custom":
      const CustomComponent = field.component;
      return (
        <div className="col-span-3">
          <CustomComponent
            {...field.props}
            value={value}
            onChange={onChange}
          />
        </div>
      );

    default:
      return (
        <Input
          id={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          className={`col-span-3 ${field.className || ''}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};

export function DynamicDialog({ trigger, title, fields, onSubmit }: DynamicDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  {field.label}
                </Label>
                <FormFieldComponent
                  field={field}
                  value={formData[field.name]}
                  onChange={(value) => handleInputChange(field.name, value)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
