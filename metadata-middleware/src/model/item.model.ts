import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { UserDocument } from "./user.model";

export interface ItemDocument extends mongoose.Document {
  // user: UserDocument["_id"];
  itemId: number;
  description: string; 
  external_url: string; 
  image: string;
  name: string;
  attributes: Array<{}>;
}

const ItemSchema = new mongoose.Schema(
  {
    itemId: { type: Number, default: 0 },
    description: { type: String, default: "Collectible item" },
    external_url: { type: String, default: "https://safient.io" },
    image: { type: String, default: "https://ipfs.safient.io/ipfs/bafybeia34akcknjn5t5w7i427r2vcqpyytdfc3h5phw6d52f6vcoodsmna/79969857.png" },
    name: { type: String, default: "Safient Badge" },
    attributes: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Item = mongoose.model<ItemDocument>("Item", ItemSchema);

export default Item;


