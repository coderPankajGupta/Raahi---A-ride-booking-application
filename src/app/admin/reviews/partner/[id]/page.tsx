"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";

export default function page() {
  const { id } = useParams();
  async function handleGetPartner() {
    try {
      const { data } = await axios.get(`/api/admin/reviews/partner/${id}`);
      console.log(data);
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    handleGetPartner();
  }, []);
  return <div>page</div>;
}
