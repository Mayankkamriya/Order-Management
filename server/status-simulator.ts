import { OrderModel } from "./models";
import { log } from "./index";

const statusProgression = [
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

export function startStatusSimulator() {
  setInterval(async () => {
    try {
      const activeOrders = await OrderModel.find({
        status: { $ne: "Delivered" },
      });

      for (const order of activeOrders) {
        const currentIndex = statusProgression.indexOf(order.status);
        if (currentIndex < statusProgression.length - 1) {
          const nextStatus = statusProgression[currentIndex + 1];
          await OrderModel.findByIdAndUpdate(order._id, {
            status: nextStatus,
          });
          log(
            `Order ${order._id} status updated: ${order.status} -> ${nextStatus}`,
            "simulator"
          );
        }
      }
    } catch (error) {
      log(`Status simulator error: ${error}`, "simulator");
    }
  }, 15000);
}
