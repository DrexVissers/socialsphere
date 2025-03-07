"use client";

import { useState } from "react";
import { useMedia } from "@/context/MediaContext";
import { Search, Image as ImageIcon, Film, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize } from "@/lib/media-utils";
import MediaUploader from "./MediaUploader";
import { MediaItem } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaLibraryProps {
  onSelectMedia?: (media: MediaItem) => void;
}

export default function MediaLibrary({ onSelectMedia }: MediaLibraryProps) {
  const { selectMedia, searchMedia, filterByType } = useMedia();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">(
    "all"
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilter = (type: "all" | "image" | "video") => {
    setFilterType(type);
  };

  const filteredItems = filterByType(filterType);
  const searchResults = searchMedia(searchQuery);

  // Combine both filters
  const displayedItems = searchQuery
    ? searchResults.filter(
        (item) => filterType === "all" || item.type === filterType
      )
    : filteredItems;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search media..."
            className="pl-10 bg-background dark:bg-background text-foreground"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Tabs
          value={filterType}
          onValueChange={handleFilter as (value: string) => void}
          className="w-auto"
        >
          <TabsList className="grid grid-cols-3 w-auto min-w-[240px]">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Images</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              <span>Videos</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <MediaUploader />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all bg-card dark:bg-card"
            onClick={() => {
              if (onSelectMedia) {
                onSelectMedia(item);
              } else {
                selectMedia(item.id);
              }
            }}
          >
            <div className="relative">
              <Image
                src={item.thumbnailUrl}
                alt={item.name}
                width={200}
                height={200}
                className="w-full aspect-square object-cover"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-teal-600 border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <p className="font-medium text-sm truncate text-foreground/90 dark:text-foreground/90">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(item.size)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayedItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No media items found</p>
        </div>
      )}
    </div>
  );
}
