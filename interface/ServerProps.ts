import { Member } from "./Member";

export interface ServerProps {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  usersId: string;
  ServerBannerImg: string;
  ServerBannerColor: string;
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
}
