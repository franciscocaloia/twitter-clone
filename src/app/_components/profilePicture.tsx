import Image from "next/image";

type ProfileImageProps = {
  src?: string | null;
  className?: string;
};
export const ProfilePicture = ({ src, className = "" }: ProfileImageProps) => {
  return (
    <div
      className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
    >
      {src ? <Image quality={100} fill src={src} alt="Profile Image" /> : null}
    </div>
  );
};
