import Todo from "../model/todo.model.js";

export const createTodo=async(req, res)=>{
    const todo=new Todo({
        userId: req.userId,
        text:req.body.text,
        completed:req.body.completed
})

try{
    const newTodo=await todo.save();
    res.status(201).json(newTodo);  
} catch(error){
    console.log(error);
    res.status(400).json({message:"error occured in todo creation"});
}

};
// export {createTodo};

export const getTodos=async(req, res)=>{
    try{
        const todos=await Todo.find({ userId: req.userId });
        res.status(200).json(todos);
    } catch(error){
        console.log(error);
        res.status(500).json({message:"error occured in fetching todos"});
    }
}; 
    

export const updateTodo=async(req, res)=>{
    try{
        const {id} = req.params;
        const todo = await Todo.findById(id);
        
        // Check if the todo belongs to the authenticated user
        if (todo.userId.toString() !== req.userId) {
            return res.status(403).json({message:"Unauthorized to update this todo"});
        }
        
        const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(updatedTodo);

    } catch(error){
        console.log(error);
        res.status(500).json({message:"error occured in updating todo"});
    }
}

export const deleteTodo=async(req, res)=>{
    try{
        const {id} = req.params;
        const todo = await Todo.findById(id);
        
        // Check if the todo belongs to the authenticated user
        if (todo.userId.toString() !== req.userId) {
            return res.status(403).json({message:"Unauthorized to delete this todo"});
        }
        
        await Todo.findByIdAndDelete(id);
        res.status(200).json({message:"todo deleted successfully"});
        
    } catch(error){
        console.log(error);
        res.status(500).json({message:"error occured in deleting todo"});
    }
}

