import React from "react";
import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 100,
  height = 100,
  className,
}) => (
  <Image
    src="/logo.svg"
    height={height}
    width={width}
    alt="Logo"
    priority
    className={className}
    style={{
      width: width ? `${width}px` : "auto",
      height: height ? `${height}px` : "auto",
    }}
  />
);

export default Logo;