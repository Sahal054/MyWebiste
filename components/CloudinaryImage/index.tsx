"use client";
import { CldImage, CldImageProps } from 'next-cloudinary';

// Re-usable wrapper — accepts all CldImage props
export default function CloudinaryImage({ alt = '', ...props }: CldImageProps) {
  return <CldImage alt={alt} {...props} />;
}