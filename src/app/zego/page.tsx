"use client";
import { RootState } from "@/redux/store";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useRef } from "react";
import { useSelector } from "react-redux";

export default function page() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { userData } = useSelector((state: RootState) => state.user);

  async function startCall() {
    if (!containerRef) return null;
    try {
      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET as string;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret!,
        "dfdfg",
        userData?._id.toString()!,
        "pankaj",
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div ref={containerRef} className="h-screen">
      <button onClick={startCall}>Click</button>
    </div>
  );
}
