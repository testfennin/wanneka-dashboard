import requests from "./httpService";

const SettingServices = {
  // global setting all function
  addGlobalSetting: async (body) => {
    return requests.post("/setting/global/add", body);
  },

  getGlobalSetting: async () => {
    return {}
  },

  updateGlobalSetting: async (body) => {
    return requests.put(`/setting/global/update`, body);
  },
};

export default SettingServices;
