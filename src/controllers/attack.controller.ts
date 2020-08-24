import { getPattern } from "./../patterns/main.patterns";
import { sendToNear } from "./socket.controller";
import { getCalculation } from "./calculation.controller";

export const attackPower = (user, target, D100, callBack) => {
  getCalculation((calculs) => {
    let calculation = calculs["attack"];

    let skillAttack = 10;
    let getMaterial = 10;
    let skillDefense = 10;
    let getWater = 10;
    if ("attack" in user) {
      skillAttack = user["attack"];
    }
    if ("wood" in user) {
      getMaterial = user["wood"];
    }
    if ("defense" in target) {
      skillDefense = target["defense"];
    }
    if ("dowser" in target) {
      getWater = target["dowser"];
    }

    let power = Math.floor(
      (D100 *
        (Math.log10(skillAttack) +
          Math.log10(
            (getMaterial + calculation.getMaterial_min) *
              calculation.getMaterial
          ))) /
        ((Math.log10(skillDefense) +
          Math.log10(
            (getWater + calculation.getWater_min) * calculation.getWater
          )) *
          calculation.factor)
    );

    callBack(power);
  });
};
export const attackProba = (
  user,
  userPattern,
  target,
  targetPattern,
  callBack
) => {
  if (targetPattern && targetPattern["values"]["counter"]) {
    getCalculation((calculs) => {
      let calculation = calculs["attack"];

      let proba_skillAttack = 10;
      let proba_getFood = 10;
      let proba_defense = 10;
      let proba_getFaith = 10;

      if ("attack" in user) {
        proba_skillAttack = user.attack;
      }
      if ("getFood" in user) {
        proba_getFood = user.getFood;
      }
      if ("defense" in target) {
        proba_defense = target.defense;
      }
      if ("getFaith" in target) {
        proba_getFaith = target.getFaith;
      }

      let proba = Math.max(
        0.05,
        Math.min(
          9.95,
          calculation.proba_min +
            (Math.log10(proba_skillAttack) +
              Math.log10(
                (proba_getFood + calculation.proba_getFood_min) *
                  calculation.proba_getFood
              ) *
                calculation.proba_factor1) -
            (Math.log10(proba_defense) +
              Math.log10(
                (proba_getFaith + calculation.proba_getFaith_min) *
                  calculation.proba_getFaith
              ) *
                calculation.proba_factor2)
        )
      );

      if (Math.random() <= proba) {
        callBack("attack");
      } else {
        callBack("counter");
      }
    });
  } else {
    callBack(1);
  }
};
export const makeAttack = (
  world_name,
  user,
  patternUser,
  target,
  patternTarget,
  power,
  callback
) => {
  MobilesData.addValue(
    world_name,
    target["id"],
    "life",
    -power,
    (resTarget) => {
      if (resTarget) {
        if (target["life"] - power <= 0) {
          console.log("kill");
          patternTarget.pops(world_name, target, (resPops) => {
            callback("kill");
          });
        } else {
          target["life"] = Math.max(0, target["life"] - power);
          console.log("hurt");
          callback("hurt");
        }
      } else {
        callback(null);
      }
    }
  );
};
export const attack = (
  worldName: string,
  user: Object,
  target: Object,
  callBack: Function
) => {
  let patternUser = getPattern(user["key_"]);
  let patternTarget = getPattern(target["key_"]);

  attackProba(user, patternUser, target, patternTarget, (attackType) => {
    let D100 = 1 + Math.floor(Math.random() * 99);

    if (attackType == "attack") {
      attackPower(user, target, D100, (dammage) => {
        console.log("attack " + dammage);

        makeAttack(
          worldName,
          user,
          patternUser,
          target,
          patternTarget,
          dammage,
          (attackRes) => {
            sendToNear(
              worldName,
              user["position"],
              5,
              "attack",
              {
                type: "attack",
                result: attackRes,
                user: user,
                target: target,
                D100: D100,
                power: dammage,
              },
              (resSend) => {}
            );
            callBack("attack", attackRes);
          }
        );
      });
    } else {
      attackPower(target, user, D100, (dammage) => {
        makeAttack(
          worldName,
          target,
          patternTarget,
          user,
          patternUser,
          dammage * 0.5,
          (attackRes) => {
            sendToNear(
              worldName,
              user["position"],
              5,
              "attack",
              {
                type: "counter",
                result: attackRes,
                user: user,
                target: target,
                D100: D100,
                power: dammage,
              },
              (resSend) => {}
            );
            callBack("counter", "hurt");
          }
        );
      });
    }
  });
};
