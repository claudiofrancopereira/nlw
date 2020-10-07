import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async create (request: Request, response: Response) {
        const { 
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        await knex.raw('PRAGMA foreign_keys = ON');
        const trx = await knex.transaction();
            
        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        };

        const insertedIDs = await trx('points').insert(point);

        const point_id = insertedIDs[0];

        const pointItems = items.map((item_id: Number) => {
            return {
                item_id,
                point_id: point_id,
            }
        });

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({ 
            id: point_id,
            ...point,
        });
            
    }
}

export default PointsController;