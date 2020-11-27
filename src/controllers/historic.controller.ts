import { readHistoricUserData } from "../data/historic2.data";

const readHistoric = (world_name, id, key_, values, callback) => {};

const readHistoric2 = (world_name, id, callback ) => {

    readHistoricUserData(world_name, id, rows  => {

        console.log('historic2', rows);
        callback(rows);

    });

}

export { readHistoric2 };