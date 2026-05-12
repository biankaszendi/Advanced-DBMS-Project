using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

       [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderRequest request)
        {
            try 
            {
                var success = await _orderService.PlaceOrderAsync(request);
                
                if (success)
                {
                    return Ok(new { message = "Order placed successfully!" });
                }

                return BadRequest(new { message = "Order failed" });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("stock"))
                {
                    return BadRequest(new { message = "Low stock" });
                }
                return BadRequest(new { message = "Database error: " + ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            return Ok(await _orderService.GetAllOrders());
        }

        [HttpPatch("{id}/ship")]
        public async Task<IActionResult> ShipOrder(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();

            await _orderService.ShipOrderAsync(order);

            return Ok(new { message = "Order shipped successfully!" });
        }
    }
}