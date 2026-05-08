import React from "react";
import { View, ScrollView, StyleSheet, Text, Pressable, Image } from "react-native";

import { useProducts } from "../hooks/useProducts";

// Hàm hỗ trợ hiển thị icon dựa theo tên danh mục
const getCategoryIcon = (label) => {
  const l = String(label || "").toLowerCase();
  if (l.includes("địa hình") || l.includes("mountain")) return "🏔️";
  if (l.includes("đua") || l.includes("road")) return "🚴";
  if (l.includes("trẻ em") || l.includes("kid")) return "👶";
  if (l.includes("gấp") || l.includes("thành phố") || l.includes("city")) return "🏙️";
  if (l.includes("điện") || l.includes("e-bike")) return "⚡";
  if (l.includes("phụ kiện") || l.includes("accessory")) return "🛒";
  return "🏷️";
};

export default function DashboardScreen({ orders = [], onNavigate, onLogout }) {
  // === 1. LẤY DỮ LIỆU TỪ CONTEXT ===
  const { categories, products } = useProducts();

  // === 2. TÍNH TOÁN THỐNG KÊ (DOANH THU, SỐ LƯỢNG) ===
  const totalRevenue = orders.reduce((sum, o) => {
    const val = Number((o.total || "").replace(/[^0-9.-]+/g, ""));
    return sum + (Number.isFinite(val) ? val : 0);
  }, 0);
  const totalOrdersCount = orders.length;

  // === 3. RENDER GIAO DIỆN BẢNG ĐIỀU KHIỂN ADMIN ===
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <Text style={styles.topBarIcon}>☰</Text>
        <Text style={styles.topBarTitle}>BIKE WORLD</Text>
        <Pressable onPress={onLogout} hitSlop={8}>
          <Text style={[styles.topBarIcon, { color: "#ef4444" }]}>Đăng xuất</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Performance Overview</Text>
        <Text style={styles.headerSubtitle}>Real-time metrics for your cycling ecosystem.</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard icon="🚲" label="SẢN PHẨM" value={(products || []).length.toString()} change="+12%" changeColor="#4CAF50" />
        <StatCard icon="📋" label="TỔNG ĐƠN HÀNG" value={totalOrdersCount.toString()} change="+1" changeColor="#4CAF50" />
        <StatCard icon="💰" label="DOANH THU" value={`$${totalRevenue.toLocaleString()}`} change="+15%" changeColor="#4CAF50" />
        <StatCard icon="👥" label="NGƯỜI DÙNG" value="12" change="+2" changeColor="#4CAF50" />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sales Velocity</Text>
        <View style={styles.chartPlaceholder}>
          <View style={styles.barChart}>
            <View style={[styles.bar, { height: "40%" }]} />
            <View style={[styles.bar, { height: "60%", backgroundColor: "#00A8E8" }]} />
            <View style={[styles.bar, { height: "35%" }]} />
            <View style={[styles.bar, { height: "50%" }]} />
            <View style={[styles.bar, { height: "45%" }]} />
          </View>
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>High-End Frames</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#B0E0E6" }]} />
            <Text style={styles.legendText}>Accessories</Text>
          </View>
        </View>
      </View>

      <View style={styles.alertContainer}>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>Inventory Alert</Text>
          <Text style={styles.alertMessage}>5 models are currently below critical stock levels.</Text>
        </View>
        <View style={styles.alertImageContainer}>
          <Text style={styles.alertImagePlaceholder}>🚴</Text>
        </View>
      </View>
      <Pressable style={styles.manageStockButton} onPress={() => onNavigate?.("AdminProducts")}>
        <Text style={styles.manageStockButtonText}>Manage Stock</Text>
      </Pressable>

      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>Recent Inventory</Text>
        <View style={styles.inventoryHeader}>
          <Text style={styles.inventoryHeaderText}>Model Name</Text>
          <Text style={styles.inventoryHeaderText}>Stock Status</Text>
        </View>
        <InventoryItem name="AeroForce X-9" status="In Stock" statusColor="#4CAF50" />
        <InventoryItem name="Vantage G3 Gravel" status="Low Stock" statusColor="#FFA500" />
        <InventoryItem name="E-Velo City Pro" status="Optimal" statusColor="#4CAF50" />
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Product Categories</Text>
        <View style={styles.categoriesGrid}>
          {(categories || []).map((c) => {
            const count = (products || []).filter((p) => p.category === c.label || p.categoryKey === c.key).length;
            return (
              <CategoryCard
                key={c.key}
                icon={getCategoryIcon(c.label)}
                image={c.image}
                label={c.label}
                count={count.toString()}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

// === 4. CÁC COMPONENT CON HỖ TRỢ (THẺ THỐNG KÊ) ===
function StatCard({ icon, label, value, change, changeColor }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={[styles.statChange, { color: changeColor }]}>{change}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function InventoryItem({ name, status, statusColor }) {
  return (
    <View style={styles.inventoryItem}>
      <View style={styles.inventoryIcon}>
        <Text>📦</Text>
      </View>
      <Text style={styles.inventoryName}>{name}</Text>
      <Text style={[styles.inventoryStatus, { color: statusColor }]}>{status}</Text>
    </View>
  );
}

function CategoryCard({ icon, label, count, image }) {
  return (
    <View style={styles.categoryCard}>
      {image ? (
        <Image source={{ uri: image }} style={{ width: 40, height: 40, marginBottom: 6, borderRadius: 8 }} />
      ) : (
        <Text style={styles.categoryIcon}>{icon}</Text>
      )}
      <Text style={styles.categoryLabel}>{label}</Text>
      <Text style={styles.categoryCount}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E0E0E0", marginTop: 30 },
  topBarIcon: { fontSize: 16, color: "#666", fontWeight: "bold" },
  topBarTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", letterSpacing: 2 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: "#999" },
  statsContainer: { paddingHorizontal: 16, marginBottom: 16 },
  statCard: { backgroundColor: "#FFFFFF", borderRadius: 8, padding: 16, marginBottom: 12 },
  statHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  statIcon: { fontSize: 24 },
  statChange: { fontSize: 13, fontWeight: "600" },
  statLabel: { fontSize: 11, color: "#999", fontWeight: "600", marginBottom: 6, letterSpacing: 0.5 },
  statValue: { fontSize: 22, fontWeight: "700", color: "#1A1A1A" },
  chartContainer: { backgroundColor: "#FFFFFF", marginHorizontal: 16, borderRadius: 8, padding: 16, marginBottom: 16 },
  chartTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  chartPlaceholder: { height: 140, backgroundColor: "#F5F5F5", borderRadius: 6, justifyContent: "flex-end", alignItems: "center", paddingBottom: 12 },
  barChart: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", width: "100%", height: "100%", paddingHorizontal: 12 },
  bar: { width: "15%", backgroundColor: "#B0E0E6", borderRadius: 2 },
  chartLegend: { flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#00A8E8" },
  legendText: { fontSize: 12, color: "#666" },
  alertContainer: { backgroundColor: "#1A1A2E", marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 180 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 },
  alertMessage: { fontSize: 12, color: "#B0B0B0" },
  alertImageContainer: { width: 100, height: 120, justifyContent: "center", alignItems: "center" },
  alertImagePlaceholder: { fontSize: 80, opacity: 0.6 },
  manageStockButton: { backgroundColor: "#00A8E8", marginHorizontal: 16, marginBottom: 16, paddingVertical: 14, borderRadius: 24, alignItems: "center" },
  manageStockButtonText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
  recentContainer: { backgroundColor: "#FFFFFF", marginHorizontal: 16, borderRadius: 8, padding: 16, marginBottom: 16 },
  recentTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  inventoryHeader: { flexDirection: "row", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#F0F0F0", marginBottom: 10 },
  inventoryHeaderText: { fontSize: 12, fontWeight: "600", color: "#999" },
  inventoryItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  inventoryIcon: { width: 36, height: 36, borderRadius: 6, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center", marginRight: 12 },
  inventoryName: { flex: 1, fontSize: 13, fontWeight: "600", color: "#1A1A1A" },
  inventoryStatus: { fontSize: 12, fontWeight: "600" },
  spacer: { height: 100 },
  categoriesContainer: { backgroundColor: "#FFFFFF", marginHorizontal: 16, borderRadius: 8, padding: 16, marginBottom: 16 },
  categoriesTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categoryCard: { width: "31%", backgroundColor: "#F5F5F5", borderRadius: 8, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0", marginBottom: 10 },
  categoryIcon: { fontSize: 28, marginBottom: 6 },
  categoryLabel: { fontSize: 11, fontWeight: "600", color: "#1A1A1A", textAlign: "center", marginBottom: 4 },
  categoryCount: { fontSize: 14, fontWeight: "700", color: "#00A8E8" },
});
