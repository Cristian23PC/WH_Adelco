import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import useScreen from '../../../utils/hooks/useScreen/useScreen';

interface UseMenuItemsProps {
  itemsLength: number;
  maxOptions: number;
}

interface UseMenuItemsReturnType {
  menuItemsRef: MutableRefObject<HTMLUListElement | null>;
  menuHeight: string;
  onCloseMenuItems: VoidFunction;
  onOpenMenuItems: VoidFunction;
  isMenuItemsOpen: boolean;
}

const useMenuItems = ({
  itemsLength,
  maxOptions
}: UseMenuItemsProps): UseMenuItemsReturnType => {
  const menuItemsRef = useRef<HTMLUListElement | null>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const [isMenuItemsOpen, setIsMenuItemsOpen] = useState(false);
  const { isMobile } = useScreen();

  useEffect(() => {
    if (menuItemsRef.current && isMenuItemsOpen) {
      const itemHeight =
        menuItemsRef.current?.children[0]?.clientHeight || (isMobile ? 52 : 32);
      setMenuHeight(itemHeight * Math.min(maxOptions, itemsLength));
    }
  }, [isMenuItemsOpen, itemsLength]);

  return {
    menuItemsRef,
    menuHeight: `${menuHeight}px`,
    onCloseMenuItems: () => {
      setIsMenuItemsOpen(false);
    },
    onOpenMenuItems: () => {
      setIsMenuItemsOpen(true);
    },
    isMenuItemsOpen
  };
};

export default useMenuItems;
