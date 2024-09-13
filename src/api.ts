import axios from "axios";

import { GameType, StryktipsetRoot } from "./types/Stryktipset";

export const getEvents = async (
  gameType: GameType
): Promise<StryktipsetRoot> => {
  try {
    const response = await axios.get(
      `https://api.www.svenskaspel.se/external/1/draw/${gameType}/draws?accesskey=${process.env.API_TOKEN}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
