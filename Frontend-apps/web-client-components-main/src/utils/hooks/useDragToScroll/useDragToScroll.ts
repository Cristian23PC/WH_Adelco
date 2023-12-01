import classNames from 'classnames';
import { type RefObject, useState } from 'react';

interface dragToScrollData {
  ref: RefObject<HTMLDivElement>;
  isScrollActive: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseUp: VoidFunction;
  dragStyleClasses: string;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseLeave: VoidFunction;
}
const useDragToScroll = (ref: RefObject<HTMLDivElement>): dragToScrollData => {
  const [isDown, setIsDown] = useState(false);
  const [isScrollActive, setIsScrollActive] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent): void => {
    const targetNodeName = (e.target as HTMLDivElement).nodeName;
    const excludedTargets = ['svg', 'path', 'BUTTON', 'SPAN'];
    if (!excludedTargets.includes(targetNodeName)) {
      if (ref.current != null) {
        setIsDown(true);
        setIsScrollActive(true);
        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
      }
    }
  };

  const handleMouseUp = (): void => {
    if (ref.current != null) {
      setIsDown(false);
      setIsScrollActive(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (ref.current != null) {
      if (!isDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 2;
      ref.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseLeave = (): void => {
    if (ref.current != null) {
      setIsDown(false);
      setIsScrollActive(false);
    }
  };

  return {
    ref,
    isScrollActive,
    dragStyleClasses: classNames(
      { 'active cursor-grabbing': isScrollActive },
      { 'cursor-grab': !isScrollActive }
    ),
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave
  };
};

export default useDragToScroll;
