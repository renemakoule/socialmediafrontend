'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { AlignLeft } from "lucide-react"; // Assuming you're using lucide icons

const PollDialog = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([{ id: 1, value: "Yes" }, { id: 2, value: "No" }]);

  const addOption = () => {
    setOptions([...options, { id: options.length + 1, value: "" }]);
  };

  const handleChange = (index: number, value: string) => {
    const updatedOptions = options.map((option, i) =>
      i === index ? { ...option, value } : option
    );
    setOptions(updatedOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <>
      <AlignLeft className="w-6 h-6 text-orange-500 cursor-pointer" onClick={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Thread</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="border rounded-md p-2 w-full"
                    placeholder="Add an option"
                  />
                  <button
                    className="text-red-500"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2} // Keep at least 2 options
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                className="text-blue-500 hover:underline"
                onClick={addOption}
              >
                Add another option
              </button>
            </div>
            <button className="w-full bg-gray-300 text-gray-700 p-2 rounded-md" onClick={() => setOpen(false)}>
              Post
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PollDialog;
