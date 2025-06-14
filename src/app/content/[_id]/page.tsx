"use client";
import api from "@/services/api";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/ContentBreadcrumbs";
import { useParams } from "next/navigation";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";


interface Content {
  _id: string;
  title: string;
  description?: string;
  url: string;
  type: "video" | "image" | "article";
  category: string;
  tags?: string[];
  createdAt?: string;
  views?: number;
}

export default function ContentDetail() {
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams() as { _id: string };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api(`/content/${params._id}`);
        if (!data?.data) {
          throw new Error("Content not found");
        }
        setContent(data.data);
      } catch (error) {
        console.error("Error fetching content:", error);
        setError("Error loading content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [params._id]);



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="text-gray-400">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-400 hover:text-blue-300"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!content) return <div>Content not found</div>;

  return (
    <div className="flex flex-col min-h-screen   max-w-5xl mx-auto mt-30 sm:mt-20 md:mt-28 lg:mt-20">
      <Breadcrumb currentTitle={content.title} />
      <div className="flex flex-col rounded-xl shadow-lg border-[1px] bg-gradient-to-br from-[#0a0f14] to-[#001111] text-white mt-2">
        <div className="flex flex-col md:flex-row justify-between gap-y-5 items-center p-4">
          <div className="flex items-center space-x-4">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full cursor-pointer">
              
            </span>
            <div>
              <h1 className="text-sm md:text-xl font-bold">{content.title}</h1>
              
            </div>
          </div>
          <div className="flex gap-x-2">
            <span className="text-[#10ff2b] rounded-lg px-2 py-1  text-md uppercase font-bold ">
              {content.category}
            </span>
           
          </div>
        </div>
      </div>
      <article className=" shadow-lg   overflow-hidden mt-8">
        <div className="relative w-full h-48 md:h-72">
          <Image
            src={content.url}
            alt={content.title}
            fill
            sizes="(max-width: 400px) 50vw, (max-width: 800px) 50vw, 33vw"
            className="object-cover border-4  rounded-xl"
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
           
            {content.tags && content.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {content.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[#10ff2b] font-semibold bg-[#000000] border-[#10ff2b] border capitalize rounded-lg px-2 py-1 hover:bg-[#003300] hover:text-[#10ff2b] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(
                  new Date(content.createdAt || Date.now()),
                  "MMM dd, yyyy"
                )}
              </span>
            </div>
            {content.views && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{content.views} views</span>
              </div>
            )}
          </div>

          {content.description && (
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
              {content.description}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
