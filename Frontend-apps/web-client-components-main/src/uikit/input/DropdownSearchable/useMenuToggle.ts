import { useRef, useEffect, useState, type MutableRefObject } from 'react';

interface UseMenuToggleReturnType {
  menuToggleRef: MutableRefObject<HTMLInputElement | null>;
  menuToggleHeight: number;
}

const useMenuToggle = (): UseMenuToggleReturnType => {
  const menuToggleRef = useRef<HTMLInputElement>(null);
  const [menuToggleHeight, setMenuToggleHeight] = useState(0);

  useEffect(() => {
    if (menuToggleRef.current) {
      setMenuToggleHeight(menuToggleRef.current.clientHeight || 0);
    }
  }, []);

  return {
    menuToggleRef,
    menuToggleHeight
  };
};

export default useMenuToggle;
