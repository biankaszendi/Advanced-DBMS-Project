using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductModel>> GetAllProducts() 
            => await _context.Products.ToListAsync();

        public async Task<ProductModel?> GetProductById(int id) 
            => await _context.Products.FindAsync(id);

        public async Task<ProductModel> CreateProduct(ProductModel product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> UpdateProduct(int id, ProductModel updatedProduct)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            product.ProductName = updatedProduct.ProductName;
            product.Price = updatedProduct.Price;
            product.StockLevel = updatedProduct.StockLevel;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}