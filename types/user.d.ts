type User = {
  id: string;
  email: string;
  nickname: string;
  status: string;
  dateline: string;
  kind: string;
  sub_exp: string;
  points: string;
  allow_device_num: number;
  session_exp: number;
};

type UserForm = User & { password?: string; re_password?: string };
