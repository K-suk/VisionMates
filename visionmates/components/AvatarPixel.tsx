import Image from "next/image";

type Props = {
  src?: string;
  alt?: string;
  size?: number; // px
};

export default function AvatarPixel({ src = "/ui/avatar.png", alt = "avatar", size = 40 }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="pixel-frame rounded"
      style={{ width: size, height: size }}
    />
  );
}
