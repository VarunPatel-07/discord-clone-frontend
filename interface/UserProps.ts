export interface User {
  id: string;
  FullName: string;
  Email: string;
  UserName: string;
  Password: string;
  Is_Online: boolean;
  Is_Email_Verified: boolean;
  Profile_Picture: string;
  createdAt: Date;
  updatedAt: Date;
  ProfileBanner_Img: string;
  ProfileBanner_Color: string;
  ProfileBgColor: string;
  TwoFactorAuth: boolean;
}
