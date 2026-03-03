"use client";

import { MoreVertical } from "lucide-react";
import { Suspense } from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { createClient } from "@/utils/supabase/client";

export function CardDropDown({ storage_path, onDelete }: { storage_path: string, onDelete: () => void }) {
  const supabase = createClient();

  async function deleteFile() {
    console.log(storage_path);

    const { data: deleteFileStorage, error: deleteFileStorageError } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
      .remove([storage_path]);

    if (deleteFileStorageError) {
      console.error("Error while deleting the file from storage -", deleteFileStorageError);
    }

    const { error: deleteFileRowError } =
      await supabase.from("files").delete().eq("storage_path", storage_path);

    if (deleteFileRowError) {
      console.error(deleteFileRowError);
    } else {
      onDelete();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#1c1c1e] border-white/10 text-white"
      >
        <Suspense>
          <Suspense>
            <DropdownMenuItem
              onClick={deleteFile}
              className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </Suspense>
        </Suspense>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
