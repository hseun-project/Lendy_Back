export interface UserInfoResponse {
  email: string;
  name: string;
  creditScore: number;
  banks: {
    bankName: string;
    bankNumberMasked: string;
  }[];
}
