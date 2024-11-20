type Pay = {
  id: string;
  order_id: string;
  user_id: string;
  amount: string;
  currency: string;
  tx_id: string;
  method: string;
  status: string;
  is_via_admin: boolean;
  approved_time: string;
  approved_opinion: string;
  proof: string;
  dateline: string;
};

type OrderHasPay = {
  has_pay: boolean;
  pay: Pay | null;
};
