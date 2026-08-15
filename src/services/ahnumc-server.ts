import { invoke } from "@tauri-apps/api/core";
import { AhnumcServerManifest } from "@/models/ahnumc-server";
import { InvokeResponse } from "@/models/response";
import { responseHandler } from "@/utils/response";

export const AHNUMC_SERVER_MANIFEST_URL =
  "https://github.com/ahnumc/server/blob/main/servers.json";

export class AhnumcServerService {
  @responseHandler("ahnumc-server")
  static async fetchManifest(
    url: string = AHNUMC_SERVER_MANIFEST_URL
  ): Promise<InvokeResponse<AhnumcServerManifest>> {
    const rawUrl = url
      .replace("https://github.com/", "https://raw.githubusercontent.com/")
      .replace("/blob/", "/");
    return await invoke("fetch_remote_json", { url: rawUrl });
  }
}
