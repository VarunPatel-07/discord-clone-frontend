import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
function ColorPicker({
  DefaultColor,
  setChangedColor,
}: {
  DefaultColor: string;
  setChangedColor: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [color, setColor] = useState(DefaultColor);

  return (
    <SketchPicker
      color={color}
      onChange={(color) => {
        setColor(color.hex);
        setChangedColor(color.hex);
      }}
    />
  );
}

export default ColorPicker;
