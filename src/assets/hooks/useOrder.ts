import { useReducer, useEffect } from "react";
import type { Order, OrderStage } from "../types/types";

//stages types

type StageType = {
  stage: OrderStage;
  atPercent: number;
};
// stages array
const Stages: StageType[] = [
  { stage: "placed", atPercent: 0 },
  { stage: "confirmed", atPercent: 5 },
  { stage: "preparing", atPercent: 10 },
  { stage: "pickedUp", atPercent: 45 },
  { stage: "onTheWay", atPercent: 70 },
  { stage: "delivered", atPercent: 100 },
];

//to allow the MUI stepper to consume it, we have to map the stage to the index
//placed -> confirmed -> prep. ->> picked -> otw -> delivered
const StageToIndex: Record<OrderStage, number> = {
  placed: 0,
  confirmed: 1,
  preparing: 2,
  pickedUp: 3,
  onTheWay: 4,
  delivered: 5,
};
//get the stage
const getCurrentStage = (order: Order): OrderStage => {
  // get time taken
  const elapsed = Date.now() - order.createdAt;
  // convert the time to a percentage
  const percent = Math.min(100, (elapsed / (order.etaMinutes * 60000)) * 100);

  // find the current stage

  const current = [...Stages].reverse().find((t) => percent >= t.atPercent);

  return current?.stage ?? "placed";
};

//get the remaining minutes
const getRemMins = (order: Order): number => {
  const elapsed = Date.now() - order.createdAt;
  const remainingTime = order.etaMinutes * 60000 - elapsed;

  return Math.max(0, Math.ceil(remainingTime / 60000));
};

export const useOrderTracking = (order: Order) => {
  //use this forcetick value to force a re-render every 10 seconds so we can get current stage and remaining minutes
  const [, forceTick] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    // if the order has been completed, return
    if (getCurrentStage(order) === "delivered") {
      return;
    }
    // re-render every ten seconds
    //forcetick + 10 = 10, 11 + 10 = 21 seconds....so and so
    const id = setInterval(forceTick, 10000);

    return () => clearInterval(id);
  }, [order]);

  //get a stage
  const stage = getCurrentStage(order);
  //get the active step by mapping the stage to the step
  const activeStep = StageToIndex[stage];
  //get remaining minutes
  const remainingMins = getRemMins(order);
  //check if stage is delivered or not
  const isDelivered = stage === "delivered";

  return { stage, activeStep, remainingMins, isDelivered };
};
