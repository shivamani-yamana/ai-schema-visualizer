"use client";
import React from "react";
import {
  Textarea,
  Button,
  // SelectItem,
  // Select,
  // Modal,
  // ModalContent,
  // ModalHeader,
  // ModalBody,
  // ModalFooter,
  // useDisclosure,
  Alert,
} from "@heroui/react";
import { ArrowUp } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
// import { FaPlus } from "react-icons/fa6";

export default function PromptInput() {
  const { isLoading, userInput, setUserInput, handleSubmit } = useAppStore();
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center p-10 w-full h-fit">
      <div className="flex items-center gap-2 bg-[#262626] p-2 border-1 border-gray-700 rounded-2xl w-full max-w-3xl">
        {/* {mode === "sql" && <DBSchemaInput />} */}
        <Textarea
          value={userInput}
          onValueChange={setUserInput}
          onKeyDown={handleKeyPress}
          placeholder="Enter a prompt here"
          aria-label="Prompt input"
          variant="bordered"
          minRows={1}
          maxRows={4}
          className="flex-1"
          classNames={{
            base: "w-full",
            inputWrapper:
              "bg-transparent border-none shadow-none data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:bg-transparent",
            input:
              "textarea-scrollbar overflow-y-auto resize-none text-base bg-transparent",
          }}
        />
        {/* <ModeSelection /> */}
        {/* Send Button */}
        <Button
          isIconOnly
          radius="full"
          onPress={handleSubmit}
          aria-label="Send prompt"
          isDisabled={!userInput.trim() || isLoading}
          className="self-end bg-[#a3c3d8] hover:bg-[#9bd0ff] disabled:bg-[#4c5a66] disabled:cursor-not-allowed"
        >
          <ArrowUp className="w-5 h-5 text-[#000000]" />
        </Button>
      </div>
    </div>
  );
}

// function ModeSelection() {
//   const modes = [
//     { key: "sql", label: "Query" },
//     {
//       key: "schema",
//       label: "Schema",
//     },
//   ];

//   const { mode, setMode } = useAppStore();

//   return (
//     <Select
//       className="max-w-[110px]"
//       value={mode}
//       defaultSelectedKeys={[mode]}
//       onChange={(e) => {
//         setMode(e.target.value as "schema" | "sql");
//       }}
//       aria-label="Prompt mode selection"
//     >
//       {modes.map((mode) => (
//         <SelectItem key={mode.key}>{mode.label}</SelectItem>
//       ))}
//     </Select>
//   );
// }

// function DBSchemaInput() {
//   type backdropType = "opaque" | "blur" | "transparent";
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [backdrop, setBackdrop] = React.useState<backdropType>("opaque");
//   const { dbSchemaInput, setDbSchemaInput } = useAppStore();

//   const [input, setInput] = useState<string>(dbSchemaInput);

//   const handleOpen = (backdrop: backdropType) => {
//     setBackdrop(backdrop);
//     onOpen();
//   };
//   return (
//     <>
//       <Button
//         isIconOnly
//         radius="full"
//         color="primary"
//         variant="flat"
//         aria-label="Add database schema"
//         onPress={() => handleOpen("blur")}
//         className="flex justify-center items-center bg-transparent m-0 p-0 min-w-0 min-h-0 text-white"
//       >
//         <FaPlus className="w-4 h-4" />
//       </Button>

//       <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">
//                 Add Your Database Schema
//               </ModalHeader>
//               <ModalBody>
//                 <Textarea
//                   isClearable
//                   defaultValue={dbSchemaInput}
//                   placeholder="Description"
//                   variant="bordered"
//                   onChange={(e) => {
//                     setInput(e.target.value);
//                   }}
//                   onClear={() => setInput("")}
//                 />
//               </ModalBody>
//               <ModalFooter>
//                 <Button
//                   color="default"
//                   disabled={!input}
//                   onPress={() => {
//                     if (!input) return;
//                     setDbSchemaInput(input);
//                     setInput("");
//                     onClose();
//                   }}
//                 >
//                   Add
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }
