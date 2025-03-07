const restaurants = require("../../repositories/restaurants");

const get = async(req, res)=> {
    const records = await restaurants.getAll();

    res.send(records);
};
const create = async(req,res)=>{
    const record = await restaurants.create(req.body);

    res.status(201).send(record);
};
const edit = async(req,res) => {
    try{
        await restaurants.update(req.params.restId, req.body);
    }catch(error){
        return res.
        status(404).
        send({message:"Restaurant not found! " + error.message});
    }
    res.send({});
};
const remove = async(req, res)=>
    {
        const record = await restaurants.getOne(req.params.restId);
        if(!record)
        {
            //return res.status(404).send({message:"Restaurant not found!"});
            throw new HttpError("Restaurant not found!", 404);
        }
        await restaurants.delete(req.params.restId);
        res.send({});
    };

module.exports = {
    get,
    create,
    edit,
    remove,
};