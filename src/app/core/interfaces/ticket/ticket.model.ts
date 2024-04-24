export interface Ticket {
  matchId: string;
  section: number;
  row: number;
  seat: number;
  orderId?: string | null;
  price: number;
}
