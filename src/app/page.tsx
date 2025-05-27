'use client'
import { useGetTodosQuery } from "@/api/apiSlice";
import Image from "next/image";
import Todo from "./todo";

export default function Home() {
  const { data, error, isLoading } = useGetTodosQuery();

  console.log(data)

  return (
    <div>
      <Todo/>
    </div>
  );
}
