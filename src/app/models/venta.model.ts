export interface CantidadTicketCreate {
  product_id: number;
  cantidad_prod_ticket: number;
}

export interface TicketCreate {
  buyer_id: number; 
  event_id: number; 
  ticket_items: CantidadTicketCreate[]; 
}

export interface TicketResponse {
  id: number;
  buyer_id: number;
  event_id: number;
  sale_date: string; 
  price_ticket: number; 
}
