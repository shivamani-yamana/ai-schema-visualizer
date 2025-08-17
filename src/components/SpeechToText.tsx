"use client";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@heroui/react";
import { MicIcon } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

function SpeechToText() {
  const { setUserInput } = useAppStore();
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={() => {
          if (!browserSupportsSpeechRecognition) return;
          SpeechRecognition.startListening({
            continuous: true,
            language: "en-US",
          });
          onOpen();
        }}
        disabled={!browserSupportsSpeechRecognition}
        className="self-end bg-[#a3c3d8] hover:bg-[#9bd0ff] disabled:bg-[#4c5a66] p-2 rounded-full w-10 min-w-2 h-10 disabled:cursor-not-allowed"
      >
        <MicIcon className="w-4 h-4 text-[#000000]" />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        onClose={() => {
          SpeechRecognition.abortListening();
          onOpenChange();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <p className="mb-0 p-2 pb-0">
                  {!transcript && "Listening...."}
                  {transcript}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={resetTranscript}
                >
                  Reset
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    setUserInput(transcript);
                    SpeechRecognition.stopListening();
                    onOpenChange();
                  }}
                >
                  {listening ? "Stop" : "Accept"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SpeechToText;
