using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class OrderDetailModel
    {
        [Key]
        public int OrderDetailID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int OrderID { get; set; }
        public required OrderModel Order { get; set; }
        public int ProductID { get; set; }
        public required ProductModel Product { get; set; }
    }
}