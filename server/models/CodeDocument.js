import mongoose from "mongoose";

const codeDocumentSchema = new mongoose.Schema({
  _id: String,
  data: Object,
})

export default mongoose.model("CodeDocument", codeDocumentSchema);
