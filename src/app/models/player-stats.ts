import { BaseClass } from "./base-class";

// Player and related object reference
export class Player extends BaseClass {
  public id: number;
  public name: string;
  public description: string; // (html allowed)
  public stats: Stat[];
  public inventory: Inventory[];
}

export class Stat {
  public id: number;
  public name: string;
  public maxValue: number;
  public currentValue: number;
}

export class Inventory {
  public id: number;
  public name: string;
  public description: string; // (html allowed)
  public quantity: number;
}
