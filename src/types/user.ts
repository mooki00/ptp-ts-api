export interface PTPUserInfo {
  Id: string;
  Username: string;
  Avatar: string;
  ProfileText: string;
  JoinDate: string;
  Uploaded: string;
  Downloaded: string;
  Ratio: string;
  RequiredRatio: string;
}

export interface PTPCurrentUserInfo extends PTPUserInfo {
  NewMessages: number;
}

export interface PTPMessageInfo {
  Id: string;
  Subject: string;
  SenderId: string;
  SenderName: string;
  ReceiverId: string;
  ReceiverName: string;
  Sent: string;
  Read: boolean;
  Body: string;
}
