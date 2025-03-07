const UsersRepository = require("./repository");

class RestaurantRepository extends BaseRepository
{
    async create (attrs)
    {
        const records = await this.getAll();
        const record = {
            ...attrs,
            id: this.randomId(),
        };
        records.push(record);
        await this.writeAll(records);
        return record;
    }
}



module.exports = new RestaurantRepository("./restaurants.json");