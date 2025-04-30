// src/routes/routes.js

// Definisikan konstanta role di sini agar konsisten dan mudah di-refactor
// Nama harus sama persis dengan enum UserRole di Prisma
const ROLES = {
  ADMIN: "ADMIN",
  SALES_ACQUISITION: "SALES_ACQUISITION",
  SALES_RETENTION: "SALES_RETENTION",
  MARKETPLACE_MANAGER: "MARKETPLACE_MANAGER",
  WAREHOUSE_STAFF: "WAREHOUSE_STAFF",
  FINANCE_STAFF: "FINANCE_STAFF",
};

const routes = [
  // Rute Autentikasi (Publik)
  {
    path: "login",
    component: "Login",
    isPrivate: false,
    showInSidebar: false,
    title: "Login",
    // requiredRoles: tidak perlu
  },
  {
    path: "register",
    component: "Register",
    isPrivate: false,
    showInSidebar: false,
    title: "Register",
    // requiredRoles: tidak perlu
  },

  // Rute Utama Aplikasi (Private)
  {
    path: "dashboard",
    component: "Dashboard",
    icon: "Dashboard",
    isPrivate: true, // Private
    showInSidebar: true,
    title: "Dashboard",
    // requiredRoles: tidak ada (semua user login bisa akses)
  },
  {
    path: "sales",
    component: "Sales", // Layout Induk
    icon: "LocalShipping",
    isPrivate: true,
    showInSidebar: true,
    title: "Sales Management",
    // Role yang bisa akses bagian Sales secara umum
    requiredRoles: [
      ROLES.ADMIN,
      ROLES.SALES_ACQUISITION,
      ROLES.SALES_RETENTION,
      ROLES.MARKETPLACE_MANAGER,
      // ROLES.FINANCE_STAFF, // Opsional, tergantung kebutuhan
    ],
    children: [
      {
        path: "orders",
        component: "OrderListPage",
        title: "Daftar Pesanan",
        showInSidebar: true,
        // Role yang bisa lihat semua order (lebih luas)
        requiredRoles: [
          ROLES.ADMIN,
          ROLES.SALES_ACQUISITION, // Bisa lihat semua? atau hanya miliknya? Tentukan kebijakannya
          ROLES.SALES_RETENTION, // Bisa lihat semua? atau hanya miliknya?
          ROLES.MARKETPLACE_MANAGER,
          ROLES.WAREHOUSE_STAFF, // Perlu lihat order untuk proses
          ROLES.FINANCE_STAFF, // Perlu lihat untuk keuangan
        ],
      },
      {
        path: "acquisition",
        component: "Acquisition", // Layout
        showInSidebar: true,
        title: "Sales Acquisition",
        requiredRoles: [ROLES.ADMIN, ROLES.SALES_ACQUISITION], // Hanya Admin & Tim Akuisisi
        children: [
          // Children di sini akan mewarisi role parent secara implisit
          // jika tidak didefinisikan ulang
          {
            path: "input-order",
            component: "InputOrderAcquisition",
            title: "Input Order (Acquisition)",
          },
          {
            path: "lead",
            component: "LeadManagement",
            title: "Lead Management",
          },
          {
            path: "campaign",
            component: "CampaignMarketing",
            title: "Campaign Marketing",
          },
          {
            path: "analytics",
            component: "SalesAnalytics",
            title: "Sales Analytics",
          },
        ],
      },
      {
        path: "retention",
        component: "Retention", // Layout
        showInSidebar: true,
        title: "Sales Retention",
        requiredRoles: [ROLES.ADMIN, ROLES.SALES_RETENTION], // Hanya Admin & Tim Retensi
        children: [
          {
            path: "input-order",
            component: "InputOrderRetention",
            title: "Input Order (Retention)",
          },
          {
            path: "loyalty",
            component: "LoyaltyProgram",
            title: "Loyalty Program",
          },
          {
            path: "followup",
            component: "CustomerFollowUp",
            title: "Customer Follow Up",
          },
          {
            path: "feedback",
            component: "FeedbackManagement",
            title: "Feedback Management",
          },
        ],
      },
      {
        path: "marketplace",
        component: "Marketplace", // Layout
        showInSidebar: true,
        title: "Marketplace Sales",
        requiredRoles: [ROLES.ADMIN, ROLES.MARKETPLACE_MANAGER], // Hanya Admin & Manajer Marketplace
        children: [
          {
            index: true,
            component: "MarketplaceOverview",
            title: "Marketplace Overview",
            showInSidebar: false,
          },
          {
            path: "input-order",
            component: "InputOrderMarketplace",
            title: "Input Order (Marketplace)",
            children: [
              {
                path: "shopee",
                component: "ImportShopeeOrder",
                title: "Import Order (Shopee)",
              },
              {
                path: "tokopedia",
                component: "ImportTokopediaOrder",
                title: "Import Order (Tokopedia)",
              },
              {
                path: "tiktokshop",
                component: "ImportTiktokshopOrder",
                title: "Import Order (TikTok Shop)",
              },
            ],
          },
          {
            path: "integration",
            component: "MarketplaceIntegration",
            title: "Marketplace Integration",
          },
          {
            path: "analytics",
            component: "MarketplacePerformanceAnalysis",
            title: "Marketplace Performance",
          },
          {
            path: "products",
            component: "MarketplaceProductSettings",
            title: "Marketplace Product Settings",
          },
          {
            path: "settings",
            component: "MarketplaceSettings",
            title: "Store Settings",
          },
        ],
      },
    ],
  },
  {
    path: "customer",
    component: "Customer", // Layout
    icon: "Group",
    isPrivate: true,
    showInSidebar: true,
    title: "Customer Management",
    requiredRoles: [
      ROLES.ADMIN,
      ROLES.SALES_ACQUISITION,
      ROLES.SALES_RETENTION,
      ROLES.MARKETPLACE_MANAGER /* mungkin? */,
    ],
    children: [
      // Children akan mewarisi role parent
      {
        path: "data",
        component: "CustomerData",
        showInSidebar: true,
        title: "Customer Data",
      },
      {
        path: "segmentation",
        component: "CustomerSegmentation",
        showInSidebar: true,
        title: "Customer Segmentation",
      },
      {
        path: "transactions",
        component: "TransactionHistory",
        showInSidebar: true,
        title: "Transaction History",
      },
      {
        path: "communication",
        component: "Communication",
        showInSidebar: true,
        title: "Communication Log",
      },
      {
        path: "ticket",
        component: "SupportTicket",
        showInSidebar: true,
        title: "Support Tickets",
      },
    ],
  },
  {
    path: "product",
    component: "Product", // Layout
    icon: "Store",
    isPrivate: true,
    showInSidebar: true,
    title: "Product Management",
    requiredRoles: [
      ROLES.ADMIN,
      ROLES.MARKETPLACE_MANAGER,
      ROLES.WAREHOUSE_STAFF /* melihat? */,
    ],
    children: [
      {
        path: "catalog",
        component: "ProductCatalog",
        showInSidebar: true,
        title: "Product Catalog",
      },
      {
        path: "categories",
        component: "ProductCategories",
        showInSidebar: true,
        title: "Product Categories",
      },
      {
        path: "suppliers",
        component: "SupplierManagement",
        showInSidebar: true,
        title: "Supplier Management",
      },
      {
        path: "pricing",
        component: "PricingManagement",
        showInSidebar: true,
        title: "Pricing Management",
      },
    ],
  },
  {
    path: "warehouse",
    component: "Warehouse", // Layout
    icon: "Inventory",
    isPrivate: true,
    showInSidebar: true,
    title: "Warehouse Management",
    requiredRoles: [ROLES.ADMIN, ROLES.WAREHOUSE_STAFF], // Hanya Admin & Staf Gudang
    children: [
      {
        path: "orders",
        component: "Orders",
        showInSidebar: true,
        title: "Warehouse Orders",
        children: [
          {
            path: "processing",
            component: "OrderProcessing",
            title: "Order Processing",
          },
          {
            path: "tracking",
            component: "OrderTracking",
            title: "Order Tracking",
          },
          {
            path: "refund",
            component: "ReturnsAndRefunds",
            title: "Returns & Refunds",
          },
        ],
      },
      {
        path: "stock",
        component: "Stock",
        showInSidebar: true,
        title: "Stock Management",
        children: [
          {
            path: "inventory",
            component: "InventoryManagement",
            title: "Inventory Management",
          },
          {
            path: "restock",
            component: "RestockAlert",
            title: "Restock Alerts",
          },
          {
            path: "adjustment",
            component: "StockAdjustment",
            title: "Stock Adjustments",
          },
        ],
      },
      {
        path: "shipping",
        component: "Shipping",
        showInSidebar: true,
        title: "Shipping Management",
        children: [
          {
            path: "providers",
            component: "ShippingProviders",
            title: "Shipping Providers",
          },
          {
            path: "tracking",
            component: "ShippingTracking",
            title: "Shipping Tracking",
          },
          {
            path: "labels",
            component: "ShippingLabels",
            title: "Shipping Labels",
          },
        ],
      },
    ],
  },
  {
    path: "finance",
    component: "Finance", // Layout
    icon: "Paid",
    isPrivate: true,
    showInSidebar: true,
    title: "Finance",
    requiredRoles: [ROLES.ADMIN, ROLES.FINANCE_STAFF], // Hanya Admin & Staf Finance
    children: [
      {
        path: "invoices",
        component: "Invoices",
        showInSidebar: true,
        title: "Invoices",
      },
      {
        path: "payments",
        component: "Payments",
        showInSidebar: true,
        title: "Payments",
      },
      {
        path: "reports",
        component: "FinancialReports",
        showInSidebar: true,
        title: "Financial Reports",
      },
      {
        path: "expenses",
        component: "Expenses",
        showInSidebar: true,
        title: "Expenses",
      },
      {
        path: "taxes",
        component: "Taxes",
        showInSidebar: true,
        title: "Taxes",
      },
    ],
  },
  {
    path: "reports",
    component: "Reports", // Layout
    icon: "Assessment",
    isPrivate: true,
    showInSidebar: true,
    title: "Reports",
    // Semua role bisa lihat laporan umum? Atau hanya Admin/Finance?
    requiredRoles: [
      ROLES.ADMIN,
      ROLES.FINANCE_STAFF,
      ROLES.MARKETPLACE_MANAGER /*?*/,
    ],
    children: [
      {
        path: "sales",
        component: "SalesAnalysis",
        showInSidebar: true,
        title: "Sales Analysis Report",
      },
      {
        path: "profit",
        component: "ProfitReports",
        showInSidebar: true,
        title: "Profit Reports",
        requiredRoles: [ROLES.ADMIN, ROLES.FINANCE_STAFF],
      }, // Hanya Admin/Finance
      {
        path: "products",
        component: "ProductPerformanceReports",
        showInSidebar: true,
        title: "Product Performance",
      },
      {
        path: "suppliers",
        component: "SupplierReports",
        showInSidebar: true,
        title: "Supplier Reports",
      },
    ],
  },
  {
    path: "settings", // Path: /settings
    component: "Settings", // Layout induk Settings.jsx
    icon: "Settings",
    isPrivate: true,
    showInSidebar: true,
    title: "Settings",
    requiredRoles: [ROLES.ADMIN], // Hanya ADMIN akses settings
    children: [
      // --- TAMBAHKAN RUTE INDEX INI ---
      {
        index: true, // Rute default untuk /settings
        component: "SettingsOverview", // Komponen dashboard settings
        title: "Settings Overview", // Opsional
        showInSidebar: false, // Biasanya tidak perlu di sidebar
      },
      {
        path: "profile",
        component: "BusinessProfile",
        showInSidebar: true,
        title: "Business Profile",
        // Untuk profile, kita override agar semua user login bisa akses
        // Cara handle override ini tergantung implementasi guard Anda
        // Opsi 1: Hapus requiredRoles di parent dan definisikan di semua child kecuali profile
        // Opsi 2: Tambahkan properti 'allowAllLoggedIn: true' khusus untuk profile
        // Opsi 3: Buat rute profile di luar /settings
        // Untuk sekarang, biarkan mewarisi ADMIN demi kesederhanaan metadata
      },
      {
        path: "users",
        component: "UserManagementPage",
        showInSidebar: true,
        title: "User Management",
      }, // Mewarisi ADMIN
      {
        path: "api",
        component: "APIIntegration",
        showInSidebar: true,
        title: "API Integration",
      }, // Mewarisi ADMIN
      {
        path: "notifications",
        component: "Notifications",
        showInSidebar: true,
        title: "Notifications",
      }, // Mewarisi ADMIN
    ],
  },
];

export default routes;
