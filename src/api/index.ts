import { getBaseUrl } from "@/lib/utils";
import axios from "axios";

export const api = axios.create({
  baseURL: `${getBaseUrl()}/api`,
});
