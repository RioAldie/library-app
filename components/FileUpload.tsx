'use client';

import config from '@/lib/config';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import Image from 'next/image';
import { useRef, useState } from 'react';
interface Props {
  type: 'image' | 'video';
  accept: string;
  placeholder: string;
  folder: string;
  variant: 'dark' | 'light';
  onFileChange: (filePath: string) => void;
  value?: string;
}
const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;
const authenticator = async () => {
  try {
    const response = await fetch(
      `${config.env.apiEndpoint}/api/auth/imagekit`
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    console.log('data =>', data);

    return { token, expire, signature };
  } catch (error) {}
};

const FileUpload = ({ onFileChange }: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ url: string } | null>(null);

  const onError = (error: any) => {
    console.log(error);
    toast({
      title: ` upload failed`,
      description: `Your  could not be uploaded. Please try again.`,
      variant: 'destructive',
    });
  };
  const onSuccess = (res: any) => {
    setFile(res);

    console.log(res);
    onFileChange(res.filePath);
    toast({
      title: ` uploaded successfully`,
      description: `uploaded successfully!`,
    });
  };
  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}>
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="test-upload.png"
      />
      <button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();

          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}>
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
          onClick={(e) => {
            e.preventDefault();

            if (ikUploadRef.current) {
              // @ts-ignore
              ikUploadRef.current?.click();
            }
          }}
        />{' '}
        <p className={cn('text-base')}>upload a file</p>
        {file && <p className={cn('upload-filename')}>{file.url}</p>}
      </button>

      {file && (
        <Image
          alt={file.url}
          src={file.url}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
