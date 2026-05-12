namespace backend.DTOs
{
public class DashboardStats
    {
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public string BestSellingProduct { get; set; }
        public int FailedAttempts { get; set; }
    }
}