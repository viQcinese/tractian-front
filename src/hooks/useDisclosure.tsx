import * as React from 'react';

export default function useDisclosure() {
  const [isOpen, setIsOpen] = React.useState(false);

  function onOpen() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }

  function onToggle() {
    setIsOpen((previous) => !previous);
  }

  return { isOpen, onOpen, onClose, onToggle };
}
