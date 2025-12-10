import React from "react";

interface RingBadgeProps {
  text: string;
  size?: number;
  thickness?: number;
}

const RingBadge: React.FC<RingBadgeProps> = ({
  text,
  size = 25,
  thickness = 3,
}) => {
  // Color logic based on text
  const getColors = () => {
    switch (text.toUpperCase()) {
      case "A":
        return { ring: "border-green-500", text: "text-green-600" };
      case "B":
        return { ring: "border-orange-500", text: "text-orange-600" };
      default:
        return { ring: "border-orange-500", text: "text-gray-600" };
    }
  };

  const { ring, text: textColor } = getColors();

  return (
    <div
      className={`flex items-center justify-center rounded-full border ${ring} ${textColor}`}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
      }}
    >
      <span className="text-xs font-semibold text-center">{text}</span>
    </div>
  );
};

export default RingBadge;
