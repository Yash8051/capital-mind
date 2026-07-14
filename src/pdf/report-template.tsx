// ============================================================
// CapitalMind AI — PDF Report Template
// ============================================================

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { AnalysisState } from "@/types";

const colors = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#f43f5e",
  text: "#1e293b",
  textLight: "#64748b",
  bg: "#ffffff",
  bgLight: "#f8fafc",
  border: "#e2e8f0",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.bg,
  },
  coverPage: {
    padding: 60,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 40,
  },
  coverCompany: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: colors.text,
    marginBottom: 8,
  },
  coverTicker: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 30,
  },
  coverDate: {
    fontSize: 10,
    color: colors.textLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginBottom: 12,
    marginTop: 20,
    paddingBottom: 6,
    borderBottom: `2px solid ${colors.primary}`,
  },
  subsectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.text,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.text,
    marginBottom: 3,
    paddingLeft: 12,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  metricBox: {
    width: "25%",
    padding: 6,
  },
  metricLabel: {
    fontSize: 8,
    color: colors.textLight,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.text,
  },
  recommendationBox: {
    backgroundColor: colors.bgLight,
    padding: 20,
    borderRadius: 8,
    marginVertical: 12,
    textAlign: "center",
    borderLeft: `4px solid ${colors.primary}`,
  },
  recommendationText: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  scoreItem: {
    textAlign: "center",
  },
  scoreValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.text,
  },
  scoreLabel: {
    fontSize: 8,
    color: colors.textLight,
    marginTop: 2,
  },
  swotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  swotBox: {
    width: "50%",
    padding: 8,
  },
  swotTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 7,
    color: colors.textLight,
    textAlign: "center",
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 8,
  },
  disclaimer: {
    fontSize: 7,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: "italic",
  },
});

interface ReportProps {
  data: AnalysisState;
}

