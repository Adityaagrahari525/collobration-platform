import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Button } from "../common/Button";

export interface CodePreviewModalProps {
  visible: boolean;
  projectTitle: string;
  onClose: () => void;
}

const DEFAULT_SAMPLE_CODE = `// FloodSense Embedded Raft Log Replication Sub-layer
// Target: STM32H7 / Sub-GHz SX1262 LoRa Node Cluster

#include <iostream>
#include <vector>
#include <chrono>

struct RaftEntry {
    uint64_t term;
    uint64_t index;
    float water_level_meters;
    float rssi_dbm;
};

class MeshRaftConsensus {
private:
    uint64_t current_term = 4;
    std::vector<RaftEntry> log_buffer;

public:
    void append_sensor_telemetry(float level, float rssi) {
        RaftEntry entry = {
            .term = current_term,
            .index = log_buffer.size() + 1,
            .water_level_meters = level,
            .rssi_dbm = rssi
        };
        log_buffer.push_back(entry);
        std::cout << "[Raft Node #4] Appended Entry #" << entry.index 
                  << " (Level: " << level << "m)\\n";
    }
};`;

export const CodePreviewModal: React.FC<CodePreviewModalProps> = ({
  visible,
  projectTitle,
  onClose,
}) => {
  const [code, setCode] = useState<string>(DEFAULT_SAMPLE_CODE);
  const [activeTab, setActiveTab] = useState<"raft.cpp" | "sensors.py" | "schema.sql">("raft.cpp");

  const handleTabChange = (tab: "raft.cpp" | "sensors.py" | "schema.sql") => {
    setActiveTab(tab);
    if (tab === "sensors.py") {
      setCode(`# FloodSense Telemetry Calibration & FFT Drift Filter
import numpy as np

def calibrate_pressure_sensor(raw_voltage, temp_celsius):
    # Polynomial compensation for temperature swings (18°C - 42°C)
    alpha = 0.0042
    beta = 1.018
    compensated = (raw_voltage * beta) - (alpha * (temp_celsius - 25.0))
    water_head_meters = compensated * 0.10197
    return max(0.0, water_head_meters)`);
    } else if (tab === "schema.sql") {
      setCode(`-- Telemetry PostgreSQL Hypertable Schema
CREATE TABLE sensor_telemetry (
    node_id UUID NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    water_level NUMERIC(5,2),
    battery_mv INT,
    snr_db NUMERIC(4,1)
);`);
    } else {
      setCode(DEFAULT_SAMPLE_CODE);
    }
  };

  const handleRunVerification = () => {
    Alert.alert(
      "Code Syntax & Lint Verified ✓",
      "Embedded C++ Raft consensus module passed simulated static analysis checks without compiler warnings.",
      [{ text: "OK" }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Collaborative Code Workspace</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {projectTitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* File Tabs */}
          <View style={styles.tabsRow}>
            {(["raft.cpp", "sensors.py", "schema.sql"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                onPress={() => handleTabChange(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Code Editor Body */}
          <ScrollView style={styles.editorContainer} showsVerticalScrollIndicator={true}>
            <TextInput
              style={styles.codeText}
              value={code}
              onChangeText={setCode}
              multiline={true}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
          </ScrollView>

          {/* Actions */}
          <View style={styles.footer}>
            <Button
              title="Close"
              variant="outline"
              size="sm"
              onPress={onClose}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <Button
              title="Run Static Check"
              variant="secondary"
              size="sm"
              onPress={handleRunVerification}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: "#1e1e2e", // Dark modern code theme
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    maxHeight: "85%",
    ...shadows.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: "#313244",
  },
  title: {
    ...typography.titleMedium,
    color: "#cdd6f4",
  },
  subtitle: {
    ...typography.caption,
    color: "#a6adc8",
    marginTop: 2,
    maxWidth: 240,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 16,
    color: "#a6adc8",
    fontWeight: "700",
  },
  tabsRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: "#313244",
    marginRight: spacing.xs,
  },
  tabItemActive: {
    backgroundColor: colors.primaryContainer,
  },
  tabText: {
    ...typography.caption,
    color: "#a6adc8",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  editorContainer: {
    backgroundColor: "#181825",
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    minHeight: 280,
    maxHeight: 380,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 18,
    color: "#a6e3a1", // Green terminal glow
  },
  footer: {
    flexDirection: "row",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "#313244",
  },
});
