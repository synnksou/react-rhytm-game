import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";

const ModalUser = ({ isOpen, onOpen, onClose }) => {
  const [name, setName] = React.useState(() => {
    const saved = localStorage.getItem("name");
    const initialValue = JSON.parse(saved);
    return initialValue || "";
  });

  useEffect(() => {
    localStorage.setItem("name", JSON.stringify(name));
  }, [name]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Votre Pseudo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <Input
                type="text"
                placeholder="Pseudo"
                aria-label="fullname"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Fermer
            </Button>
            <Button type="submit" onClick={onClose}>
              Entrer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalUser;
