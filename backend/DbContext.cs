using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class DbContext : DbContext
    {
        public DbContext(DbContextOptions<DbContext> options) : base(options) { }

        public DbSet<ProductModel> Products { get; set; }
        public DbSet<CustomerModel> Customers { get; set; }
        public DbSet<OrderModel> Orders { get; set; }
        public DbSet<OrderDetailModel> OrderDetails { get; set; }
    }
}