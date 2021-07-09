import { Module } from 'vuex'

export const initForm = {
  id: '',
  exerciseName: '',
  code: '',
  exerciseType: '',
  exerciseTypeName: '',
  time: [],
  exerciseSiteId: '',
  exerciseExplain: '',
  listAirspaceInput: [],
  listAircraft: []
}

const store: Module<any, any> = {
  state: () => ({
    form: { ...initForm },
    modifyBaseFlag: 0,
    modifyAircraftFlag: 0,
    customLayers: [],
    disableLayers: [],
    checkAll: false,
    isIndeterminate: false,
    blueAircraftList: [],
    redAircraftList: []
  })
}

export default store
