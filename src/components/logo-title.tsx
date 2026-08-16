import { BoxProps, HStack, Heading, Highlight, Image } from "@chakra-ui/react";
import { useLauncherConfig } from "@/contexts/config";
import styles from "@/styles/logo-title.module.css";

interface LogoTitleProps extends BoxProps {}

export const TitleShort: React.FC<LogoTitleProps> = (props) => {
  const { config } = useLauncherConfig();
  const primaryColor = config.appearance.theme.primaryColor;

  return (
    <Heading size="md" className={styles.title} {...props}>
      <Highlight
        query="L"
        styles={{ color: `${primaryColor}.600`, userSelect: "none" }}
      >
        AHNUMCL
      </Highlight>
    </Heading>
  );
};

export const TitleFull: React.FC<LogoTitleProps> = (props) => {
  const { config } = useLauncherConfig();
  const primaryColor = config.appearance.theme.primaryColor;

  return (
    <Heading size="md" className={styles.title} {...props}>
      <Highlight
        query="L"
        styles={{ color: `${primaryColor}.600`, userSelect: "none" }}
      >
        AHNUMCL
      </Highlight>
    </Heading>
  );
};

export const TitleFullWithLogo: React.FC<LogoTitleProps> = (props) => {
  return (
    <HStack>
      <Image src="/images/icons/Logo_128x128.png" alt="Logo" boxSize="36px" />
      <TitleFull {...props} />
    </HStack>
  );
};
