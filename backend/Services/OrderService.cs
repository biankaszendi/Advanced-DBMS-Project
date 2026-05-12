using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;
using Microsoft.Data.SqlClient;

namespace backend.Services
{
    public class OrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> PlaceOrderAsync(OrderRequest request)
        {
            try
            {
                var p1 = new SqlParameter("@CustomerID", request.CustomerID);
                var p2 = new SqlParameter("@ProductID", request.ProductID);
                var p3 = new SqlParameter("@Quantity", request.Quantity);
                var p4 = new SqlParameter("@TotalAmount", request.TotalAmount);

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_PlaceOrder @CustomerID, @ProductID, @Quantity, @TotalAmount", 
                    p1, p2, p3, p4);
                
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SQL Error: {ex.Message}");
                throw; 
            }
        }

        public async Task<List<OrderModel>> GetAllOrders() 
            => await _context.Orders.Include(o => o.Customer).ToListAsync();
    }
}