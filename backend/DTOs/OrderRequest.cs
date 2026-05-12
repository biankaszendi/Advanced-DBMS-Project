namespace backend.DTOs
{
    public class OrderRequest
    {
        public int CustomerID { get; set; }
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
    }
}