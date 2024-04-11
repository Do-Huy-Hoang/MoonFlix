import publicClient from "../client/public.client";

const perfomerEndpoints = {
  list: "perfomer/",
  create: "perfomer/create",
  delete: "perfomer/delete",
  update: "perfomer/update"
};

const performerApi = {
  getList: async () => {
    try {
      const response = await publicClient.get(perfomerEndpoints.list);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getDropDownPer: async () => {
    try {
      // Reuse the getList function to fetch performers data
      const response = await publicClient.get(perfomerEndpoints.list); // Assuming you want to reuse the same endpoint as genres
      return response.map(performer => ({
        value: performer.id,
        label: performer.perName
      }));
    } catch (error) {
      console.error("Error fetching dropdown performers:", error);
      throw error;
    }
},

  createPerformer: async (formData) => {
    try {
      const response = await publicClient.post(
        perfomerEndpoints.create,
        formData
      );
      return response.data;
    } catch (err) {
      console.error("Error creating performer:", err);
      throw err;
    }
  },
  deletePerformer: async (performerId) => {
    try {
      const response = await publicClient.delete(
        `${perfomerEndpoints.delete}/${performerId}`
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  updatePerformer: async (performerId, updatedData) => {
    try {
      const response = await publicClient.put(
        `${perfomerEndpoints.update}/${performerId}`,
        updatedData
      );
      return response.data;
    } catch (err) {
      console.error("Error updating performer:", err);
      throw err;
    }
  }
};

export default performerApi;
