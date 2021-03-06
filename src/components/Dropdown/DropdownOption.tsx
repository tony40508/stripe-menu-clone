import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDropdown } from "../../hooks/useDropdown";
import useDimensions from "../../hooks/useDimensions";

type DropdownOptionProps = {
  name: string;
  content: React.FC;
};

let lastOptionId = 0;

function DropdownOption({ name, content: Content }: DropdownOptionProps) {
  const { current: id } = useRef(++lastOptionId);
  const [registered, setRegistered] = useState(false);

  const { setRef, dimensions } = useDimensions();
  const {
    registerOptions,
    updateOption,
    setTargetId,
    targetId,
  } = useDropdown();

  useEffect(() => {
    const optionDimensions = dimensions as DOMRect;
    if (!registered && dimensions) {
      const WrappedContent = () => {
        const contentRef = useRef<any>();

        useEffect(() => {
          const contentDimensions = contentRef.current.getBoundingClientRect();
          updateOption(id, { contentDimensions });
        }, []);

        return (
          <div ref={contentRef}>
            <Content />
          </div>
        );
      };

      registerOptions({
        id,
        optionDimensions,
        optionCenterX: optionDimensions.x + optionDimensions.width / 2,
        WrappedContent,
      });

      setRegistered(true);
    } else if (registered && dimensions) {
      updateOption(id, {
        optionCenterX: optionDimensions.x + optionDimensions.width / 2,
      });
    }
  }, [Content, dimensions, id, registerOptions, registered, updateOption]);

  const handleOpen = () => setTargetId(id);
  const handleClose = () => setTargetId(-1);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    return targetId === id ? handleClose() : handleOpen();
  };

  return (
    <motion.button
      className="dropdown-option"
      ref={setRef}
      onMouseDown={handleClick}
      onHoverStart={handleOpen}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      {name}
    </motion.button>
  );
}

export default DropdownOption;
