import { User } from "./UserProps";

export interface Member {
  id: string;
  role: string;
  userId: string;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}
