import React from "react";
import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 100, height = 100, className }) => (
  <Image
    src="/logo.svg"
    height={64}
    width={64}
    className="dark:invert"
    alt="Logo"
    priority
  />
);

export default Logo;