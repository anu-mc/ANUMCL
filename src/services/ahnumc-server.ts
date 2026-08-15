import { invoke } from "@tauri-apps/api/core";
import { AhnumcServerManifest } from "@/models/ahnumc-server";
import { InvokeResponse } from "@/models/response";
import { responseHandler } from "@/utils/response";

export const AHNUMC_SERVER_MANIFEST_URL = "https://api.ahnumc.org/v1/servers";

export class AhnumcServerService {
  @responseHandler("ahnumc-server")
  static async fetchManifest(
    url: string = AHNUMC_SERVER_MANIFEST_URL
  ): Promise<InvokeResponse<AhnumcServerManifest>> {
    return await invoke("fetch_remote_json", { url });
  }
}
