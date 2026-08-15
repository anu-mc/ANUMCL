export interface AhnumcServerManifest {
  schemaVersion: number;
  servers: AhnumcServer[];
}

export interface AhnumcServer {
  schemaVersion?: number;
  id: string;
  name: string;
  version?: string;
  description?: string;
  summary?: string;
  author?: string;
  enabled?: boolean;
  tags?: string[];
  server?: {
    address?: string;
    name?: string;
    homepage?: string;
  };
  clientPack: {
    format?: string;
    fileName: string;
    downloadUrl: string;
    sha1?: string;
    size?: number;
    modCount?: number;
    minecraftVersion?: string;
    loader?: {
      type?: string;
      version?: string;
    };
  };
  iconUrl?: string;
}
