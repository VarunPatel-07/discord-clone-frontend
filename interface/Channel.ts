import { ServerProps } from "./ServerProps";

export interface Channel {
  id: string;
  name: string;
  type: string;
  userId: string;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
  server: ServerProps;
}
