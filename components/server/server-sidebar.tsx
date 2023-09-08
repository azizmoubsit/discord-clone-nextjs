import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "@/components/server/server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "@/components/server/server-search";
import { Hash, Mic, Shield, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface ServerSidebarProps {
  serverId: string;
}

const chennlelIconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: <Shield className="w-4 h-4" />,
  [MemberRole.ADMIN]: <ShieldCheck className="w-4 h-4" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4" />,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
  const members = server?.members.filter((member) => member.profileId !== profile.id);
  const role = server?.members.find((member) => member.profileId === profile.id)?.role;

  const serverSearchData = [
    {
      label: "Text Channels",
      type: "channel",
      data: textChannels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: chennlelIconMap[channel.type],
      })),
    },
    {
      label: "Audio Channels",
      type: "channel",
      data: audioChannels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: chennlelIconMap[channel.type],
      })),
    },
    {
      label: "Video Channels",
      type: "channel",
      data: videoChannels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: chennlelIconMap[channel.type],
      })),
    },
    {
      label: "Members",
      type: "member",
      data: members.map((member) => ({
        id: member.id,
        name: member.profile.name,
        icon: roleIconMap[member.role],
      })),
    },
  ];

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={serverSearchData} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
