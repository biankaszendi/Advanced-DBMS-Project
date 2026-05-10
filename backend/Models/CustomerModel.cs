using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class CustomerModel
    {
        [Key]
        public int CustomerId { get; set; }
        
        [Required]
        public string FullName { get; set; }
        
        public string? Email { get; set; }
        
        // because of DQS
        public string? City { get; set; }        // original (pl. "budapst")
        public string? CleanedCity { get; set; } // fixed
        
        public string? Country { get; set; }
        
        public ICollection<OrderModel> Orders { get; set; }
    }
}