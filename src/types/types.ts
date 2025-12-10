export interface DATA {
  _id: string;
  id: number;
  name: string;
  current_status: string;
  health: Health;
  location: string;
  recorder: string;
  tasks: string;
  status: string;
  hasWarning: boolean;
}

export interface Health {
  cloud: string;
  device: string;
  _id: string;
  id: string;
}
