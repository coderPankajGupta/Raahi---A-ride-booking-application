"use client";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useGetMe(enabled: boolean) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) {
      return;
    }
    async function getMe() {
      try {
        const { data } = await axios.get(`/api/user/me`);
        dispatch(setUserData(data));
      } catch (error) {
        console.log(error);
      }
    }
    getMe();
  }, [enabled]);
}
