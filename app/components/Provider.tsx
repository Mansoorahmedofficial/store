"use client";
import { SessionProvider } from "next-auth/react";

import { ImageKitProvider } from "imagekitio-next";
import React from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;

export default function Provider({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const res = await fetch("/api/imagekit-auth");
      if (!res.ok) {
        throw new Error("failed to authenticate");
      }
      return res.json();
    } catch (error) {
      throw error;
    }
  };

  return (
  <SessionProvider refetchInterval={5*6}>

    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
      >
      {children}
    </ImageKitProvider>
      </SessionProvider>
  );
}
