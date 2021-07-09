export interface Item {
    id: string;
    taskName: string;
    userName: string;
    startDate: string;
    endDate: string;
    exerciseBase: string;
    exercise: string;
    discoverPeople: string;
    accessoryList: {
        accessoryFilename: string;
        accessoryUrl: string;
    }[];
    accessoryFilename: string;
    accessoryUrl: string;
    expertGroupVoList: {
      groupName: string;
      groupMembers: string;
  }[];
  exerciseTaskTypeInfoVoList: {
      typeId: string;
      equipmentNames: string;
      troopNameAndCodes: string;
  }[];
}

export interface ParamsOption {
  key: string
  value: string
}



