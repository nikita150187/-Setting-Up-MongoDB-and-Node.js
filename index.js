import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose
.connect("mongodb://localhost:27017/myfirstdatabase")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Could not connect to MongoDB", err));

const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
});

const Item = mongoose.model("Item", itemSchema);

app.get('/items', async(req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({
            error: "Failed to get items",
        });
    }
   
});

app.post('/items', async (req, res) => {
    try {
        const newItem = Item(req.body);
    await newItem.save();
    res.json(newItem);
    } catch (error) {
        res.status(500).json({
            error: "Failed to post items",
        });
    }
    
});

app.put('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedItem = await Item.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        if(!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({
            error: "Failed to update items",
        });
    }
   
});

app.delete('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if(!deletedItem) {
        return res.status(404).json({error: "Item not found"})
    }
    res.json({message:"Item deleted successfully", Item: deletedItem})
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete items",
        });
    }
    
});

app.listen(3000, () => 
    console.log("server is running at http://localhost:3000")
 );
