import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
  ResumePDFBulletList,
  ResumePDFLink,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumePortfolioItem } from "lib/redux/types";

export const ResumePDFPortfolio = ({
  heading,
  portfolio,
  themeColor,
  isPDF,
}: {
  heading: string;
  portfolio?: ResumePortfolioItem[];
  themeColor: string;
  isPDF: boolean;
}) => {
  const safePortfolio = Array.isArray(portfolio) ? portfolio : [];
  if (!safePortfolio.length) {
    return null;
  }

  return (
    <ResumePDFSection heading={heading} themeColor={themeColor}>
      {safePortfolio.map((item, idx) => (
        <View
          key={`${item.title}-${idx}`}
          style={{ ...styles.flexCol, marginBottom: spacing["2"] }}
        >
          <View style={{ ...styles.flexRowBetween, flexWrap: "wrap" }}>
            <ResumePDFText bold>{item.title}</ResumePDFText>
            {item.url && (
              <ResumePDFLink
                src={
                  item.url.startsWith("http") ? item.url : `https://${item.url}`
                }
                isPDF={isPDF}
              >
                <ResumePDFText style={{ color: themeColor }}>
                  {item.url}
                </ResumePDFText>
              </ResumePDFLink>
            )}
          </View>
          <View style={{ marginTop: spacing["0.5"] }}>
            <ResumePDFText>{item.mediaType.toUpperCase()}</ResumePDFText>
            <ResumePDFBulletList items={item.descriptions} />
          </View>
        </View>
      ))}
    </ResumePDFSection>
  );
};


