import { useState } from 'react';

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalToggle = (value?: boolean) => {
    if (typeof value === 'boolean') {
      setIsModalOpen(value);
      return;
    }
    setIsModalOpen((prevState) => !prevState);
  };

  return { modalToggle, isModalOpen };
};
