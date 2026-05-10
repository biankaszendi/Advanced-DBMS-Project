using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string ProductName { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public int StockLevel { get; set; }
        
        public string? Category { get; set; }
        
        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }
}