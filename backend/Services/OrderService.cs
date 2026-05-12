using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;

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
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_PlaceOrder @CustomerID={0}, @ProductID={1}, @Quantity={2}, @TotalAmount={3}",
                    request.CustomerID, request.ProductID, request.Quantity, request.TotalAmount);
                
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba: {ex.Message}");
                return false;
            }
        }

        public async Task<List<OrderModel>> GetAllOrders() 
            => await _context.Orders.Include(o => o.Customer).ToListAsync();
    }
}