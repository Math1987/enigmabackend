import { localStorage } from "./localstorage";

import { buildWorldData, readWorldsData } from "../data/world.data";
import { localStorage } from "./localstorage";

/**
 * Manage all worlds functions
 * 1 world = 1 database
 */
export class Worlds {
  /**
   * check all worlds from databases.
   * If no world found, create a new world,
   * else, use "buildWorld" function to run
   * migration system database => if a table needed
   * doesnt exist, it will create it.
   * @param callBack
   */
  static init(callBack) {
    readWorldsData(function (worlds: Array<string>) {
      if (!(worlds && worlds.length > 0)) {
        buildWorldData({ name: "world1", width: 100, height: 100 }, function (
          world
        ) {
          callBack("done");
        });
      } else {
        for (let world of worlds) {
          localStorage.setItem(world["name"], JSON.stringify(world));
        }
        callBack("done");
      }
    });

    //Chara.init();
  }
}
