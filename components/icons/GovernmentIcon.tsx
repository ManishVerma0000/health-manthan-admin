import React from "react";

type IconProps = {
  size?: number;
  className?: string;
};

const GovernmentIcon: React.FC<IconProps> = ({ size = 18, className }) => {
  return (
    <>
      <svg
        width="51"
        height="47"
        viewBox="0 0 51 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.016 38V12.08H11.72V22.928H17.032V12.08H21.736V38H17.032V26.288H11.72V38H7.016Z"
          fill="#1E00FF"
        />
        <path
          d="M25.638 38L26.086 12.08H30.982L34.662 30.032L38.502 12.08H43.238L43.718 38H40.198L39.814 19.984L36.134 38H33.286L29.542 19.92L29.19 38H25.638Z"
          fill="#A7CF36"
        />
      </svg>
    </>
  );
};

export default GovernmentIcon;
