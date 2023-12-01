import { useEffect, type RefObject } from 'react';

const useClickOutside = <T extends HTMLElement>(
  refs: RefObject<T> | Array<RefObject<T>>,
  onClickOutside: VoidFunction,
  isOpen: boolean
): void => {
  const normalizeRefs = Array.isArray(refs) ? refs : [refs];

  const handleClickOutside = (event: MouseEvent): void => {
    const isClickInsideRef = normalizeRefs.find((ref) =>
      ref?.current?.contains(event.target as Node)
    );

    if (isClickInsideRef === undefined && isOpen) {
      onClickOutside();
    }
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && isOpen) {
      onClickOutside();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [refs, onClickOutside]);
};

export default useClickOutside;
