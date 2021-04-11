export type Direction = 'NORTH' | 'SOUTH' | 'WEST' | 'EAST';

export type Placement = {
  x: number;
  y: number;
  direction: Direction;
}

export enum Command {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  MOVE = 'MOVE',
  UP = 'UP',
  DOWN = 'DOWN',
  PLACE = 'PLACE',
  INIT = 'INIT',
  HELP = 'HELP',
  REPORT = 'REPORT',
  EXIT = 'EXIT',
}

export type Facing = Command.LEFT | Command.RIGHT | Command.DOWN | Command.UP;
