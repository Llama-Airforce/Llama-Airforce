import { Hono } from "hono";
import priceCoins from "./routes/[addresses].get";

// Apps
const price = new Hono();

// Price
price.route("/", priceCoins);

export default price;
