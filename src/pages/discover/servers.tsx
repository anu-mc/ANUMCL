import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Image,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { join } from "@tauri-apps/api/path";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuDownload, LuRefreshCw, LuServer } from "react-icons/lu";
import { Section } from "@/components/common/section";
import { useLauncherConfig } from "@/contexts/config";
import { useToast } from "@/contexts/toast";
import { AhnumcServer, AhnumcServerManifest } from "@/models/ahnumc-server";
import { TaskTypeEnums } from "@/models/task";
import { AhnumcServerService } from "@/services/ahnumc-server";
import { TaskService } from "@/services/task";
import { sanitizeFileName } from "@/utils/string";

const AhnumcServersPage = () => {
  const { t } = useTranslation();
  const { config } = useLauncherConfig();
  const toast = useToast();
  const primaryColor = config.appearance.theme.primaryColor;
  const [servers, setServers] = useState<AhnumcServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchServers = useCallback(() => {
    setIsLoading(true);
    setError(false);
    AhnumcServerService.fetchManifest()
      .then((response) => {
        if (response.status !== "success") {
          setError(true);
          return;
        }
        const manifest = response.data as AhnumcServerManifest;
        setServers(
          Array.isArray(manifest.servers)
            ? manifest.servers.filter(
                (server) => server.enabled !== false && server.clientPack
              )
            : []
        );
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  const handleInstall = async (server: AhnumcServer) => {
    const cacheDir = config.download.cache.directory.trim();
    if (!cacheDir) {
      toast({
        title: t("AhnumcServersPage.error.cacheDirectory"),
        status: "error",
      });
      return;
    }

    const fileName = sanitizeFileName(server.clientPack.fileName);
    const destination = await join(cacheDir, fileName);
    const response = await TaskService.scheduleProgressiveTaskGroup(
      `ahnumc-server?${server.id}`,
      [
        {
          taskType: TaskTypeEnums.Download,
          src: server.clientPack.downloadUrl,
          dest: destination,
          filename: fileName,
          sha1: server.clientPack.sha1,
        },
      ]
    );
    if (response.status !== "success") {
      toast({
        title: response.message,
        description: response.details,
        status: "error",
      });
      return;
    }

    toast({
      title: t("AhnumcServersPage.downloadStarted", { name: server.name }),
      status: "success",
    });
  };

  return (
    <Section
      title={t("AhnumcServersPage.title")}
      description={t("AhnumcServersPage.description")}
      headExtra={
        <Tooltip label={t("General.refresh")}>
          <Button
            size="xs"
            variant="ghost"
            aria-label={t("General.refresh")}
            onClick={fetchServers}
            isLoading={isLoading}
          >
            <LuRefreshCw />
          </Button>
        </Tooltip>
      }
      h="100%"
      overflowY="auto"
    >
      {isLoading ? (
        <Grid templateColumns="repeat(auto-fill, minmax(260px, 1fr))" gap={4}>
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} h="180px" borderRadius="md" />
          ))}
        </Grid>
      ) : error ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {t("AhnumcServersPage.error.fetchFailed")}
        </Alert>
      ) : servers.length === 0 ? (
        <Center py={12} className="secondary-text">
          {t("AhnumcServersPage.empty")}
        </Center>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(260px, 1fr))" gap={4}>
          {servers.map((server) => (
            <Box key={server.id} borderWidth="1px" borderRadius="md" p={4}>
              <VStack align="stretch" spacing={3}>
                <HStack align="start" spacing={3}>
                  {server.iconUrl ? (
                    <Image
                      boxSize="48px"
                      borderRadius="md"
                      src={server.iconUrl}
                      alt={server.name}
                      fallbackSrc="/images/icons/JEIcon_Release.png"
                    />
                  ) : (
                    <LuServer size={48} />
                  )}
                  <Box minW={0} flex={1}>
                    <Text fontWeight="bold" noOfLines={2}>
                      {server.name}
                    </Text>
                    <Text
                      fontSize="xs"
                      className="secondary-text"
                      noOfLines={1}
                    >
                      {server.server?.address || "-"}
                    </Text>
                  </Box>
                </HStack>
                <Text fontSize="sm" noOfLines={3} minH="3.75em">
                  {server.description || server.summary || "-"}
                </Text>
                <HStack spacing={1} flexWrap="wrap">
                  {server.clientPack.minecraftVersion && (
                    <Badge>{server.clientPack.minecraftVersion}</Badge>
                  )}
                  {server.clientPack.loader?.type && (
                    <Badge colorScheme={primaryColor}>
                      {server.clientPack.loader.type}
                      {server.clientPack.loader.version
                        ? ` ${server.clientPack.loader.version}`
                        : ""}
                    </Badge>
                  )}
                  {server.clientPack.modCount != null && (
                    <Badge>
                      {t("AhnumcServersPage.modCount", {
                        count: server.clientPack.modCount,
                      })}
                    </Badge>
                  )}
                </HStack>
                <Button
                  size="sm"
                  leftIcon={<LuDownload />}
                  colorScheme={primaryColor}
                  onClick={() => handleInstall(server)}
                >
                  {t("AhnumcServersPage.install")}
                </Button>
              </VStack>
            </Box>
          ))}
        </Grid>
      )}
    </Section>
  );
};

export default AhnumcServersPage;
