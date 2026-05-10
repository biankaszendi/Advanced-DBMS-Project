using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class OrderModel
    {
        [Key]
        public int OrderID { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public int CustomerID { get; set; }
        public required CustomerModel Customer { get; set; }
    }
}