export function InvestmentReport({ data }: ReportProps) {
  const { companyResearch, financialAnalysis, newsSentiment, competitorAnalysis, riskAssessment, investmentDecision } = data;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>CapitalMind AI</Text>
        <Text style={styles.coverSubtitle}>
          Investment Research Report
        </Text>
        <Text style={styles.coverCompany}>
          {companyResearch?.overview.name || data.companyName}
        </Text>
        <Text style={styles.coverTicker}>
          {data.ticker} · {companyResearch?.overview.exchange || ""}
        </Text>
        {investmentDecision && (
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              {investmentDecision.recommendation}
            </Text>
            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreValue}>{investmentDecision.investmentScore}/100</Text>
                <Text style={styles.scoreLabel}>Investment Score</Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreValue}>{investmentDecision.confidenceScore}%</Text>
                <Text style={styles.scoreLabel}>Confidence</Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreValue}>{investmentDecision.riskLevel}</Text>
                <Text style={styles.scoreLabel}>Risk Level</Text>
              </View>
            </View>
          </View>
        )}
        <Text style={styles.coverDate}>
          Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </Text>
        <Text style={styles.disclaimer}>
          This report is AI-generated and for educational purposes only. Not financial advice.
        </Text>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.paragraph}>
          {investmentDecision?.executiveSummary || "Analysis in progress..."}
        </Text>

        {/* Company Overview */}
        {companyResearch && (
          <>
            <Text style={styles.sectionTitle}>Company Overview</Text>
            <Text style={styles.paragraph}>{companyResearch.overview.description}</Text>
            <View style={styles.metricsRow}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Sector</Text>
                <Text style={styles.metricValue}>{companyResearch.overview.sector}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Industry</Text>
                <Text style={styles.metricValue}>{companyResearch.overview.industry}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Market Cap</Text>
                <Text style={styles.metricValue}>{companyResearch.overview.marketCapFormatted}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Score</Text>
                <Text style={styles.metricValue}>{companyResearch.score}/100</Text>
              </View>
            </View>
            <Text style={styles.subsectionTitle}>Business Model</Text>
            <Text style={styles.paragraph}>{companyResearch.businessModel}</Text>
            <Text style={styles.subsectionTitle}>Competitive Advantage</Text>
            <Text style={styles.paragraph}>{companyResearch.competitiveAdvantage}</Text>
          </>
        )}
        <Text style={styles.footer}>
          CapitalMind AI — Confidential Investment Research Report
        </Text>
      </Page>

      {/* Financial Analysis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Financial Analysis</Text>
        {financialAnalysis && (
          <>
            <Text style={styles.paragraph}>{financialAnalysis.summary}</Text>
            <View style={styles.metricsRow}>
              {Object.entries(financialAnalysis.metrics).slice(0, 8).map(([key, metric]) => (
                <View key={key} style={styles.metricBox}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricValue}>{String(metric.value)}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.subsectionTitle}>Strengths</Text>
            {financialAnalysis.strengths.map((s, i) => (
              <Text key={i} style={styles.listItem}>✓ {s}</Text>
            ))}
            <Text style={styles.subsectionTitle}>Concerns</Text>
            {financialAnalysis.concerns.map((c, i) => (
              <Text key={i} style={styles.listItem}>✗ {c}</Text>
            ))}
          </>
        )}

        {/* News Sentiment */}
        <Text style={styles.sectionTitle}>News Analysis</Text>
        {newsSentiment && (
          <>
            <Text style={styles.paragraph}>{newsSentiment.summary}</Text>
            <Text style={styles.paragraph}>
              Overall Sentiment: {newsSentiment.overallSentiment.toUpperCase()} ({newsSentiment.sentimentScore}/100)
            </Text>
            <Text style={styles.subsectionTitle}>Major Impacts</Text>
            {newsSentiment.majorImpacts.map((impact, i) => (
              <Text key={i} style={styles.listItem}>• {impact}</Text>
            ))}
          </>
        )}
        <Text style={styles.footer}>
          CapitalMind AI — Confidential Investment Research Report
        </Text>
      </Page>

      {/* Risk + Competitors + SWOT + Recommendation */}
      <Page size="A4" style={styles.page}>
        {/* Risk */}
        <Text style={styles.sectionTitle}>Risk Assessment</Text>
        {riskAssessment && (
          <>
            <Text style={styles.paragraph}>{riskAssessment.summary}</Text>
            <Text style={styles.paragraph}>
              Overall Risk: {riskAssessment.overallRiskLevel.toUpperCase()} ({riskAssessment.overallRiskScore}/100)
            </Text>
            {Object.entries(riskAssessment.factors).map(([, factor]) => (
              <Text key={factor.category} style={styles.listItem}>
                • {factor.category}: {factor.level.toUpperCase()} ({factor.score}/100)
              </Text>
            ))}
          </>
        )}

        {/* Competitor Analysis */}
        <Text style={styles.sectionTitle}>Competitor Analysis</Text>
        {competitorAnalysis && (
          <>
            <Text style={styles.paragraph}>{competitorAnalysis.summary}</Text>
            {competitorAnalysis.competitors.map((comp) => (
              <Text key={comp.ticker} style={styles.listItem}>
                • {comp.name} ({comp.ticker}) — Market Cap: {comp.marketCapFormatted}
              </Text>
            ))}
          </>
        )}

        {/* SWOT */}
        {investmentDecision && (
          <>
            <Text style={styles.sectionTitle}>SWOT Analysis</Text>
            <View style={styles.swotGrid}>
              <View style={styles.swotBox}>
                <Text style={{ ...styles.swotTitle, color: colors.success }}>Strengths</Text>
                {investmentDecision.swotAnalysis.strengths.map((s, i) => (
                  <Text key={i} style={styles.listItem}>• {s}</Text>
                ))}
              </View>
              <View style={styles.swotBox}>
                <Text style={{ ...styles.swotTitle, color: colors.danger }}>Weaknesses</Text>
                {investmentDecision.swotAnalysis.weaknesses.map((w, i) => (
                  <Text key={i} style={styles.listItem}>• {w}</Text>
                ))}
              </View>
              <View style={styles.swotBox}>
                <Text style={{ ...styles.swotTitle, color: colors.primary }}>Opportunities</Text>
                {investmentDecision.swotAnalysis.opportunities.map((o, i) => (
                  <Text key={i} style={styles.listItem}>• {o}</Text>
                ))}
              </View>
              <View style={styles.swotBox}>
                <Text style={{ ...styles.swotTitle, color: colors.warning }}>Threats</Text>
                {investmentDecision.swotAnalysis.threats.map((t, i) => (
                  <Text key={i} style={styles.listItem}>• {t}</Text>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Final Recommendation</Text>
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>
                {investmentDecision.recommendation}
              </Text>
              <Text style={styles.paragraph}>
                Investment Score: {investmentDecision.investmentScore}/100 · Confidence: {investmentDecision.confidenceScore}% · Risk: {investmentDecision.riskLevel}
              </Text>
            </View>
            <Text style={styles.paragraph}>{investmentDecision.detailedReasoning}</Text>
          </>
        )}

        <Text style={styles.footer}>
          CapitalMind AI — Confidential Investment Research Report · Not Financial Advice
        </Text>
      </Page>
    </Document>
  );
}
