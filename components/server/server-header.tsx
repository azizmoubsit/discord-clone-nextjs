"use client";

import { ChevronDown, PlusCircle, Settings, UserPlus, Users } from "lucide-react";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="w=5 h-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-0.5">
        {isModerator && (
          <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-3 text-sm cursor-pointer">
            Invite people <UserPlus className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <>
            <DropdownMenuItem className="px-3 py-3 text-sm cursor-pointer">
              Server settings <Settings className="w-5 h-5 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem className="px-3 py-3 text-sm cursor-pointer">
              Manage members <Users className="w-5 h-5 ml-auto" />
            </DropdownMenuItem>
          </>
        )}
        {isModerator && (
          <>
            <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-3 text-sm cursor-pointer">
              Create channel <PlusCircle className="w-5 h-5 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
