import {table} from "table";
import {Command, Facing, Placement} from "../types";

export interface IRobot {
  name: string | null;
  location: Placement;

  move(): void;
  switchDirection(facing: Facing): void;
  displayInfo(): void;
}

class Robot implements IRobot {
  name: string | null = null;
  location: Placement = {
    x: -1,
    y: 1,
    direction: 'EAST'
  }

  constructor(name: string) {
    this.name = name.charAt(0).toUpperCase() + name.slice(1);
  }

  displayInfo() {
    console.log(table([ [`${this.name} the robot is in action`] ]));
  }

  move(): void {
    switch (this.location.direction) {
      case 'NORTH':
        this.location.y++;
        break;
    
      case 'SOUTH':
        this.location.y--;
        break;

      case 'EAST':
        this.location.x++;
        break;

      case 'WEST':
        this.location.x--;
    }
  }

  switchDirection(facing: Facing): void {
    switch (facing) {
      case Command.LEFT:
        this.location.direction = 'WEST';
        break;

      case Command.RIGHT:
        this.location.direction = 'EAST';
        break;

      case Command.UP:
        this.location.direction = 'NORTH';
        break;

      case Command.DOWN:
        this.location.direction = 'SOUTH';
        break;
    }
  }
}

export default Robot;